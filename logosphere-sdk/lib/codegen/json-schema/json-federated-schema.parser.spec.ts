import { JsonFederatedSchema } from './json-federated.schema';
import { jsonFederatedSchemaLoader } from './json-federated-schema.loader';
import { JsonFederatedSchemaParser } from './json-federated-schema.parser';

describe('Test JSON Schema Federated Parser', () => {
  it('should return canonical schema', () => {
    const parser = new JsonFederatedSchemaParser();
    const federatedSchemas: JsonFederatedSchema[] = jsonFederatedSchemaLoader(
      `${__dirname}/../../../test/fixtures`
    );
    const canonicalSchema = parser.parse(federatedSchemas);
    expect(canonicalSchema).toBeDefined();
    expect(canonicalSchema.definitions).toBeDefined();
    expect(canonicalSchema.definitions.length > 0).toBe(true);
  });
});
