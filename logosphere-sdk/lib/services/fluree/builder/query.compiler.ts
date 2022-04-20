import { FlureeWhereOperator, FlureeQuery } from '../fluree.schema';
import { PredicateNode, QueryContext, ReferenceNode } from './query.schema';

function isReferenceNode(node: PredicateNode): node is ReferenceNode {
  return typeof node !== 'string';
}

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

export function compile(query: QueryContext): FlureeQuery {
  const predicates = query.predicates.map(resolvePredicate);
  const where = buildWhere(query.where);
  const from = query.from;
  const opts = query.opts;

  if (query.key === 'select' || query.key == 'selectDistinct') {
    return {
      select: predicates,
      where,
      from,
      opts,
    };
  } else {
    return {
      selectOne: predicates,
      where,
      from,
      opts,
    };
  }
}
