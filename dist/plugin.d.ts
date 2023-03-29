import { ApolloServerPlugin, BaseContext } from '@apollo/server';
import { Registry } from 'prom-client';
import { AppContext, Args, Context, SkipMetricsMap as ContextSkipMetricsMap, Source } from './context';
export type SkipMetricsMap<C extends BaseContext = BaseContext, S = any, A = {
    [p: string]: any;
}> = Partial<ContextSkipMetricsMap<C, S, A>>;
export type PluginOptions<C extends BaseContext = BaseContext, S = any, A = {
    [p: string]: any;
}> = Partial<Omit<Context, 'skipMetrics'> & {
    skipMetrics: SkipMetricsMap<C, S, A>;
}>;
export declare function toggleDefaultMetrics<C extends BaseContext = AppContext, S = Source, A = Args>(register: Registry, { defaultMetrics, defaultMetricsOptions }: Context<C, S, A>): void;
export declare function setDefaultLabels<C extends BaseContext = AppContext, S = Source, A = Args>(register: Registry, { defaultLabels, hostnameLabel, hostnameLabelName }: Context<C, S, A>): void;
export declare function toggleEndpoint<C extends BaseContext = AppContext, S = Source, A = Args>(register: Registry, { metricsEndpoint, app, metricsEndpointPath }: Context<C, S, A>): void;
export declare function createPlugin<C extends BaseContext = AppContext, S = Source, A = Args>(options: PluginOptions<C, S, A>): ApolloServerPlugin;
