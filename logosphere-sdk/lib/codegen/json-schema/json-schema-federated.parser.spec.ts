import * as fs from 'fs';
import { JsonSchemaFederatedParser } from './json-schema-federated.parser';
import { ConfigurationLoader } from '../../configuration';
import { FileSystemReader } from '../../readers';

describe('Test JSON Schema Federated Parser', () => {

  it('should return canonical schema', async () => {

    const parser = new JsonSchemaFederatedParser();
    const configLoader = new ConfigurationLoader(new FileSystemReader(__dirname));
    const config = await configLoader.load('../../configuration/configuration.fixture.json');
    console.log(config);
    const canonicalSchema = parser.parse(config);
    expect(canonicalSchema).toBeDefined();

  });

});