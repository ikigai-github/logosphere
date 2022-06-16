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
import {
  FlureeItem,
  FlureeCollection,
  FlureePredicate,
  FlureeTag,
  FlureeSchema,
} from './fluree.schema';
import { strings as s } from '@angular-devkit/core';
import { cp } from 'fs';

export class FlureeGenerator extends Generator {
  private _schema: CanonicalSchema;

  protected generateEnum(def: Definition): void {
    // enums are generated in the generate() method override
  }

  protected generateEntity(def: Definition): FlureeCollection {
    const collection: FlureeCollection = {
      _id: c.COLLECTION,
      name: def.name,
      doc: def.description,
    };

    const predicates: FlureePredicate[] = [];
    const propGenerator = new FlureePropGenerator(def.name);

    // common entity predicates
    predicates.push({
      _id: c.PREDICATE,
      name: c.IDENTIFIER,
      type: t.STRING,
      doc: `${def.name} unique identifier`,
      index: true,
      unique: true,
    } as FlureePredicate);

    predicates.push({
      _id: c.PREDICATE,
      name: c.CREATED_AT,
      type: t.INSTANT,
      doc: `${def.name} creation time`,
      index: true,
    } as FlureePredicate);

    predicates.push({
      _id: c.PREDICATE,
      name: c.UPDATED_AT,
      type: t.INSTANT,
      doc: `${def.name} last update time`,
      index: true,
    } as FlureePredicate);

    def.props.forEach((prop: Property) => {
      if (prop.isEnabled) {
        const tags: FlureeTag[] = [];
        if (
          prop.defType === DefinitionType.Enum ||
          prop.defType === DefinitionType.EnumArray
        ) {
          const enumDef = this._schema.definitions.find(
            (def: Definition) => def.name === prop.type
          );
          if (enumDef) {
            enumDef.props.forEach((enumProp: Property) => {
              tags.push({
                _id: c.TAG,
                id: enumProp.name,
                doc: enumProp.description,
              });
            });
          }
        }
        predicates.push({
          ...propGenerator.generate(prop),
          tags: tags.length > 0 ? tags : undefined,
        });
      }
    });

    collection.predicates = predicates;

    return collection;
  }

  protected generateExternalEntity(def: Definition): void {
    // we don't need to generate collections for external entities
    // because they are going to be defined in their modules and
    // linked by identifiers.
    `${def}`;
  }

  generate(schema: CanonicalSchema): FlureeSchema {
    this._schema = schema;

    const collections: FlureeCollection[] = [];
    const tags: FlureeTag[] = [];
    schema.definitions
      .filter((def: Definition) => def.type === DefinitionType.Entity)
      .forEach((def: Definition) => {
        collections.push(this.generateEntity(def));
      });

    //by stringifying and parsing back we remove all keys set as undefined
    return JSON.parse(JSON.stringify({ collections }));
  }
}
