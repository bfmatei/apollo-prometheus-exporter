'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.createPrometheusExporterPlugin = exports.MetricsNames = exports.registerPrometheusExporterEndpoint = void 0;
var endpoint_1 = require('./endpoint');
Object.defineProperty(exports, 'registerPrometheusExporterEndpoint', {
  enumerable: true,
  get: function () {
    return endpoint_1.registerEndpoint;
  }
});
var metrics_1 = require('./metrics');
Object.defineProperty(exports, 'MetricsNames', {
  enumerable: true,
  get: function () {
    return metrics_1.MetricsNames;
  }
});
var plugin_1 = require('./plugin');
Object.defineProperty(exports, 'createPrometheusExporterPlugin', {
  enumerable: true,
  get: function () {
    return plugin_1.createPlugin;
  }
});
