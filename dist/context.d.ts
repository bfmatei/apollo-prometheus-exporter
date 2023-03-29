import { BaseContext, GraphQLFieldResolverParams, GraphQLRequestContext, GraphQLRequestContextDidEncounterErrors, GraphQLRequestContextDidResolveOperation, GraphQLRequestContextExecutionDidStart, GraphQLRequestContextParsingDidStart, GraphQLRequestContextValidationDidStart, GraphQLRequestContextWillSendResponse } from '@apollo/server';
import { Express } from 'express';
import { DefaultMetricsCollectorConfiguration, LabelValues, Registry } from 'prom-client';
import { FieldLabels, MetricsNames, QueryDurationLabels, QueryLabels, ServerLabels, SkipFn, SkipFnWithContext, SkipFnWithField } from './metrics';
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
    [MetricsNames.QUERY_PARSE_STARTED]: SkipFnWithContext<QueryLabels, GraphQLRequestContextParsingDidStart<C>>;
    [MetricsNames.QUERY_PARSE_FAILED]: SkipFnWithContext<QueryLabels, GraphQLRequestContextParsingDidStart<C>>;
    [MetricsNames.QUERY_VALIDATION_STARTED]: SkipFnWithContext<QueryLabels, GraphQLRequestContextValidationDidStart<C>>;
    [MetricsNames.QUERY_VALIDATION_FAILED]: SkipFnWithContext<QueryLabels, GraphQLRequestContextValidationDidStart<C>>;
    [MetricsNames.QUERY_RESOLVED]: SkipFnWithContext<QueryLabels, GraphQLRequestContextDidResolveOperation<C>>;
    [MetricsNames.QUERY_EXECUTION_STARTED]: SkipFnWithContext<QueryLabels, GraphQLRequestContextExecutionDidStart<C>>;
    [MetricsNames.QUERY_EXECUTION_FAILED]: SkipFnWithContext<QueryLabels, GraphQLRequestContextExecutionDidStart<C>>;
    [MetricsNames.QUERY_DURATION]: SkipFnWithContext<QueryDurationLabels, GraphQLRequestContextDidEncounterErrors<C> | GraphQLRequestContextWillSendResponse<C>>;
    [MetricsNames.QUERY_FIELD_RESOLUTION_DURATION]: SkipFnWithField<FieldLabels, GraphQLRequestContextExecutionDidStart<C>, GraphQLFieldResolverParams<S, C, A>>;
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
export declare function generateContext<C extends BaseContext = BaseContext, S = Source, A = Args>(options: PluginOptions<C, S, A>): Context<C, S, A>;
