export type FlureeQueryOrdering = 'ASC' | 'DESC';

export type FlureeOrderClause = string | [FlureeQueryOrdering, string];

export type FlureeSelectKey = 'select' | 'selectOne' | 'selectDistinct';

export type FlureeWhereOperator = 'AND' | 'OR';

export interface FlureeQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: FlureeOrderClause;
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
  _orderBy?: FlureeOrderClause;
  _compact?: string;
}

export type FlureeFromPredicate = [string, string];

export type FlureeFromClause =
  | string
  | number
  | FlureeFromPredicate
  | [number, FlureeFromPredicate][];

export interface FlureeQueryCommon {
  from?: FlureeFromClause;
  where?: string;
  block?: number;
  opts?: FlureeQueryOptions;
}

export interface FlureeMultiQuery extends FlureeQueryCommon {
  select: (string | object)[];
}

export interface FlureeOneQuery extends FlureeQueryCommon {
  selectOne: (string | object)[];
}

export type FlureeQuery = FlureeMultiQuery | FlureeOneQuery;

export interface FlureeObject {
  _id: string;
}

export type FlureeResult = FlureeObject[];
