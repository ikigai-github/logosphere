// import { select, ref } from './query.builder';

import { FlureeClient } from '../fluree.client';
import { FlureeObject, isFlureeObject } from '../fluree.query.schema';
import { compile } from './query.compiler';
import { QuerySpec as QuerySpec } from './query.schema';

type Mapper = (input: any) => any;

/**
 * Walks through a FlureeObject and removes the namespace part of the predicate.
 * If the predicate is a reverse walk it will instead use the collection name.
 * @param obj The Fluree object to remove namespacing from
 * @returns A FlureeObject with namespacing removed
 */
export function removeNamespace(obj: FlureeObject): FlureeObject {
  if (Array.isArray(obj)) {
    return obj.map(removeNamespace) as FlureeObject;
  }

  const newObject: FlureeObject = {
    _id: obj._id,
  };

  for (const key in obj) {
    const [collection, predicate] = key.split('/');
    //Use the predicate name unless its a reverse walk then use the collection name
    const newKey =
      predicate && !predicate.startsWith('_') ? predicate : collection;
    const value = obj[key];
    newObject[newKey] = isFlureeObject(value) ? removeNamespace(value) : value;
  }

  return newObject;
}

/**
 * A utility function to take a query and return mapped result
 * @param client
 * @param spec
 * @param mapper
 * @returns
 */
export async function query(
  client: FlureeClient,
  spec: QuerySpec,
  mapper?: Mapper
) {
  const fql = compile(spec);

  const result: FlureeObject = await client.query(fql);
  if (mapper) {
    if (Array.isArray(result)) {
      return result.map((item) => mapper(item));
    } else if (result) {
      return mapper(result);
    }
  }

  return result;
}
