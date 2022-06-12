export interface FlureeItem {
  _id: string;
  name: string;
  doc?: string;
  spec?: any[];
  specDoc?: string;
}

export interface FlureeCollection extends FlureeItem {
  version?: string;
  predicates?: FlureePredicate[];
}

export interface FlureePredicate extends FlureeItem {
  type: string;
  unique?: boolean;
  multi?: boolean;
  index?: boolean;
  upsert?: boolean;
  noHistory?: boolean;
  component?: boolean;
  deprecated?: boolean;
  txSpec?: any[];
  txSpecDoc?: string;
  restrictCollection?: string;
  restrictTag?: string;
  encrypted?: boolean;
  fullText?: boolean;
}

export interface FlureeSchema {
  definitions: FlureeItem[];
}

export interface FlureeQuery {
  select: string[];
  from: string[] | string;
  where?: string[];
}
