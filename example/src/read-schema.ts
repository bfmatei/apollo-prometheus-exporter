import { gql } from 'graphql-tag';
import { readFileSync } from 'fs';
import { DocumentNode } from 'graphql';
import { resolve } from 'path';

export function readSchema(): DocumentNode {
  const rawSchema = readFileSync(resolve(__dirname, 'schema.graphql'), { encoding: 'utf-8' });

  return gql(rawSchema);
}
