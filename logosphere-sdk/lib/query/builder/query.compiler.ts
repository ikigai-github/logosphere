import {
  PredicateNode,
  QueryContext,
  ReferenceNode,
  WhereOperator,
} from './query.schema';

function isReferenceNode(node: PredicateNode): node is ReferenceNode {
  return typeof node !== 'string';
}

function resolvePredicate(predicate: PredicateNode) {
  if (isReferenceNode(predicate)) {
    const nestedPredicates = predicate.predicates.map(resolvePredicate);

    if (predicate.options) {
      return { [predicate.field]: [...nestedPredicates, predicate.options] };
    } else {
      return { [predicate.field]: nestedPredicates };
    }
  }

  return predicate;
}

function buildWhere(clauses: string[], operator?: WhereOperator) {
  if (clauses?.length > 0) {
    let clause = clauses[0];
    const op = operator ?? 'AND';
    for (let i = 1; i < clauses.length; ++i) {
      clause += ` ${op} ${clauses[i]}`;
    }

    return clause;
  }
}

export function compile(query: QueryContext) {
  return {
    [query.key]: query.predicates.map(resolvePredicate),
    where: buildWhere(query.where),
    from: query.from,
    opts: query.options,
  };
}
