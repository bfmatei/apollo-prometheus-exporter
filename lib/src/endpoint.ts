import { Express } from 'express';
import { register as defaultRegister, Registry } from 'prom-client';

export interface EndpointOptions {
  app: Express;
  path?: string;
  register?: Registry;
}

export function registerEndpoint({ register, app, path }: EndpointOptions) {
  const actualRegister = register ?? defaultRegister;

  app.get(path ?? '/metrics', async (_req, res) => {
    try {
      res.set('Content-Type', actualRegister.contentType);
      res.end(await actualRegister.metrics());
    } catch (err) {
      res.status(500).end(err);
    }
  });
}
