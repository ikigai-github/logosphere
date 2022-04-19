export type QueryOrdering = 'ASC' | 'DESC';

export type QueryOrderClause = string | [QueryOrdering, string];

export type QueryFromPredicate = [string, string];

export type QueryFromClause =
  | string
  | number
  | QueryFromPredicate
  | [number, QueryFromPredicate][];

export type SelectKey = 'select' | 'selectOne' | 'selectDistinct';

export type WhereOperator = 'AND' | 'OR';

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: QueryOrderClause;
  component?: boolean;
  compact?: boolean;
  syncTo?: number;
  syncTimeout?: number;
}

export interface ReferenceOptions {
  _limit?: number;
  _offset?: number;
  _recur?: number;
  _component?: boolean;
  _as?: string;
  _orderBy?: QueryOrderClause;
  _compact?: string;
}

export interface ReferenceNode {
  readonly field: string;
  readonly predicates: PredicateNode[];
  options?: ReferenceOptions;
}

export type PredicateNode = string | ReferenceNode;

export interface QueryContext {
  key: SelectKey;
  predicates: PredicateNode[];
  from?: QueryFromClause;
  where?: string[];
  whereOperator?: WhereOperator;
  block?: number;
  options?: QueryOptions;
}
