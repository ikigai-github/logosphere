import { resolve } from 'path';
import { canonicalSchemaLoader } from './canonical-schema.evaluator';
import { Definition } from './canonical.schema';

describe('Federated Schema Loader', () => {
  test('Load canonical schema', () => {
    const path = resolve(`${__dirname}/../test-schema/tsconfig.lib.json`);
    const schema = canonicalSchemaLoader(path);
    console.log(`Schema: ${JSON.stringify(schema, null, 2)}`);
    expect(schema).toBeDefined();
    expect(schema.definitions.length > 0).toBeTruthy();
    expect(
      schema.definitions.find((def: Definition) => def.name === 'basic')
    ).toBeDefined();
    expect(
      schema.definitions.find((def: Definition) => def.name === 'referential')
    ).toBeDefined();
  });
});
