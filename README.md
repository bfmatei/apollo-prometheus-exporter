# Apollo Prometheus Exporter

Plugin for Apollo Server to export metrics in Prometheus format.

It uses [prom-client](https://github.com/siimon/prom-client) under the hood the export the metrics.

## Metrics

| Name                                     | Description                                                     | Type      |
| ---------------------------------------- | --------------------------------------------------------------- | --------- |
| `apollo_server_starting`                 | The amount of times Apollo Server is starting.                  | Counter   |
| `apollo_server_closing`                  | The amount of times Apollo Server is closing.                   | Counter   |
| `apollo_query_started`                   | The amount of GraphQL queries received by Apollo Server.        | Counter   |
| `apollo_query_failed`                    | The amount of GraphQL queries which failed.                     | Counter   |
| `apollo_query_parse_started`             | The amount of GraphQL queries for which parsing has failed.     | Counter   |
| `apollo_query_parse_failed`              | The amount of GraphQL queries for which validation has started. | Counter   |
| `apollo_query_validation_started`        | The amount of GraphQL queries for which validation has failed.  | Counter   |
| `apollo_query_validation_failed`         | The amount of GraphQL queries which could be resolved.          | Counter   |
| `apollo_query_resolved`                  | The amount of GraphQL queries for which execution has started.  | Counter   |
| `apollo_query_execution_started`         | The amount of GraphQL queries for which execution has failed.   | Counter   |
| `apollo_query_execution_failed`          | The amount of GraphQL queries that failed.                      | Counter   |
| `apollo_query_duration`                  | The total duration of GraphQL queries.                          | Histogram |
| `apollo_query_field_resolution_duration` | The total duration for resolving fields.                        | Histogram |

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

3. Add the plugin to ApolloServer and, optionally, enable tracing

   ```ts
   const server = new ApolloServer({
     plugins: [prometheusExporterPlugin],
     tracing: true
   });
   ```

If tracing is not enabled in ApolloServer, some metrics like `apollo_query_duration` and `apollo_query_field_resolution_duration` won't be available.

For a complete working example, please have a look over the `example` project in this repository.

## Options

| Name                    | Description                                                                                                                                                  | Type                                   | Default Value |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- | ------------- |
| `app`                   | Express instance. For the moment it is used for defining the metrics endpoint. It is mandatory unless `metricsEndpoint` is set to false.                     | `Express`                              | `undefined`   |
| `defaultLabels`         | An object containing default labels to be sent with each metric.                                                                                             | `Object`                               | `{}`          |
| `defaultMetrics`        | Flag to enable/disable the default metrics registered by `prom-client`.                                                                                      | `Boolean`                              | `true`        |
| `defaultMetricsOptions` | Configuration object for the default metrics.                                                                                                                | `DefaultMetricsCollectorConfiguration` | `{}`          |
| `disabledMetrics`       | A list of metrics to be skipped.                                                                                                                             | `MetricsNames[]`                       | `[]`          |
| `hostnameLabel`         | Flag to enable/disable `hostname` label.                                                                                                                     | `Boolean`                              | `true`        |
| `hostnameLabelName`     | The name of the `hostname` label.                                                                                                                            | `String`                               | `hostname`    |
| `metricsEndpoint`       | Flag to enable/disable the metrics endpoint. If you disable this, you can use the `registerPrometheusMetricsEndpoint` method to enable the metrics endpoint. | `Boolean`                              | `true`        |
| `metricsEndpointPath`   | HTTP path where the metrics will be published.                                                                                                               | `String`                               | `"/metrics"`  |
| `register`              | Prometheus client registry to be used by Apollo Metrics. By default, it is also used by the default metrics.                                                 | `Registry`                             | `register`    |

## Thanks

- [prom-client](https://github.com/siimon/prom-client)
- [apollo-metrics](https://github.com/dotellie/apollo-metrics)
