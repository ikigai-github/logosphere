import * as fs from 'fs';
import { JsonSchemaFederatedParser } from './json-schema-federated.parser';
import { Configuration, ConfigurationLoader } from '../../configuration';
import { FileSystemReader } from '../../readers';

describe('Test JSON Schema Federated Parser', () => {
  it('should return canonical schema', () => {
    const parser = new JsonSchemaFederatedParser();
    const configLoader = new ConfigurationLoader(
      new FileSystemReader(`${__dirname}/../../../test/fixtures`)
    );
    const config: Configuration = configLoader.load('logosphere.json');
    const canonicalSchema = parser.parse(config.modules);
    expect(canonicalSchema).toBeDefined();
  });
});
