import { jsonFederatedSchemaLoader } from './json-federated-schema.loader';
import { JsonFederatedSchema } from './json-federated.schema';

describe('Federated Schema Loader', () => {
  test('Load federated JSON schema', () => {
    const federatedSchema = jsonFederatedSchemaLoader(`${__dirname}/../../../test/fixtures`);
    expect(federatedSchema).toBeDefined();
    expect(federatedSchema.find((schema: JsonFederatedSchema) => schema.module === 'user')).toBeDefined();
    expect(federatedSchema.find((schema: JsonFederatedSchema) => schema.module === 'minting')).toBeDefined();
    expect(federatedSchema.find((schema: JsonFederatedSchema) => schema.module === 'auction')).toBeDefined();
    
  });
});