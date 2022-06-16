import { cloneDeep } from 'lodash';
import {
  FlureeSchema,
  FlureeCollection,
  FlureePredicate,
  FlureeTag,
} from './fluree.schema';

export function flureeSchemaTransact(
  schema: FlureeSchema
): (FlureeCollection | FlureePredicate | FlureeTag)[] {
  const transact: (FlureeCollection | FlureePredicate | FlureeTag)[] = [];
  const transactSchema = cloneDeep(schema);
  transactSchema.collections.forEach((collection: FlureeCollection) => {
    const predicates = collection.predicates;
    delete collection.predicates;
    transact.push(collection);
    predicates.forEach((predicate: FlureePredicate) => {
      if (predicate.tags) {
        const tags = predicate.tags;
        delete predicate.tags;
        tags.forEach((tag: FlureeTag) => {
          transact.push({
            ...tag,
            id: `${collection.name}/${predicate.name}:${tag.id}`,
          });
        });
      }
      transact.push({
        ...predicate,
        name: `${collection.name}/${predicate.name}`,
      });
    });
  });

  return transact;
}
