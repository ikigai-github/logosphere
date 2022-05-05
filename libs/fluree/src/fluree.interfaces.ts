/* interfaces */
export interface FlureeCollection {
  _id: string;
  name: string;
  doc?: string;
  spec?: any[];
  specDoc?: string;
  version?: string;
}

export interface FlureePredicate {
  _id: string;
  name: string;
  doc?: string;
  type: string;
  unique?: boolean;
  multi?: boolean;
  index?: boolean;
  upsert?: boolean;
  noHistory?: boolean;
  component?: boolean;
  spec?: any[];
  specDoc?: string;
  deprecated?: boolean;
  txSpec?: any[];
  txSpecDoc?: string;
  restrictCollection?: string;
  restrictTag?: string;
  encrypted?: boolean;
  fullText?: boolean;
}

export const Predicates = Object.freeze({
  _ID: '_id',
  ID: 'id',
  PREDICATE: '_predicate',
  COLLECTION: '_collection',
  NAME: 'name',
  IDENTIFIER: 'identifier',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  OWNER: 'owner',
});

export const FlureeCollection = Object.freeze({
  USER: '_user',
  AUTH: '_auth',
  ROLE: '_role',
  RULE: '_rule',
  FUNCTION: '_fn',
  COLLECTION: '_collection',
});
