import { Counter, Histogram, Metric, Registry } from 'prom-client';

import { Context } from './context';

export enum MetricsNames {
  SERVER_STARTING = 'apollo_server_starting',
  SERVER_CLOSING = 'apollo_server_closing',
  QUERY_STARTED = 'apollo_query_started',
  QUERY_FAILED = 'apollo_query_failed',
  QUERY_PARSE_STARTED = 'apollo_query_parse_started',
  QUERY_PARSE_FAILED = 'apollo_query_parse_failed',
  QUERY_VALIDATION_STARTED = 'apollo_query_validation_started',
  QUERY_VALIDATION_FAILED = 'apollo_query_validation_failed',
  QUERY_RESOLVED = 'apollo_query_resolved',
  QUERY_EXECUTION_STARTED = 'apollo_query_execution_started',
  QUERY_EXECUTION_FAILED = 'apollo_query_execution_failed',
  QUERY_DURATION = 'apollo_query_duration',
  QUERY_FIELD_RESOLUTION_DURATION = 'apollo_query_field_resolution_duration'
}

export enum MetricTypes {
  COUNTER,
  HISTOGRAM
}

export interface MetricConfig {
  name: MetricsNames;
  help: string;
  type: MetricTypes;
  labelNames?: string[];
}

export const queryLabelNames = ['operationName', 'operation'];

export const fieldLabelNames = ['operationName', 'operation', 'fieldName', 'parentType', 'returnType'];

export const metricsConfig: MetricConfig[] = [
  {
    name: MetricsNames.SERVER_STARTING,
    help: 'The amount of times Apollo Server is starting.',
    type: MetricTypes.COUNTER
  },
  {
    name: MetricsNames.SERVER_CLOSING,
    help: 'The amount of times Apollo Server is closing.',
    type: MetricTypes.COUNTER
  },
  {
    name: MetricsNames.QUERY_STARTED,
    help: 'The amount of GraphQL queries received by Apollo Server.',
    type: MetricTypes.COUNTER,
    labelNames: queryLabelNames
  },
  {
    name: MetricsNames.QUERY_PARSE_STARTED,
    help: 'The amount of GraphQL queries for which parsing has started.',
    type: MetricTypes.COUNTER,
    labelNames: queryLabelNames
  },
  {
    name: MetricsNames.QUERY_PARSE_FAILED,
    help: 'The amount of GraphQL queries for which parsing has failed.',
    type: MetricTypes.COUNTER,
    labelNames: queryLabelNames
  },
  {
    name: MetricsNames.QUERY_VALIDATION_STARTED,
    help: 'The amount of GraphQL queries for which validation has started.',
    type: MetricTypes.COUNTER,
    labelNames: queryLabelNames
  },
  {
    name: MetricsNames.QUERY_VALIDATION_FAILED,
    help: 'The amount of GraphQL queries for which validation has failed.',
    type: MetricTypes.COUNTER,
    labelNames: queryLabelNames
  },
  {
    name: MetricsNames.QUERY_RESOLVED,
    help: 'The amount of GraphQL queries which could be resolved.',
    type: MetricTypes.COUNTER,
    labelNames: queryLabelNames
  },
  {
    name: MetricsNames.QUERY_EXECUTION_STARTED,
    help: 'The amount of GraphQL queries for which execution has started.',
    type: MetricTypes.COUNTER,
    labelNames: queryLabelNames
  },
  {
    name: MetricsNames.QUERY_EXECUTION_FAILED,
    help: 'The amount of GraphQL queries for which execution has failed.',
    type: MetricTypes.COUNTER,
    labelNames: queryLabelNames
  },
  {
    name: MetricsNames.QUERY_FAILED,
    help: 'The amount of GraphQL queries that failed.',
    type: MetricTypes.COUNTER,
    labelNames: queryLabelNames
  },
  {
    name: MetricsNames.QUERY_DURATION,
    help: 'The total duration of GraphQL queries.',
    type: MetricTypes.HISTOGRAM,
    labelNames: queryLabelNames
  },
  {
    name: MetricsNames.QUERY_FIELD_RESOLUTION_DURATION,
    help: 'The total duration for resolving fields.',
    type: MetricTypes.HISTOGRAM,
    labelNames: fieldLabelNames
  }
];

export type Metrics = {
  [metricName in MetricsNames]: {
    type: MetricTypes;
    disabled: boolean;
    instance: Metric<string> | null;
  };
};

export function generateMetrics(register: Registry, { disabledMetrics }: Context): Metrics {
  return metricsConfig.reduce((acc, metric) => {
    const disabled = disabledMetrics.includes(metric.name);

    acc[metric.name] = {
      type: metric.type,
      disabled,
      instance: null
    };

    if (!disabled) {
      const config = {
        name: metric.name,
        help: metric.help,
        labelNames: metric.labelNames,
        registers: [register]
      };

      switch (metric.type) {
        case MetricTypes.COUNTER:
          acc[metric.name].instance = new Counter(config);
          break;

        case MetricTypes.HISTOGRAM:
          acc[metric.name].instance = new Histogram(config);
          break;
      }
    }

    return acc;
  }, {} as Metrics);
}
