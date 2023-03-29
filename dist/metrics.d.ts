import { BaseContext, GraphQLRequestContext, GraphQLRequestContextDidEncounterErrors, GraphQLRequestContextDidResolveOperation, GraphQLRequestContextExecutionDidStart, GraphQLRequestContextParsingDidStart, GraphQLRequestContextValidationDidStart, GraphQLRequestContextWillSendResponse, GraphQLFieldResolverParams } from '@apollo/server';
import { LabelValues, Metric, Registry } from 'prom-client';
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
export type ContextTypes<C extends BaseContext = BaseContext> = GraphQLRequestContext<C> | GraphQLRequestContextParsingDidStart<C> | GraphQLRequestContextValidationDidStart<C> | GraphQLRequestContextDidResolveOperation<C> | GraphQLRequestContextExecutionDidStart<C> | GraphQLRequestContextDidEncounterErrors<C> | GraphQLRequestContextWillSendResponse<C>;
export type FieldTypes<S = any, BC = BaseContext, A = {
    [p: string]: any;
}> = GraphQLFieldResolverParams<S, BC, A>;
export interface SkipFn<L extends LabelValues<string> = LabelValues<string>> {
    (labels: L): boolean;
}
export interface SkipFnWithContext<L extends LabelValues<string> = LabelValues<string>, C extends BaseContext = BaseContext> {
    (labels: L, context: ContextTypes<C>): boolean;
}
export interface SkipFnWithField<L extends LabelValues<string> = LabelValues<string>, C extends BaseContext = BaseContext, S = any, A = {
    [p: string]: any;
}> {
    (labels: L, context: ContextTypes<C>, field: FieldTypes<S, C, A>): boolean;
}
export declare enum MetricsNames {
    SERVER_STARTING = "apollo_server_starting",
    SERVER_CLOSING = "apollo_server_closing",
    QUERY_STARTED = "apollo_query_started",
    QUERY_FAILED = "apollo_query_failed",
    QUERY_PARSE_STARTED = "apollo_query_parse_started",
    QUERY_PARSE_FAILED = "apollo_query_parse_failed",
    QUERY_VALIDATION_STARTED = "apollo_query_validation_started",
    QUERY_VALIDATION_FAILED = "apollo_query_validation_failed",
    QUERY_RESOLVED = "apollo_query_resolved",
    QUERY_EXECUTION_STARTED = "apollo_query_execution_started",
    QUERY_EXECUTION_FAILED = "apollo_query_execution_failed",
    QUERY_DURATION = "apollo_query_duration",
    QUERY_FIELD_RESOLUTION_DURATION = "apollo_query_field_resolution_duration"
}
export declare enum MetricTypes {
    GAUGE = 0,
    COUNTER = 1,
    HISTOGRAM = 2
}
export interface MetricConfig {
    name: MetricsNames;
    help: string;
    type: MetricTypes;
    labelNames: string[];
}
export declare const serverLabelNames: string[];
export declare const queryLabelNames: string[];
export declare const fieldLabelNames: string[];
export declare const metricsConfig: MetricConfig[];
export type Metrics = {
    [metricName in MetricsNames]: {
        type: MetricTypes;
        skip: SkipFn | SkipFnWithContext | SkipFnWithField;
        instance: Metric<string> | null;
    };
};
export declare function generateMetrics<C extends BaseContext = AppContext, S = Source, A = Args>(register: Registry, { durationHistogramsBuckets, skipMetrics }: Context<C, S, A>): Metrics;
