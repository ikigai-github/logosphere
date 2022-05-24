import { isEmpty } from 'lodash';
import {
  Definition,
  DefinitionType,
  CanonicalSchema,
  Property,
} from '../canonical';
import { Generator } from '../abstract';
import { FlureePropGenerator } from './fluree.prop-generator';
import { constants as c } from './fluree.constants';

import { FlureeItem, FlureePredicate } from './fluree.schema';

export class FlureeGenerator extends Generator {
  protected generateEnum(def: Definition): void {
    // we don't need to create collections for enums in Fluree
    // then enum values will be recorded as scalar strings
    `${def}`;
  }

  protected generateEntity(def: Definition): FlureeItem[] {
    const items: FlureeItem[] = [];
    const propGenerator = new FlureePropGenerator(def.name);

    // collection
    items.push({
      _id: c.COLLECTION,
      name: def.name,
      doc: def.description,
    });

    // common entity predicates
    items.push({
      _id: c.PREDICATE,
      name: `${def.name}/${c.IDENTIFIER}`,
      type: c.STRING,
      doc: `${def.name} unique identifier`,
      index: true,
      unique: true,
    } as FlureePredicate);

    items.push({
      _id: c.PREDICATE,
      name: `${def.name}/${c.CREATED_AT}`,
      type: c.INSTANT,
      doc: `${def.name} creation time`,
      index: true,
    } as FlureePredicate);

    items.push({
      _id: c.PREDICATE,
      name: `${def.name}/${c.UPDATED_AT}`,
      type: c.INSTANT,
      doc: `${def.name} last update time`,
      index: true,
    } as FlureePredicate);

    // predicates from canonical schema
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
