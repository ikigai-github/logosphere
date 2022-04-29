import { canonicalSchemaLoader } from './canonical-schema.loader';
import { Definition } from './canonical.schema';

describe('Federated Schema Loader', () => {
  test('Load canonical schema', () => {
    const schema = canonicalSchemaLoader(
      `${__dirname}/../../../test/fixtures`
    );
    expect(schema).toBeDefined();
    expect(
      schema.definitions.find(
        (def: Definition) => def.module === 'user'
      )
    ).toBeDefined();
    expect(
      schema.definitions.find(
        (def: Definition) => def.module === 'minting'
      )
    ).toBeDefined();
    expect(
      schema.definitions.find(
        (def: Definition) => def.module === 'auction'
      )
    ).toBeDefined();
  });
});
