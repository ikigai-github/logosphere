import {
  ICanonicalSchema,
  IDefinition,
  DefinitionType,
} from './canonical.schema';
export abstract class Generator {
  protected abstract genEnum(def: IDefinition): string;
  protected abstract genDef(def: IDefinition): string;
  generate(schema: ICanonicalSchema): string {
    let output = '';
    schema.definitions.forEach((def: IDefinition) => {
      switch (def.type) {
        case DefinitionType.Enum:
          output += this.genEnum(def);
          break;
        case DefinitionType.Definition:
          output += this.genDef(def);
      }
    });
    return output;
  }
}
