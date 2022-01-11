import { Definition, DefinitionType } from '../canonical.schema';
import { Generator } from '../abstract/generator.abstract';
import { CanonicalSchema } from '../canonical.schema';
import { constants as c } from './fluree.constants';

import { FlureeSchema, FlureeCollection, FlureeItem } from './fluree.schema';

export class FlureeGenerator extends Generator {
  protected generateEnum(def: Definition): void {
    // we don't need to create collections for enums in Fluree
    // then enum values will be recorded as scalar strings
  }

  protected generateEntity(def: Definition): FlureeCollection {
    return {
      _id: c.COLLECTION,
      name: def.name,
    };
  }

  protected generateExternalEntity(def: Definition): void {
    // we don't need to generate collections for external entities
    // because they are going to be defined in their modules and 
    // linked by identifiers. 
  }

  generate(schema: CanonicalSchema): string {
    const flureeItems: FlureeItem[] = [];
    schema.definitions.forEach((def: Definition) => {

      switch (def.type) {
        case DefinitionType.Entity:
          console.log(def.name);
          flureeItems.push(this.generateEntity(def));
          break;
        default:
          break;
      }
    });

    return JSON.stringify(flureeItems);

  }
    
}
