import { Generator } from '../abstract';
import { CanonicalSchema, Definition } from '../canonical';
export class CanonicalSchemaGenerator extends Generator {
  protected generateEnum(def: Definition): any {};
  protected generateEntity(def: Definition): any {};
  protected generateExternalEntity(def: Definition): any {};

  generate(schema: CanonicalSchema): any {
    return JSON.stringify(schema);
  }

}