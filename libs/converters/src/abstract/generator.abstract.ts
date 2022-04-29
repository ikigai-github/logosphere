import {
  CanonicalSchema,
  Definition,
  DefinitionType,
} from '../canonical/canonical.schema';
export abstract class Generator {
  protected abstract generateEnum(def: Definition): any;
  protected abstract generateEntity(def: Definition): any;
  protected abstract generateExternalEntity(def: Definition): any;
  generate(schema: CanonicalSchema): any {
    let output = '';
    schema.definitions.forEach((def: Definition) => {
      switch (def.type) {
        case DefinitionType.Enum:
          output += this.generateEnum(def);
          break;
        case DefinitionType.Entity:
          output += this.generateEntity(def);
          break;
        case DefinitionType.ExternalEntity:
          output += this.generateExternalEntity(def);
          break;
        default:
          break;
      }
    });
    return output;
  }
}
