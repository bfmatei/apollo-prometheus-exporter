import {
  BaseContext,
  GraphQLRequestContext,
  GraphQLRequestContextDidEncounterErrors,
  GraphQLRequestContextDidResolveOperation,
  GraphQLRequestContextExecutionDidStart,
  GraphQLRequestContextParsingDidStart,
  GraphQLRequestContextValidationDidStart,
  GraphQLRequestContextWillSendResponse
} from 'apollo-server-plugin-base';
import { GraphQLFieldResolverParams } from 'apollo-server-types';
import { Counter, Gauge, Histogram, LabelValues, Metric, Registry } from 'prom-client';

import { AppContext, Args, Context, Source } from './context';

export interface ServerLabels extends LabelValues<string> {
  version: string;
}

export interface QueryLabels extends LabelValues<string> {
  operationName?: string;
  operation?: string;
}

export interface QueryDurationLabels extends QueryLabels {
  success: 'true' | 'false';
}

export interface FieldLabels extends QueryLabels {
  fieldName: string;
  parentType: string;
  pathLength: string;
  returnType?: string;
}

export type ContextTypes<C extends BaseContext = BaseContext> =
  | GraphQLRequestContext<C>
  | GraphQLRequestContextParsingDidStart<C>
  | GraphQLRequestContextValidationDidStart<C>
  | GraphQLRequestContextDidResolveOperation<C>
  | GraphQLRequestContextExecutionDidStart<C>
  | GraphQLRequestContextDidEncounterErrors<C>
  | GraphQLRequestContextWillSendResponse<C>;

export type FieldTypes<S = any, BC = BaseContext, A = { [p: string]: any }> = GraphQLFieldResolverParams<S, BC, A>;

export interface SkipFn<L extends LabelValues<string> = LabelValues<string>> {
  (labels: L): boolean;
}

export interface SkipFnWithContext<
  L extends LabelValues<string> = LabelValues<string>,
  C extends BaseContext = BaseContext
> {
  (labels: L, context: ContextTypes<C>): boolean;
}

export interface SkipFnWithField<
  L extends LabelValues<string> = LabelValues<string>,
  C extends BaseContext = BaseContext,
  S = any,
  A = { [p: string]: any }
> {
  (labels: L, context: ContextTypes<C>, field: FieldTypes<S, C, A>): boolean;
}

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
  GAUGE,
  COUNTER,
  HISTOGRAM
}

export interface MetricConfig {
  name: MetricsNames;
  help: string;
  type: MetricTypes;
  labelNames: string[];
}

export const serverLabelNames = ['version'];

export const queryLabelNames = ['operationName', 'operation'];

export const fieldLabelNames = ['operationName', 'operation', 'fieldName', 'parentType', 'returnType', 'pathLength'];

export const metricsConfig: MetricConfig[] = [
  {
    name: MetricsNames.SERVER_STARTING,
    help: 'The last timestamp when Apollo Server was starting.',
    type: MetricTypes.GAUGE,
    labelNames: serverLabelNames
  },
  {
    name: MetricsNames.SERVER_CLOSING,
    help: 'The last timestamp when Apollo Server was closing.',
    type: MetricTypes.GAUGE,
    labelNames: serverLabelNames
  },
  {
    name: MetricsNames.QUERY_STARTED,
    help: 'The amount of received queries.',
    type: MetricTypes.COUNTER,
    labelNames: queryLabelNames
  },
  {
    name: MetricsNames.QUERY_PARSE_STARTED,
    help: 'The amount of queries for which parsing has started.',
    type: MetricTypes.COUNTER,
    labelNames: queryLabelNames
  },
  {
    name: MetricsNames.QUERY_PARSE_FAILED,
    help: 'The amount of queries for which parsing has failed.',
    type: MetricTypes.COUNTER,
    labelNames: queryLabelNames
  },
  {
    name: MetricsNames.QUERY_VALIDATION_STARTED,
    help: 'The amount of queries for which validation has started.',
    type: MetricTypes.COUNTER,
    labelNames: queryLabelNames
  },
  {
    name: MetricsNames.QUERY_VALIDATION_FAILED,
    help: 'The amount of queries for which validation has failed.',
    type: MetricTypes.COUNTER,
    labelNames: queryLabelNames
  },
  {
    name: MetricsNames.QUERY_RESOLVED,
    help: 'The amount of queries which could be resolved.',
    type: MetricTypes.COUNTER,
    labelNames: queryLabelNames
  },
  {
    name: MetricsNames.QUERY_EXECUTION_STARTED,
    help: 'The amount of queries for which execution has started.',
    type: MetricTypes.COUNTER,
    labelNames: queryLabelNames
  },
  {
    name: MetricsNames.QUERY_EXECUTION_FAILED,
    help: 'The amount of queries for which execution has failed.',
    type: MetricTypes.COUNTER,
    labelNames: queryLabelNames
  },
  {
    name: MetricsNames.QUERY_FAILED,
    help: 'The amount of queries that failed.',
    type: MetricTypes.COUNTER,
    labelNames: queryLabelNames
  },
  {
    name: MetricsNames.QUERY_DURATION,
    help: 'The total duration of a query.',
    type: MetricTypes.HISTOGRAM,
    labelNames: [...queryLabelNames, 'success']
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
    skip: SkipFn | SkipFnWithContext | SkipFnWithField;
    instance: Metric<string> | null;
  };
};

export function generateMetrics<C = AppContext, S = Source, A = Args>(
  register: Registry,
  { durationHistogramsBuckets, skipMetrics }: Context<C, S, A>
): Metrics {
  return metricsConfig.reduce((acc, metric) => {
    acc[metric.name] = {
      type: metric.type,
      skip: skipMetrics[metric.name] as SkipFn | SkipFnWithContext | SkipFnWithField,
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
        acc[metric.name].instance = new Gauge(commonConfig);
        break;

      case MetricTypes.COUNTER:
        acc[metric.name].instance = new Counter(commonConfig);
        break;

      case MetricTypes.HISTOGRAM:
        acc[metric.name].instance = new Histogram({
          ...commonConfig,
          buckets: durationHistogramsBuckets
        });
        break;
    }

    return acc;
  }, {} as Metrics);
}
