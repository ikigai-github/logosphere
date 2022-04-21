import {
  ReferenceOptions,
  FlureeSelectKey,
  FlureeFromClause,
  FlureeWhereOperator,
  FlureeQueryOptions,
} from '../fluree.schema';

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
}
