/**
 * When ordering results of a query you may optional specify if that should be ascending or descing order.
 */
export type FlureeQueryOrdering = 'ASC' | 'DESC';

/**
 * Order by can just a predicate or a tuple with orderding followed by predicate.
 * i.e. 'person/name', ['ASC', 'person/name']
 */
export type FlureeOrderClause = string | [FlureeQueryOrdering, string];

/**
 * The select key indicates to fluree if one result or an array of results should be returned
 */
export type FlureeSelectKey = 'select' | 'selectOne' | 'selectDistinct';

/**
 * A fluree where clause supports chaining clauses with an AND or OR operator.
 */
export type FlureeWhereOperator = 'AND' | 'OR';

/**
 * the `opts` can be included with the query to indicate to Fluree how the results should be returned
 */
export interface FlureeQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: FlureeOrderClause;
  component?: boolean;
  compact?: boolean;
  syncTo?: number;
  syncTimeout?: number;
}

/**
 * Similar to the `opts` but applied when following a reference that is an array of values (multi)
 */
export interface ReferenceOptions {
  _limit?: number;
  _offset?: number;
  _recur?: number;
  _component?: boolean;
  _as?: string;
  _orderBy?: FlureeOrderClause;
  _compact?: string;
}

/**
 * a tuple containing predicate name and its value used in a From Clause
 */
export type FlureeFromPredicate = [string, string];

/**
 * A from clause can be the name of a collection (string), the name of a predicate (string)
 * the id of a subject (number), a predicate name and predicate value tuple ([string, string]),
 * or an array of subject and predicate name-value pairs ([number, [string, string]][])
 */
export type FlureeFromClause =
  | string
  | number
  | FlureeFromPredicate
  | [number, FlureeFromPredicate][];

/**
 * A Fluree query will always have a from clause, where clause, or both.  Because of this the two fields
 * are marked as optional but at least one must be specified.  A select clause is requried so the base
 * type should never be used it just provides the shared shape for the single and multi queries.
 */
export interface FlureeQueryBase {
  from?: FlureeFromClause;
  where?: string;
  block?: number;
  opts?: FlureeQueryOptions;
}

export interface FlureeSignableQueryBase {
  query: FlureeQuery;
  serialized: string;
  hash: string;
}

export interface FlureeQueryBaseHash {
  query: string;
  hash: string;
}

export interface FlureeSignedQueryBase {
  hash: string;
  signature: string;
}

/**
 * A Fluree query that uses the 'select' key. This implies the result will be an array of Fluree Objects
 */
export interface FlureeMultiQuery extends FlureeQueryBase {
  select: (string | object)[];
}

/**
 * A Fluree query that uses the 'select' key, which can be signed. This implies the result will be an array of Fluree Objects
 */
export interface FlureeSignableMultiQuery extends FlureeSignableQueryBase {
  select: (string | object)[];
}

/**
 * A Fluree query that uses the 'select' key, which is signed. This implies the result will be an array of Fluree Objects
 */
export interface FlureeSignedMultiQuery extends FlureeSignedQueryBase {
  select: (string | object)[];
}

/**
 * A hash of a Fluree query that uses the 'select' key. This implies the result will be an array of Fluree Objects
 */
export interface FlureeMultiQueryHash extends FlureeQueryBaseHash {
  select: (string | object)[];
}

/**
 * A Fluree query that uses the 'selectOne' key.  This implies the result will be a single Fluree Object.
 */
export interface FlureeSingleQuery extends FlureeQueryBase {
  selectOne: (string | object)[];
}

/**
 * A Fluree query that uses the 'selectOne' key, which can be signed. This implies the result will be a single Fluree Object.
 */
export interface FlureeSignableSingleQuery extends FlureeSignableQueryBase {
  selectOne: (string | object)[];
}

/**
 * A Fluree query that uses the 'selectOne' key, which is signed. This implies the result will be a single Fluree Object.
 */
export interface FlureeSignedSingleQuery extends FlureeSignedQueryBase {
  selectOne: (string | object)[];
}

/**
 * A hash of a Fluree query that uses the 'selectOne' key. This implies the result will be a single Fluree Object.
 */
export interface FlureeSingleQueryHash extends FlureeQueryBaseHash {
  selectOne: (string | object)[];
}

export type FlureeQuery =
  | FlureeMultiQuery
  | FlureeSignableMultiQuery
  | FlureeSignedMultiQuery
  | FlureeMultiQueryHash
  | FlureeSingleQuery
  | FlureeSignableSingleQuery
  | FlureeSignedSingleQuery
  | FlureeSingleQueryHash;

/**
 * All Fluree objects will have an _id field at a minimum
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FlureeSingleObject extends Record<string, any> {
  _id: number;
}

export type FlureeMultiObject = FlureeSingleObject[];

/**
 * Fluree results will be a single object when using the 'selectOne' key or an array of objects when
 * using the 'select' key.
 */
export type FlureeObject = FlureeSingleObject | FlureeMultiObject;

/**
 * Type guard to check if an object is a single fluree object
 * @param obj The object to perform the type guard on
 * @returns true if the object is a single Fluree Object
 */
export function isFlureeSingleObject(obj: unknown): obj is FlureeSingleObject {
  return (
    typeof obj === 'object' && (obj as FlureeSingleObject)._id !== undefined
  );
}

/**
 * Type guard to check if an object is a Fluree object
 * @param obj The object to perform the type guard on
 * @returns true if the object is a FlureeObject
 */
export function isFlureeObject(obj: unknown): obj is FlureeObject {
  if (Array.isArray(obj) && (obj.length === 0 || obj[0]._id !== undefined)) {
    return true;
  }

  return isFlureeSingleObject(obj);
}

/**
 * Type guard to check if a query is a multi query
 * @param query The query that you would like to apply the type guard to
 * @returns true if the query is an instance of FlureeMultiQuery
 */
export function isFlureeMultiQuery(
  query: FlureeQuery
): query is FlureeMultiQuery {
  return (
    typeof (query as FlureeMultiQuery).select !== 'undefined' &&
    typeof (query as FlureeSingleQuery).selectOne === 'undefined'
  );
}

/**
 * Type guard to check if a query is a single query
 * @param query The query that you would like to apply the type guard to
 * @returns true if the query is an instance of FlureeSingleQuery
 */
export function isFlureeSingleQuery(
  query: FlureeQuery
): query is FlureeSingleQuery {
  return (
    typeof (query as FlureeMultiQuery).select === 'undefined' &&
    typeof (query as FlureeSingleQuery).selectOne !== 'undefined'
  );
}

/**
 * A reference node is used to indicate a reference from the subject should be followed
 * and what predicates in that reference should be fetched.
 */
export interface ReferenceNode {
  readonly field: string;
  readonly predicates: PredicateNode[];
  readonly opts?: ReferenceOptions;
}

/**
 * Predicates can be fully qualified predicate names or in the case of a ref
 * they can be an reference object with its own set of selected fields.
 */
export type PredicateNode = string | ReferenceNode;

/**
 * A query specification can be used to build a FlureeQuery.  A spec requires
 * a minimum of a select key and a list of predicates.  It also requires either a from clause
 * or a where clause.
 */
export interface QuerySpec {
  key: FlureeSelectKey;
  predicates: PredicateNode[];
  from?: FlureeFromClause;
  where?: string[];
  whereOperator?: FlureeWhereOperator;
  block?: number;
  opts?: FlureeQueryOptions;
  auth?: string;
}
