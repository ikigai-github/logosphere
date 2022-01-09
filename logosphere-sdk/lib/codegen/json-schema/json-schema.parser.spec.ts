import * as f from '../../../test/fixtures/schemas/monolith/json-schema.json';
import { Definition } from '../canonical.schema';
import { JsonSchemaParser } from './json-schema.parser';
describe('test JsonSchemaParser', () => {
  it('parse defs schema', () => {
    const propParser = new JsonSchemaParser();
    const canonical = propParser.parse(f);
    expect(canonical).toBeDefined();
    expect(canonical.definitions).toBeDefined();
    expect(canonical.definitions.length > 0).toBeTruthy();
    canonical.definitions.map((def: Definition) => {
      expect(def.name).toBeDefined();
      expect(def.type).toBeDefined();
      expect(def.props).toBeDefined();
    });
    //console.log(JSON.stringify(canonical));
  });
});
