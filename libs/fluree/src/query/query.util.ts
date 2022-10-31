import { stringify } from '../utils';
import { sign_message } from '@fluree/crypto-base';
import { getSinFromPrivateKey, signQuery as sign } from '@fluree/crypto-utils';
import { FlureeClient } from '../fluree.client';
import {
  FlureeQuery,
  FlureeObject,
  QuerySpec,
  isFlureeObject,
  FlureeSingleObject,
} from './query.schema';
import { compile } from './query.compiler';

export type FlureeMapper<T> = (input: FlureeSingleObject) => T;

/**
 * Walks through a FlureeObject and removes the namespace part of the predicate.
 * If the predicate is a reverse walk it will instead use the collection name.
 * @param obj The Fluree object to remove namespacing from
 * @returns A FlureeObject with namespacing removed
 */
export function flattenNames(obj: FlureeObject): FlureeObject {
  if (Array.isArray(obj)) {
    return obj.map(flattenNames) as FlureeObject;
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
    newObject[newKey] = isFlureeObject(value) ? flattenNames(value) : value;
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
export async function query<T extends object>(
  client: FlureeClient,
  spec: QuerySpec,
  mapper?: FlureeMapper<T>
): Promise<T | T[] | FlureeObject> {
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

/**
 * Takes a Fluree query object and serializes to a normalized string using a
 * deterministic JSON stringify function.
 * @param query The query to serialize into a string
 * @returns a normalized and serialized representation of the query
 */
export function serializeQuery(query: FlureeQuery): string {
  return stringify(query).normalize('NFKC');
}

/**
 * Converts a serialized query string back into a Fluree query map
 * @param query The serialized command string
 * @returns A Fluree query map created from deserializeing the query string
 */
export function deserializeQuery(query: string): FlureeQuery {
  return JSON.parse(query);
}
