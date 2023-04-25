// import apolloPackageJson, { ApolloServer } from '@apollo/server';
import { ApolloServerPlugin, GraphQLFieldResolverParams } from '@apollo/server';
import { Path } from 'graphql/jsutils/Path';
import { Counter, Gauge, Histogram, LabelValues } from 'prom-client';

import { convertMsToS, filterLabels } from './helpers';
import { ContextTypes, FieldTypes, MetricsNames, Metrics, MetricTypes } from './metrics';

export function getLabelsFromContext(context: any): LabelValues<string> {
  return {
    operationName: context?.request?.operationName,
    operation: context?.operation?.operation
  };
}

export function countFieldAncestors(path: Path | undefined): string {
  let counter = 0;

  while (path !== undefined) {
    path = path.prev;
    counter++;
  }

  return counter.toString();
}

// export function getApolloServerVersion(): string | undefined {
//   // return apolloPackageJson;
// }

export function getLabelsFromFieldResolver({
  info: { fieldName, parentType, path, returnType }
}: GraphQLFieldResolverParams<any, any>): LabelValues<string> {
  return {
    fieldName,
    parentType: parentType.name,
    pathLength: countFieldAncestors(path),
    returnType: returnType.toString()
  };
}

export function generateHooks(metrics: Metrics): ApolloServerPlugin {
  const actionMetric = (
    {
      name,
      labels = {},
      value
    }: {
      name: MetricsNames;
      labels: LabelValues<string>;
      value?: number;
    },
    context?: ContextTypes,
    field?: FieldTypes
  ) => {
    if (!metrics[name].skip(labels, context!, field!)) {
      const filteredLabels = filterLabels(labels);

      switch (metrics[name].type) {
        case MetricTypes.GAUGE:
          (metrics[name].instance as Gauge<string>).set(filteredLabels, convertMsToS(value as number));
          break;

        case MetricTypes.COUNTER:
          (metrics[name].instance as Counter<string>).inc(filteredLabels);
          break;

        case MetricTypes.HISTOGRAM:
          (metrics[name].instance as Histogram<string>).observe(filteredLabels, convertMsToS(value as number));
          break;
      }
    }
  };

  return {
    async serverWillStart() {
      const version = '4.5.0';
      //hardcoded for testing
      actionMetric({
        name: MetricsNames.SERVER_STARTING,
        labels: {
          version
        },
        value: Date.now()
      });

      return {
        async serverWillStop() {
          actionMetric({
            name: MetricsNames.SERVER_CLOSING,
            labels: {
              version
            },
            value: Date.now()
          });
        }
      };
    },

    async requestDidStart(requestContext) {
      const requestStartDate = Date.now();

      actionMetric({ name: MetricsNames.QUERY_STARTED, labels: getLabelsFromContext(requestContext) }, requestContext);

      return {
        async parsingDidStart(context) {
          actionMetric({ name: MetricsNames.QUERY_PARSE_STARTED, labels: getLabelsFromContext(context) }, context);

          return async (err) => {
            if (err) {
              actionMetric({ name: MetricsNames.QUERY_PARSE_FAILED, labels: getLabelsFromContext(context) }, context);
            }
          };
        },

        async validationDidStart(context) {
          actionMetric({ name: MetricsNames.QUERY_VALIDATION_STARTED, labels: getLabelsFromContext(context) }, context);

          return async (err) => {
            if (err) {
              actionMetric(
                { name: MetricsNames.QUERY_VALIDATION_FAILED, labels: getLabelsFromContext(context) },
                context
              );
            }
          };
        },

        async didResolveOperation(context) {
          actionMetric({ name: MetricsNames.QUERY_RESOLVED, labels: getLabelsFromContext(context) }, context);
        },

        async executionDidStart(context) {
          actionMetric({ name: MetricsNames.QUERY_EXECUTION_STARTED, labels: getLabelsFromContext(context) }, context);

          return {
            willResolveField(field: GraphQLFieldResolverParams<any, any>) {
              const fieldResolveStart = Date.now();

              return () => {
                const fieldResolveEnd = Date.now();

                actionMetric(
                  {
                    name: MetricsNames.QUERY_FIELD_RESOLUTION_DURATION,
                    labels: {
                      ...getLabelsFromContext(context),
                      ...getLabelsFromFieldResolver(field)
                    },
                    value: fieldResolveEnd - fieldResolveStart
                  },
                  context,
                  field
                );
              };
            },
            async executionDidEnd(err) {
              if (err) {
                actionMetric(
                  { name: MetricsNames.QUERY_EXECUTION_FAILED, labels: getLabelsFromContext(context) },
                  context
                );
              }
            }
          };
        },

        async didEncounterErrors(context) {
          const requestEndDate = Date.now();

          actionMetric({ name: MetricsNames.QUERY_FAILED, labels: getLabelsFromContext(context) }, context);

          actionMetric(
            {
              name: MetricsNames.QUERY_DURATION,
              labels: {
                ...getLabelsFromContext(context),
                success: 'false'
              },
              value: requestEndDate - requestStartDate
            },
            context
          );
        },

        async willSendResponse(context) {
          const requestEndDate = Date.now();

          if ((context.errors?.length ?? 0) === 0) {
            actionMetric(
              {
                name: MetricsNames.QUERY_DURATION,
                labels: {
                  ...getLabelsFromContext(context),
                  success: 'true'
                },
                value: requestEndDate - requestStartDate
              },
              context
            );
          }
        }
      };
    }
  };
}
