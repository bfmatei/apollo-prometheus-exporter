'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.generateHooks = exports.getLabelsFromFieldResolver = exports.countFieldAncestors = exports.getLabelsFromContext = void 0;
const helpers_1 = require('./helpers');
const metrics_1 = require('./metrics');
function getLabelsFromContext(context, service) {
  var _a, _b, _c;
  return {
    operationName:
      (_a = context === null || context === void 0 ? void 0 : context.request) === null || _a === void 0
        ? void 0
        : _a.operationName,
    operation:
      (_b = context === null || context === void 0 ? void 0 : context.operation) === null || _b === void 0
        ? void 0
        : _b.operation,
    app: (_c = context.request.http) === null || _c === void 0 ? void 0 : _c.headers.get('app'),
    service: service
  };
}
exports.getLabelsFromContext = getLabelsFromContext;
function countFieldAncestors(path) {
  let counter = 0;
  while (path !== undefined) {
    path = path.prev;
    counter++;
  }
  return counter.toString();
}
exports.countFieldAncestors = countFieldAncestors;
// export function getApolloServerVersion(): string | undefined {
//   // return apolloPackageJson;
// }
function getLabelsFromFieldResolver({ info: { fieldName, parentType, path, returnType } }) {
  return {
    fieldName,
    parentType: parentType.name,
    pathLength: countFieldAncestors(path),
    returnType: returnType.toString()
  };
}
exports.getLabelsFromFieldResolver = getLabelsFromFieldResolver;
function generateHooks(metrics, service) {
  const actionMetric = ({ name, labels = {}, value }, context, field) => {
    if (!metrics[name].skip(labels, context, field)) {
      const filteredLabels = (0, helpers_1.filterLabels)(labels);
      switch (metrics[name].type) {
        case metrics_1.MetricTypes.GAUGE:
          metrics[name].instance.set(filteredLabels, (0, helpers_1.convertMsToS)(value));
          break;
        case metrics_1.MetricTypes.COUNTER:
          metrics[name].instance.inc(filteredLabels);
          break;
        case metrics_1.MetricTypes.HISTOGRAM:
          metrics[name].instance.observe(filteredLabels, (0, helpers_1.convertMsToS)(value));
          break;
      }
    }
  };
  return {
    async serverWillStart() {
      const version = '4.5.0';
      //hardcoded for testing
      actionMetric({
        name: metrics_1.MetricsNames.SERVER_STARTING,
        labels: {
          version
        },
        value: Date.now()
      });
      return {
        async serverWillStop() {
          actionMetric({
            name: metrics_1.MetricsNames.SERVER_CLOSING,
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
      console.log('metrics label', getLabelsFromContext(requestContext, service));
      actionMetric(
        { name: metrics_1.MetricsNames.QUERY_STARTED, labels: getLabelsFromContext(requestContext, service) },
        requestContext
      );
      return {
        async parsingDidStart(context) {
          actionMetric(
            { name: metrics_1.MetricsNames.QUERY_PARSE_STARTED, labels: getLabelsFromContext(context, service) },
            context
          );
          return async (err) => {
            if (err) {
              actionMetric(
                { name: metrics_1.MetricsNames.QUERY_PARSE_FAILED, labels: getLabelsFromContext(context, service) },
                context
              );
            }
          };
        },
        async validationDidStart(context) {
          actionMetric(
            { name: metrics_1.MetricsNames.QUERY_VALIDATION_STARTED, labels: getLabelsFromContext(context, service) },
            context
          );
          return async (err) => {
            if (err) {
              actionMetric(
                {
                  name: metrics_1.MetricsNames.QUERY_VALIDATION_FAILED,
                  labels: getLabelsFromContext(context, service)
                },
                context
              );
            }
          };
        },
        async didResolveOperation(context) {
          actionMetric(
            { name: metrics_1.MetricsNames.QUERY_RESOLVED, labels: getLabelsFromContext(context, service) },
            context
          );
        },
        async executionDidStart(context) {
          actionMetric(
            { name: metrics_1.MetricsNames.QUERY_EXECUTION_STARTED, labels: getLabelsFromContext(context, service) },
            context
          );
          return {
            willResolveField(field) {
              const fieldResolveStart = Date.now();
              return () => {
                const fieldResolveEnd = Date.now();
                actionMetric(
                  {
                    name: metrics_1.MetricsNames.QUERY_FIELD_RESOLUTION_DURATION,
                    labels: {
                      ...getLabelsFromContext(context, service),
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
                  {
                    name: metrics_1.MetricsNames.QUERY_EXECUTION_FAILED,
                    labels: getLabelsFromContext(context, service)
                  },
                  context
                );
              }
            }
          };
        },
        async didEncounterErrors(context) {
          const requestEndDate = Date.now();
          actionMetric(
            { name: metrics_1.MetricsNames.QUERY_FAILED, labels: getLabelsFromContext(context, service) },
            context
          );
          actionMetric(
            {
              name: metrics_1.MetricsNames.QUERY_DURATION,
              labels: {
                ...getLabelsFromContext(context, service),
                success: 'false'
              },
              value: requestEndDate - requestStartDate
            },
            context
          );
        },
        async willSendResponse(context) {
          var _a, _b;
          const requestEndDate = Date.now();
          if (
            ((_b = (_a = context.errors) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0
              ? _b
              : 0) === 0
          ) {
            actionMetric(
              {
                name: metrics_1.MetricsNames.QUERY_DURATION,
                labels: {
                  ...getLabelsFromContext(context, service),
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
exports.generateHooks = generateHooks;
