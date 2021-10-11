# Apollo Prometheus Exporter

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/bfmatei/apollo-prometheus-exporter/Release)
![npm](https://img.shields.io/npm/v/@bmatei/apollo-prometheus-exporter)

Plugin for Apollo Server to export metrics in Prometheus format.

It uses [prom-client](https://github.com/siimon/prom-client) under the hood the export the metrics.

Since Apollo Server released a new major version, a new version (v2.x.y) of the exporter has been launched. Apollo
Server v2 is still supported in v1.x.y. The two versions will be features-matched as much as possible.

## Metrics

| Name                                     | Description                                             | Type      |
| ---------------------------------------- | ------------------------------------------------------- | --------- |
| `apollo_server_starting`                 | The last timestamp when Apollo Server was starting.     | Gauge     |
| `apollo_server_closing`                  | The last timestamp when Apollo Server was closing.      | Gauge     |
| `apollo_query_started`                   | The amount of received queries.                         | Counter   |
| `apollo_query_failed`                    | The amount of queries that failed.                      | Counter   |
| `apollo_query_parse_started`             | The amount of queries for which parsing has started.    | Counter   |
| `apollo_query_parse_failed`              | The amount of queries for which parsing has failed.     | Counter   |
| `apollo_query_validation_started`        | The amount of queries for which validation has started. | Counter   |
| `apollo_query_validation_failed`         | The amount of queries for which validation has failed.  | Counter   |
| `apollo_query_resolved`                  | The amount of queries which could be resolved.          | Counter   |
| `apollo_query_execution_started`         | The amount of queries for which execution has started.  | Counter   |
| `apollo_query_execution_failed`          | The amount of queries for which execution has failed.   | Counter   |
| `apollo_query_duration`                  | The total duration of a query.                          | Histogram |
| `apollo_query_field_resolution_duration` | The total duration for resolving fields.                | Histogram |

For default metrics, please refer to [prom-client](https://github.com/siimon/prom-client) default metrics.

## Usage

1. Install `prom-client` and `@bmatei/apollo-prometheus-exporter`

   ```shell script
   npm install prom-client @bmatei/apollo-prometheus-exporter
   ```

2. Create an instance of the plugin

   ```ts
   const app = express();

   const prometheusExporterPlugin = createPrometheusExporterPlugin({ app });
   ```

3. Add the plugin to ApolloServer

   ```ts
   const server = new ApolloServer({
     plugins: [prometheusExporterPlugin]
   });
   ```

For a complete working example, please have a look over the `example` project in this repository.

## Options

| Name                       | Description                                                                                                                                                  | Type                                   | Default Value                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- | ---------------------------------------------------------------- |
| `app`                      | Express instance. For the moment it is used for defining the metrics endpoint. It is mandatory unless `metricsEndpoint` is set to false.                     | `Express`                              | `undefined`                                                      |
| `defaultLabels`            | An object containing default labels to be sent with each metric.                                                                                             | `Object`                               | `{}`                                                             |
| `defaultMetrics`           | Flag to enable/disable the default metrics registered by `prom-client`.                                                                                      | `Boolean`                              | `true`                                                           |
| `defaultMetricsOptions`    | Configuration object for the default metrics.                                                                                                                | `DefaultMetricsCollectorConfiguration` | `{}`                                                             |
| `durationHistogramBuckets` | A list of durations that should be used by histograms.                                                                                                       | `number[]`                             | `[0.001, 0.005, 0.015, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 1, 5, 10]` |
| `hostnameLabel`            | Flag to enable/disable `hostname` label.                                                                                                                     | `Boolean`                              | `true`                                                           |
| `hostnameLabelName`        | The name of the `hostname` label.                                                                                                                            | `String`                               | `hostname`                                                       |
| `metricsEndpoint`          | Flag to enable/disable the metrics endpoint. If you disable this, you can use the `registerPrometheusMetricsEndpoint` method to enable the metrics endpoint. | `Boolean`                              | `true`                                                           |
| `metricsEndpointPath`      | HTTP path where the metrics will be published.                                                                                                               | `String`                               | `"/metrics"`                                                     |
| `register`                 | Prometheus client registry to be used by Apollo Metrics. By default, it is also used by the default metrics.                                                 | `Registry`                             | `register`                                                       |
| `skipMetrics`              | A key-value map that controls if a metric is enabled or disabled.                                                                                            | `SkipMetricsMap`                       | `{}`                                                             |

## Thanks

- [prom-client](https://github.com/siimon/prom-client)
- [apollo-metrics](https://github.com/dotellie/apollo-metrics)
