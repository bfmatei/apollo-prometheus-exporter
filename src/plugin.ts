import { ApolloServerPlugin, BaseContext } from '@apollo/server';
import { hostname } from 'os';
import { collectDefaultMetrics, Registry } from 'prom-client';

import { AppContext, Args, Context, generateContext, SkipMetricsMap as ContextSkipMetricsMap, Source } from './context';
import { registerEndpoint } from './endpoint';
import { filterLabels } from './helpers';
import { generateHooks } from './hooks';
import { generateMetrics } from './metrics';

export type SkipMetricsMap<C extends BaseContext = BaseContext, S = any, A = { [p: string]: any }> = Partial<
  ContextSkipMetricsMap<C, S, A>
>;

export type PluginOptions<C extends BaseContext = BaseContext, S = any, A = { [p: string]: any }> = Partial<
  Omit<Context, 'skipMetrics'> & {
    skipMetrics: SkipMetricsMap<C, S, A>;
    service: string;
  }
>;

export function toggleDefaultMetrics<C extends BaseContext = AppContext, S = Source, A = Args>(
  register: Registry,
  { defaultMetrics, defaultMetricsOptions }: Context<C, S, A>
) {
  if (defaultMetrics) {
    collectDefaultMetrics({
      register,
      ...defaultMetricsOptions
    });
  }
}

export function setDefaultLabels<C extends BaseContext = AppContext, S = Source, A = Args>(
  register: Registry,
  { defaultLabels, hostnameLabel, hostnameLabelName }: Context<C, S, A>
) {
  const labels = filterLabels({
    ...defaultLabels,
    [hostnameLabelName]: hostnameLabel ? hostname() : undefined
  });

  register.setDefaultLabels(labels);
}

export function toggleEndpoint<C extends BaseContext = AppContext, S = Source, A = Args>(
  register: Registry,
  { metricsEndpoint, app, metricsEndpointPath }: Context<C, S, A>
) {
  if (metricsEndpoint) {
    registerEndpoint({
      app: app,
      register,
      path: metricsEndpointPath
    });
  }
}

export function createPlugin<C extends BaseContext = AppContext, S = Source, A = Args>(
  options: PluginOptions<C, S, A>
): ApolloServerPlugin {
  const { service } = options;
  const context = generateContext<C, S, A>(options);
  const register = context.register;

  toggleDefaultMetrics(register, context);

  setDefaultLabels(register, context);

  toggleEndpoint(register, context);

  const metrics = generateMetrics(register, context);

  return generateHooks(metrics, service);
}
