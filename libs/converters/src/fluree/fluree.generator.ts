/* eslint-disable @typescript-eslint/no-unused-vars */
import { isEmpty } from 'lodash';
import {
  Definition,
  DefinitionType,
  CanonicalSchema,
  Property,
} from '../canonical';
import { Generator } from '../abstract';
import { FlureePropGenerator } from './fluree.prop-generator';
import { constants as c, types as t } from './fluree.constants';
import { FlureeItem, FlureePredicate, FlureeTag } from './fluree.schema';
import { strings as s } from '@angular-devkit/core';
import { PropertySignature } from 'ts-morph';

export class FlureeGenerator extends Generator {
  protected generateEnum(def: Definition): void {
    // enums are generated in the generate() method override
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
      type: t.STRING,
      doc: `${def.name} unique identifier`,
      index: true,
      unique: true,
    } as FlureePredicate);

    items.push({
      _id: c.PREDICATE,
      name: `${def.name}/${c.CREATED_AT}`,
      type: t.INSTANT,
      doc: `${def.name} creation time`,
      index: true,
    } as FlureePredicate);

    items.push({
      _id: c.PREDICATE,
      name: `${def.name}/${c.UPDATED_AT}`,
      type: t.INSTANT,
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
    const items: FlureeItem[] = [];
    const tags: FlureeTag[] = [];
    schema.definitions.forEach((def: Definition) => {
      switch (def.type) {
        case DefinitionType.Entity:
          items.push(...this.generateEntity(def));
          break;
        default:
          break;
      }
    });

    schema.definitions
      .filter((def: Definition) => def.type === DefinitionType.Entity)
      .forEach((def: Definition) => {
        def.props
          .filter(
            (prop: Property) =>
              prop.defType === DefinitionType.Enum ||
              prop.defType === DefinitionType.EnumArray
          )
          .forEach((prop: Property) => {
            const enm = schema.definitions.find(
              (def: Definition) => def.name === prop.type
            );
            if (enm) {
              enm.props.forEach((enumProp: Property) => {
                tags.push({
                  _id: c.TAG,
                  id: `${def.name}/${prop.name}:${enumProp.name}`,
                });
              });
            }
          });
      });

    return JSON.stringify(
      [
        ...items.filter((item: FlureeItem) => !isEmpty(item)),
        ...tags.filter((tag: FlureeTag) => !isEmpty(tag)),
      ],
      null,
      2
    );
  }
}
