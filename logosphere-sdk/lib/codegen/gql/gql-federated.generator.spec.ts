import { Converter } from '../converter';
import {
  JsonFederatedSchemaParser,
  jsonFederatedSchemaLoader,
} from '../json-schema';
import { GqlFederatedGenerator } from '../gql';
import { GqlFederatedSchema } from './gql-federated.schema';

describe('Converters', () => {
  test('JSON Schema to GQL Federated ', () => {
    const converter = new Converter(
      new JsonFederatedSchemaParser(),
      new GqlFederatedGenerator()
    );
    const federatedSchemas = jsonFederatedSchemaLoader(
      `${__dirname}/../../../test/fixtures/schema-first`
    );
    const gqlFederated: GqlFederatedSchema[] =
      converter.convert(federatedSchemas);
    expect(gqlFederated).toBeDefined();
    expect(
      gqlFederated.find(
        (schema: GqlFederatedSchema) => schema.module === 'user'
      )
    ).toBeDefined();
    expect(
      gqlFederated.find(
        (schema: GqlFederatedSchema) => schema.module === 'minting'
      )
    ).toBeDefined();
    expect(
      gqlFederated.find(
        (schema: GqlFederatedSchema) => schema.module === 'auction'
      )
    ).toBeDefined();
  });
});
