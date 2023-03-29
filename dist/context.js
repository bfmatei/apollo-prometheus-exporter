"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateContext = void 0;
const prom_client_1 = require("prom-client");
const metrics_1 = require("./metrics");
function generateContext(options) {
    var _a, _b;
    const context = {
        app: options.app,
        defaultLabels: {},
        defaultMetrics: true,
        disabledMetrics: [],
        durationHistogramsBuckets: [0.001, 0.005, 0.015, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 1, 5, 10],
        hostnameLabel: true,
        hostnameLabelName: 'hostname',
        metricsEndpoint: true,
        metricsEndpointPath: '/metrics',
        register: prom_client_1.register,
        ...options,
        skipMetrics: {
            [metrics_1.MetricsNames.SERVER_STARTING]: () => false,
            [metrics_1.MetricsNames.SERVER_CLOSING]: () => false,
            [metrics_1.MetricsNames.QUERY_STARTED]: () => false,
            [metrics_1.MetricsNames.QUERY_FAILED]: () => false,
            [metrics_1.MetricsNames.QUERY_PARSE_STARTED]: () => false,
            [metrics_1.MetricsNames.QUERY_PARSE_FAILED]: () => false,
            [metrics_1.MetricsNames.QUERY_VALIDATION_STARTED]: () => false,
            [metrics_1.MetricsNames.QUERY_VALIDATION_FAILED]: () => false,
            [metrics_1.MetricsNames.QUERY_RESOLVED]: () => false,
            [metrics_1.MetricsNames.QUERY_EXECUTION_STARTED]: () => false,
            [metrics_1.MetricsNames.QUERY_EXECUTION_FAILED]: () => false,
            [metrics_1.MetricsNames.QUERY_DURATION]: () => false,
            [metrics_1.MetricsNames.QUERY_FIELD_RESOLUTION_DURATION]: () => false,
            ...((_a = options.skipMetrics) !== null && _a !== void 0 ? _a : {})
        },
        defaultMetricsOptions: {
            register: prom_client_1.register,
            ...((_b = options.defaultMetricsOptions) !== null && _b !== void 0 ? _b : {})
        }
    };
    if (context.metricsEndpoint) {
        if (!context.app) {
            throw new Error('app option is not defined. Disable metricsEndpoint or pass app');
        }
        if (!context.metricsEndpointPath) {
            throw new Error('Malformed metricsEndpointPath option');
        }
    }
    if (context.hostnameLabel) {
        if (!context.hostnameLabelName) {
            throw new Error('Malformed hostnameLabelName option');
        }
        if (Object.keys(context.defaultLabels).includes(context.hostnameLabelName)) {
            throw new Error('hostnameLabelName option is already defined in defaultLabels');
        }
    }
    if (context.durationHistogramsBuckets.length === 0) {
        throw new Error('durationHistogramsBuckets option must not be empty');
    }
    return context;
}
exports.generateContext = generateContext;
//# sourceMappingURL=context.js.map