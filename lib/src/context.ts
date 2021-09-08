import { Express } from 'express';
import { DefaultMetricsCollectorConfiguration, LabelValues, register, Registry } from 'prom-client';

import { MetricsNames } from './metrics';

export interface Context {
  app: Express;
  defaultLabels: LabelValues<string>;
  defaultMetrics: boolean;
  defaultMetricsOptions: DefaultMetricsCollectorConfiguration;
  disabledMetrics: MetricsNames[];
  hostnameLabel: boolean;
  hostnameLabelName: string;
  metricsEndpoint: boolean;
  metricsEndpointPath: string;
  durationHistogramsBuckets: number[];
  register: Registry;
}

export function generateContext(options: Partial<Context>): Context {
  const context: Context = {
    app: options.app as Express,
    defaultLabels: {},
    defaultMetrics: true,
    disabledMetrics: [],
    hostnameLabel: true,
    hostnameLabelName: 'hostname',
    metricsEndpoint: true,
    metricsEndpointPath: '/metrics',
    durationHistogramsBuckets: [0.001, 0.005, 0.015, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 1, 5, 10],
    register,
    ...options,
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

  return context as Context;
}
