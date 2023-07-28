import {
  BaseContext,
  GraphQLFieldResolverParams,
  GraphQLRequestContext,
  GraphQLRequestContextDidEncounterErrors,
  GraphQLRequestContextDidResolveOperation,
  GraphQLRequestContextExecutionDidStart,
  GraphQLRequestContextParsingDidStart,
  GraphQLRequestContextValidationDidStart,
  GraphQLRequestContextWillSendResponse
} from '@apollo/server';
import { Express } from 'express';
import { DefaultMetricsCollectorConfiguration, LabelValues, register, Registry } from 'prom-client';

import {
  FieldLabels,
  MetricsNames,
  QueryDurationLabels,
  QueryLabels,
  ServerLabels,
  SkipFn,
  SkipFnWithContext,
  SkipFnWithField
} from './metrics';
import { PluginOptions } from './plugin';

export type AppContext = BaseContext;

export type Source = any;

export interface Args {
  [p: string]: any;
}

export interface SkipMetricsMap<C extends BaseContext = AppContext, S = Source, A = Args> {
  [MetricsNames.SERVER_STARTING]: SkipFn<ServerLabels>;
  [MetricsNames.SERVER_CLOSING]: SkipFn<ServerLabels>;
  [MetricsNames.QUERY_STARTED]: SkipFnWithContext<QueryLabels, GraphQLRequestContext<C>>;
  [MetricsNames.QUERY_FAILED]: SkipFnWithContext<QueryLabels, GraphQLRequestContextDidEncounterErrors<C>>;
  [MetricsNames.QUERY_FAILED_BY_CLIENT]: SkipFnWithContext<QueryLabels, GraphQLRequestContextDidEncounterErrors<C>>;
  [MetricsNames.QUERY_PARSE_STARTED]: SkipFnWithContext<QueryLabels, GraphQLRequestContextParsingDidStart<C>>;
  [MetricsNames.QUERY_PARSE_FAILED]: SkipFnWithContext<QueryLabels, GraphQLRequestContextParsingDidStart<C>>;
  [MetricsNames.QUERY_VALIDATION_STARTED]: SkipFnWithContext<QueryLabels, GraphQLRequestContextValidationDidStart<C>>;
  [MetricsNames.QUERY_VALIDATION_FAILED]: SkipFnWithContext<QueryLabels, GraphQLRequestContextValidationDidStart<C>>;
  [MetricsNames.QUERY_RESOLVED]: SkipFnWithContext<QueryLabels, GraphQLRequestContextDidResolveOperation<C>>;
  [MetricsNames.QUERY_EXECUTION_STARTED]: SkipFnWithContext<QueryLabels, GraphQLRequestContextExecutionDidStart<C>>;
  [MetricsNames.QUERY_EXECUTION_FAILED]: SkipFnWithContext<QueryLabels, GraphQLRequestContextExecutionDidStart<C>>;
  [MetricsNames.QUERY_DURATION]: SkipFnWithContext<
    QueryDurationLabels,
    GraphQLRequestContextDidEncounterErrors<C> | GraphQLRequestContextWillSendResponse<C>
  >;
  [MetricsNames.QUERY_FIELD_RESOLUTION_DURATION]: SkipFnWithField<
    FieldLabels,
    GraphQLRequestContextExecutionDidStart<C>,
    GraphQLFieldResolverParams<S, C, A>
  >;
}

export interface Context<C extends BaseContext = AppContext, S = Source, A = Args> {
  app: Express;
  defaultLabels: LabelValues<string>;
  defaultMetrics: boolean;
  defaultMetricsOptions: DefaultMetricsCollectorConfiguration;
  disabledMetrics: MetricsNames[];
  durationHistogramsBuckets: number[];
  hostnameLabel: boolean;
  hostnameLabelName: string;
  metricsEndpoint: boolean;
  metricsEndpointPath: string;
  register: Registry;
  skipMetrics: SkipMetricsMap<C, S, A>;
}

export function generateContext<C extends BaseContext = BaseContext, S = Source, A = Args>(
  options: PluginOptions<C, S, A>
): Context<C, S, A> {
  const context: Context<C, S, A> = {
    app: options.app as Express,
    defaultLabels: {},
    defaultMetrics: true,
    disabledMetrics: [],
    durationHistogramsBuckets: [0.001, 0.005, 0.015, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 1, 5, 10, 25, 50, 100],
    hostnameLabel: true,
    hostnameLabelName: 'hostname',
    metricsEndpoint: true,
    metricsEndpointPath: '/metrics',
    register,
    ...options,
    skipMetrics: {
      [MetricsNames.SERVER_STARTING]: () => false,
      [MetricsNames.SERVER_CLOSING]: () => false,
      [MetricsNames.QUERY_STARTED]: () => false,
      [MetricsNames.QUERY_FAILED]: () => false,
      [MetricsNames.QUERY_FAILED_BY_CLIENT]: () => false,
      [MetricsNames.QUERY_PARSE_STARTED]: () => false,
      [MetricsNames.QUERY_PARSE_FAILED]: () => false,
      [MetricsNames.QUERY_VALIDATION_STARTED]: () => false,
      [MetricsNames.QUERY_VALIDATION_FAILED]: () => false,
      [MetricsNames.QUERY_RESOLVED]: () => false,
      [MetricsNames.QUERY_EXECUTION_STARTED]: () => false,
      [MetricsNames.QUERY_EXECUTION_FAILED]: () => false,
      [MetricsNames.QUERY_DURATION]: () => false,
      [MetricsNames.QUERY_FIELD_RESOLUTION_DURATION]: () => false,
      ...(options.skipMetrics ?? {})
    },
    defaultMetricsOptions: {
      register,
      ...(options.defaultMetricsOptions ?? {})
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
