import * as fs from 'fs';
import { JsonSchemaFederatedParser } from './json-schema-federated.parser';

describe('Test JSON Schema Federated Parser', () => {

  it('should return canonical schema', () => {

    const parser = new JsonSchemaFederatedParser();
    const canonicalSchema = parser.parse(`${__dirname}/schema.fixtures/logosphere.json`);
    expect(canonicalSchema).toBeDefined();

  });

});