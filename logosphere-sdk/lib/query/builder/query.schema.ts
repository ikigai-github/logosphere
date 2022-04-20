import {
  ReferenceOptions,
  FlureeSelectKey,
  FlureeFromClause,
  FlureeWhereOperator,
  FlureeQueryOptions,
} from '../fluree';

export interface ReferenceNode {
  readonly field: string;
  readonly predicates: PredicateNode[];
  readonly opts?: ReferenceOptions;
}

export type PredicateNode = string | ReferenceNode;

export interface QueryContext {
  key: FlureeSelectKey;
  predicates: PredicateNode[];
  from?: FlureeFromClause;
  where?: string[];
  whereOperator?: FlureeWhereOperator;
  block?: number;
  opts?: FlureeQueryOptions;
}
