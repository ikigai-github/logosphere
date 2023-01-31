export interface FlureeItem {
  _id: string | number;
  doc?: string;
}

export interface FlureeTag extends FlureeItem {
  id: string;
}

export interface FlureePredicate extends FlureeItem {
  name: string;
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
  restrictTag?: boolean;
  encrypted?: boolean;
  fullText?: boolean;
  tags?: FlureeTag[];
}

export interface FlureeCollection extends FlureeItem {
  name: string;
  spec?: any[];
  specDoc?: string;
  version?: string;
  predicates?: FlureePredicate[];
}

export interface FlureeSchema {
  collections: FlureeCollection[];
}
