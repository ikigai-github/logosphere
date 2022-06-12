/* eslint-disable @typescript-eslint/no-unused-vars */
import { DefinitionType, Definition, Property } from '../canonical';
import { Parser } from '../abstract/parser.abstract';
import { FlureeSchemaPropParser } from './fluree.prop-parser';
import {
  FlureeSchema,
  FlureeCollection,
  FlureePredicate,
} from './fluree.schema';

export class FlureeSchemaParser extends Parser {
  #mapDefType(predicate: FlureePredicate): DefinitionType {
    return DefinitionType.Entity;
  }

  #mapType(predicate: FlureePredicate): string {
    return 'string';
  }

  protected getDefs(schema: FlureeSchema): Definition[] {
    const defs: Definition[] = [];
    schema.definitions.map((collection: FlureeCollection) => {
      defs.push({
        name: collection.name,
        type: DefinitionType.Entity,
        description: collection.doc,
        props: collection.predicates.map((predicate: FlureePredicate) => {
          const propParser = new FlureeSchemaPropParser(predicate.name);
          return propParser.parse(predicate);
        }),
      });
    });

    return defs;
  }
}
