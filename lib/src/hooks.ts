import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { TracingFormat } from 'apollo-tracing';
import { Counter, Histogram, LabelValues } from 'prom-client';

import { convertNsToS, filterLabels } from './helpers';
import { MetricsNames, Metrics, MetricTypes } from './metrics';

export function getLabelsFromContext(context: any): LabelValues<string> {
  return {
    operationName: context?.request?.operationName,
    operation: context?.operation?.operation
  };
}

export function getLabelsFromFieldResolver({
  fieldName,
  parentType,
  returnType
}: TracingFormat['execution']['resolvers'][number]): LabelValues<string> {
  return {
    fieldName,
    parentType,
    returnType
  };
}

export function generateHooks(metrics: Metrics): ApolloServerPlugin {
  const actionMetric = (name: MetricsNames, labels: LabelValues<string> = {}, value?: any) => {
    if (!metrics[name].disabled) {
      const filteredLabels = filterLabels(labels);

      switch (metrics[name].type) {
        case MetricTypes.COUNTER:
          (metrics[name].instance as Counter<string>).inc(filteredLabels);
          break;

        case MetricTypes.HISTOGRAM:
          (metrics[name].instance as Histogram<string>).observe(filteredLabels, convertNsToS(value));
          break;
      }
    }
  };

  return {
    serverWillStart() {
      actionMetric(MetricsNames.SERVER_STARTING);

      return {
        serverWillStop() {
          actionMetric(MetricsNames.SERVER_CLOSING);
        }
      };
    },

    requestDidStart(requestContext) {
      actionMetric(MetricsNames.QUERY_STARTED, getLabelsFromContext(requestContext));

      return {
        parsingDidStart(context) {
          actionMetric(MetricsNames.QUERY_PARSE_STARTED, getLabelsFromContext(context));

          return (err) => {
            if (err) {
              actionMetric(MetricsNames.QUERY_PARSE_FAILED, getLabelsFromContext(context));
            }
          };
        },

        validationDidStart(context) {
          actionMetric(MetricsNames.QUERY_VALIDATION_STARTED, getLabelsFromContext(context));

          return (err) => {
            if (err) {
              actionMetric(MetricsNames.QUERY_VALIDATION_FAILED, getLabelsFromContext(context));
            }
          };
        },

        didResolveOperation(context) {
          actionMetric(MetricsNames.QUERY_RESOLVED, getLabelsFromContext(context));
        },

        executionDidStart(context) {
          actionMetric(MetricsNames.QUERY_EXECUTION_STARTED, getLabelsFromContext(context));

          return (err) => {
            if (err) {
              actionMetric(MetricsNames.QUERY_EXECUTION_FAILED, getLabelsFromContext(context));
            }
          };
        },

        didEncounterErrors(context) {
          actionMetric(MetricsNames.QUERY_FAILED, getLabelsFromContext(context));
        },

        willSendResponse(context) {
          const tracing: TracingFormat = context.response.extensions?.tracing;

          if (tracing && tracing.version === 1) {
            const contextLabels = getLabelsFromContext(context);

            actionMetric(MetricsNames.QUERY_DURATION, contextLabels, tracing.duration);

            tracing.execution.resolvers.forEach((resolver) => {
              actionMetric(
                MetricsNames.QUERY_FIELD_RESOLUTION_DURATION,
                {
                  ...contextLabels,
                  ...getLabelsFromFieldResolver(resolver)
                },
                resolver.duration
              );
            });
          }
        }
      };
    }
  };
}
