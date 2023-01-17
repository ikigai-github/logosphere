import * as f from './json-schema.json';
import { constants as c } from './json-schema.constants';
import { Definition, Property, DefinitionType } from '../canonical';
import { JsonSchemaParser } from './json-schema.parser';

describe('test JsonSchemaParser', () => {
  it('parse defs schema', () => {
    const propParser = new JsonSchemaParser();
    const canonical = propParser.parse(f);
    expect(canonical).toBeDefined();
    expect(canonical.definitions).toBeDefined();
    expect(canonical.definitions.length > 0).toBe(true);
    canonical.definitions.map((def: Definition) => {
      expect(def.name).toBeDefined();
      expect(def.type).toBeDefined();
      expect(def.props).toBeDefined();
      if (def.type === DefinitionType.Entity) {
        const identifier = def.props.find(
          (prop: Property) => prop.name === c.IDENTIFIER
        );
        expect(identifier).toBeDefined;
        expect(identifier.defType).toBe(DefinitionType.Scalar);
        expect(identifier.type).toBe(c.STRING);
        expect(identifier.isPK).toBe(true);
        expect(identifier.isReadOnly).toBe(true);
      }
    });
  });
});
