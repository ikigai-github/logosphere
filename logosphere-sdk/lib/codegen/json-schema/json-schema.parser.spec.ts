import * as f from './json-schema.fixture.json';
import { IDefinition } from '../canonical.schema';
import { JsonSchemaParser } from './json-schema.parser';
describe('test JsonSchemaParser', () => {
  it('parse defs schema', () => {
    const propParser = new JsonSchemaParser();
    const defs = propParser.parse(f);
    expect(defs).toBeDefined();
    expect(defs.definitions).toBeDefined();
    expect(defs.definitions.length > 0).toBeTruthy();
    defs.definitions.map((def: IDefinition) => {
      expect(def.name).toBeDefined();
      expect(def.type).toBeDefined();
      expect(def.props).toBeDefined();
    });
    //console.log(JSON.stringify(defs));
  });
});
