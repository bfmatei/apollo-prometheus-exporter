import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { hostname } from 'os';
import { collectDefaultMetrics, Registry } from 'prom-client';

import { Context, generateContext } from './context';
import { registerEndpoint } from './endpoint';
import { filterLabels } from './helpers';
import { generateHooks } from './hooks';
import { generateMetrics } from './metrics';

export function toggleDefaultMetrics(register: Registry, { defaultMetrics, defaultMetricsOptions }: Context) {
  if (defaultMetrics) {
    collectDefaultMetrics({
      register,
      ...defaultMetricsOptions
    });
  }
}

export function setDefaultLabels(register: Registry, { defaultLabels, hostnameLabel, hostnameLabelName }: Context) {
  const labels = filterLabels({
    ...defaultLabels,
    [hostnameLabelName]: hostnameLabel ? hostname() : undefined
  });

  register.setDefaultLabels(labels);
}

export function toggleEndpoint(register: Registry, { metricsEndpoint, app, metricsEndpointPath }: Context) {
  if (metricsEndpoint) {
    registerEndpoint({
      app: app,
      register,
      path: metricsEndpointPath
    });
  }
}

export type PluginOptions = Partial<Context>;

export function createPlugin(options: PluginOptions): ApolloServerPlugin {
  const context = generateContext(options);
  const register = context.register;

  toggleDefaultMetrics(register, context);

  setDefaultLabels(register, context);

  toggleEndpoint(register, context);

  const metrics = generateMetrics(register, context);

  return generateHooks(metrics);
}
