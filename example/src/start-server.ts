import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import { json } from 'body-parser';

import { createPrometheusExporterPlugin } from '../../lib/src';

import { readSchema } from './read-schema';
import { resolvers } from './resolvers';

export async function startServer(port: number = 4000, hostname: string = '0.0.0.0') {
  const app = express();

  const typeDefs = readSchema();

  const prometheusExporterPlugin = createPrometheusExporterPlugin({
    app
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [prometheusExporterPlugin]
  });

  await server.start();

  app.use('/', json(), expressMiddleware(server));

  try {
    app.listen(port, hostname, () => {
      console.log(`🚀 App listening at http://${hostname}:${port}`);
    });
  } catch (error) {
    console.error('💥 Failed to start app!', error);
  }
}
