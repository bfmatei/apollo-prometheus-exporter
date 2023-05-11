import { Express } from 'express';
import { Registry } from 'prom-client';
export interface EndpointOptions {
  app: Express;
  path?: string;
  register?: Registry;
}
export declare function registerEndpoint({ register, app, path }: EndpointOptions): void;
