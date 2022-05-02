import { FlureeWhereOperator, FlureeQuery } from '../fluree.query.schema';
import { PredicateNode, QuerySpec, ReferenceNode } from './query.schema';

/**
 * A guard to check if a predicate node is a reference node
 * @param node The node to run the guard against
 * @returns true if the node is a ReferenceNode, otherwise false.
 */
function isReferenceNode(node: PredicateNode): node is ReferenceNode {
  return typeof node !== 'string';
}

/**
 * Resolves nested predicate nodes into the FlureeQL format
 * @param predicate The predicate node to be converted into a FlureeQL select predicate
 * @returns FlureeQL select predicate resolved from the passed in predicate node
 */
function resolvePredicate(predicate: PredicateNode): string | object {
  if (isReferenceNode(predicate)) {
    const nestedPredicates = predicate.predicates.map(resolvePredicate);

    if (predicate.opts) {
      return { [predicate.field]: [...nestedPredicates, predicate.opts] };
    } else {
      return { [predicate.field]: nestedPredicates };
    }
  }

  return predicate;
}

/**
 * Combines all of the given clauses together into a single string using the supplied operator.
 * If no operator is supplied then it will default to combining with the `AND` operator.
 * @param clauses The where clauses to be concatenated together
 * @param operator The operator used for combining the where clauses
 * @returns A string containing the combined set of where clauses
 */
function buildWhere(clauses: string[], operator?: FlureeWhereOperator): string {
  if (clauses?.length > 0) {
    let clause = clauses[0];
    const op = operator ?? 'AND';
    for (let i = 1; i < clauses.length; ++i) {
      clause += ` ${op} ${clauses[i]}`;
    }

    return clause;
  }
}

/**
 * Takes a query specification and compiles it into a Fluree Query object
 * @param spec The query specification to be compiled
 * @returns A FlureeQL query object
 */
export function compile(spec: QuerySpec): FlureeQuery {
  const predicates = spec.predicates.map(resolvePredicate);
  const where = buildWhere(spec.where);
  const from = spec.from;
  const opts = spec.opts;

  if (spec.key === 'selectOne') {
    return {
      selectOne: predicates,
      where,
      from,
      opts,
    };
  } else {
    return {
      select: predicates,
      where,
      from,
      opts,
    };
  }
}
