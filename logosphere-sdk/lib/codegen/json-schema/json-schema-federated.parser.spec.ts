import * as fs from 'fs';
import { JsonSchemaFederatedParser } from './json-schema-federated.parser';
import { ConfigurationLoader } from '../../configuration';
import { FileSystemReader } from '../../readers';

describe('Test JSON Schema Federated Parser', () => {

  it('should return canonical schema', () => {

    const parser = new JsonSchemaFederatedParser();
    const configLoader = new ConfigurationLoader(new FileSystemReader(`${__dirname}/../../../test/fixtures`));
    const config = configLoader.load('logosphere.json');
    const canonicalSchema = parser.parse(config);
    expect(canonicalSchema).toBeDefined();
    
  });

});