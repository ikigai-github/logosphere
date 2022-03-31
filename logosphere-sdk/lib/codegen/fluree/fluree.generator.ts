import { isEmpty } from 'lodash';
import { Definition, DefinitionType } from '../canonical.schema';
import { Generator } from '../abstract';
import { FlureePropGenerator } from './fluree.prop-generator';
import { CanonicalSchema, Property } from '../canonical.schema';
import { constants as c } from './fluree.constants';

import { FlureeItem } from './fluree.schema';

export class FlureeGenerator extends Generator {
  protected generateEnum(def: Definition): void {
    // we don't need to create collections for enums in Fluree
    // then enum values will be recorded as scalar strings
    `${def}`;
  }

  protected generateEntity(def: Definition): FlureeItem[] {
    const items: FlureeItem[] = [];
    const propGenerator = new FlureePropGenerator(def.name);

    // create collection
    items.push({
      _id: c.COLLECTION,
      name: def.name,
      doc: def.description,
    });

    // create predicates
    def.props.forEach((prop: Property) => {
      if (prop.isEnabled) {
        items.push(propGenerator.generate(prop));
      }
    });

    return items;
  }

  protected generateExternalEntity(def: Definition): void {
    // we don't need to generate collections for external entities
    // because they are going to be defined in their modules and
    // linked by identifiers.
    `${def}`;
  }

  generate(schema: CanonicalSchema): string {
    const flureeItems: FlureeItem[] = [];
    schema.definitions.forEach((def: Definition) => {
      switch (def.type) {
        case DefinitionType.Entity:
          flureeItems.push(...this.generateEntity(def));
          break;
        default:
          break;
      }
    });

    return JSON.stringify(
      flureeItems.filter((item: FlureeItem) => !isEmpty(item)),
      null,
      2
    );
  }
}
