import {
  CanonicalSchema,
  Definition,
  DefinitionType,
} from './canonical.schema';
export abstract class Generator {
  protected abstract genEnum(def: Definition): string;
  protected abstract genDef(def: Definition): string;
  generate(schema: CanonicalSchema): string {
    let output = '';
    schema.definitions.forEach((def: Definition) => {
      switch (def.type) {
        case DefinitionType.Enum:
          output += this.genEnum(def);
          break;
        case DefinitionType.Definition:
          output += this.genDef(def);
          break;
        default:
          break;
      }
    });
    return output;
  }
}
