"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMetrics = exports.metricsConfig = exports.fieldLabelNames = exports.queryLabelNames = exports.serverLabelNames = exports.MetricTypes = exports.MetricsNames = void 0;
const prom_client_1 = require("prom-client");
var MetricsNames;
(function (MetricsNames) {
    MetricsNames["SERVER_STARTING"] = "apollo_server_starting";
    MetricsNames["SERVER_CLOSING"] = "apollo_server_closing";
    MetricsNames["QUERY_STARTED"] = "apollo_query_started";
    MetricsNames["QUERY_FAILED"] = "apollo_query_failed";
    MetricsNames["QUERY_PARSE_STARTED"] = "apollo_query_parse_started";
    MetricsNames["QUERY_PARSE_FAILED"] = "apollo_query_parse_failed";
    MetricsNames["QUERY_VALIDATION_STARTED"] = "apollo_query_validation_started";
    MetricsNames["QUERY_VALIDATION_FAILED"] = "apollo_query_validation_failed";
    MetricsNames["QUERY_RESOLVED"] = "apollo_query_resolved";
    MetricsNames["QUERY_EXECUTION_STARTED"] = "apollo_query_execution_started";
    MetricsNames["QUERY_EXECUTION_FAILED"] = "apollo_query_execution_failed";
    MetricsNames["QUERY_DURATION"] = "apollo_query_duration";
    MetricsNames["QUERY_FIELD_RESOLUTION_DURATION"] = "apollo_query_field_resolution_duration";
})(MetricsNames = exports.MetricsNames || (exports.MetricsNames = {}));
var MetricTypes;
(function (MetricTypes) {
    MetricTypes[MetricTypes["GAUGE"] = 0] = "GAUGE";
    MetricTypes[MetricTypes["COUNTER"] = 1] = "COUNTER";
    MetricTypes[MetricTypes["HISTOGRAM"] = 2] = "HISTOGRAM";
})(MetricTypes = exports.MetricTypes || (exports.MetricTypes = {}));
exports.serverLabelNames = ['version'];
exports.queryLabelNames = ['operationName', 'operation'];
exports.fieldLabelNames = ['operationName', 'operation', 'fieldName', 'parentType', 'returnType', 'pathLength'];
exports.metricsConfig = [
    {
        name: MetricsNames.SERVER_STARTING,
        help: 'The last timestamp when Apollo Server was starting.',
        type: MetricTypes.GAUGE,
        labelNames: exports.serverLabelNames
    },
    {
        name: MetricsNames.SERVER_CLOSING,
        help: 'The last timestamp when Apollo Server was closing.',
        type: MetricTypes.GAUGE,
        labelNames: exports.serverLabelNames
    },
    {
        name: MetricsNames.QUERY_STARTED,
        help: 'The amount of received queries.',
        type: MetricTypes.COUNTER,
        labelNames: exports.queryLabelNames
    },
    {
        name: MetricsNames.QUERY_PARSE_STARTED,
        help: 'The amount of queries for which parsing has started.',
        type: MetricTypes.COUNTER,
        labelNames: exports.queryLabelNames
    },
    {
        name: MetricsNames.QUERY_PARSE_FAILED,
        help: 'The amount of queries for which parsing has failed.',
        type: MetricTypes.COUNTER,
        labelNames: exports.queryLabelNames
    },
    {
        name: MetricsNames.QUERY_VALIDATION_STARTED,
        help: 'The amount of queries for which validation has started.',
        type: MetricTypes.COUNTER,
        labelNames: exports.queryLabelNames
    },
    {
        name: MetricsNames.QUERY_VALIDATION_FAILED,
        help: 'The amount of queries for which validation has failed.',
        type: MetricTypes.COUNTER,
        labelNames: exports.queryLabelNames
    },
    {
        name: MetricsNames.QUERY_RESOLVED,
        help: 'The amount of queries which could be resolved.',
        type: MetricTypes.COUNTER,
        labelNames: exports.queryLabelNames
    },
    {
        name: MetricsNames.QUERY_EXECUTION_STARTED,
        help: 'The amount of queries for which execution has started.',
        type: MetricTypes.COUNTER,
        labelNames: exports.queryLabelNames
    },
    {
        name: MetricsNames.QUERY_EXECUTION_FAILED,
        help: 'The amount of queries for which execution has failed.',
        type: MetricTypes.COUNTER,
        labelNames: exports.queryLabelNames
    },
    {
        name: MetricsNames.QUERY_FAILED,
        help: 'The amount of queries that failed.',
        type: MetricTypes.COUNTER,
        labelNames: exports.queryLabelNames
    },
    {
        name: MetricsNames.QUERY_DURATION,
        help: 'The total duration of a query.',
        type: MetricTypes.HISTOGRAM,
        labelNames: [...exports.queryLabelNames, 'success']
    },
    {
        name: MetricsNames.QUERY_FIELD_RESOLUTION_DURATION,
        help: 'The total duration for resolving fields.',
        type: MetricTypes.HISTOGRAM,
        labelNames: exports.fieldLabelNames
    }
];
function generateMetrics(register, { durationHistogramsBuckets, skipMetrics }) {
    return exports.metricsConfig.reduce((acc, metric) => {
        acc[metric.name] = {
            type: metric.type,
            skip: skipMetrics[metric.name],
            instance: null
        };
        const commonConfig = {
            name: metric.name,
            help: metric.help,
            labelNames: metric.labelNames,
            registers: [register]
        };
        switch (metric.type) {
            case MetricTypes.GAUGE:
                acc[metric.name].instance = new prom_client_1.Gauge(commonConfig);
                break;
            case MetricTypes.COUNTER:
                acc[metric.name].instance = new prom_client_1.Counter(commonConfig);
                break;
            case MetricTypes.HISTOGRAM:
                acc[metric.name].instance = new prom_client_1.Histogram({
                    ...commonConfig,
                    buckets: durationHistogramsBuckets
                });
                break;
        }
        return acc;
    }, {});
}
exports.generateMetrics = generateMetrics;
//# sourceMappingURL=metrics.js.map