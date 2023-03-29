import { ApolloServerPlugin, GraphQLFieldResolverParams } from '@apollo/server';
import { Path } from 'graphql/jsutils/Path';
import { LabelValues } from 'prom-client';
import { Metrics } from './metrics';
export declare function getLabelsFromContext(context: any): LabelValues<string>;
export declare function countFieldAncestors(path: Path | undefined): string;
export declare function getLabelsFromFieldResolver({ info: { fieldName, parentType, path, returnType } }: GraphQLFieldResolverParams<any, any>): LabelValues<string>;
export declare function generateHooks(metrics: Metrics): ApolloServerPlugin;
