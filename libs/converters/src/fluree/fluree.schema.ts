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
  restrictTag?: boolean;
  encrypted?: boolean;
  fullText?: boolean;
}

export interface FlureeTag {
  _id: string;
  id: string;
  doc?: string;
}

export interface FlureeSchema {
  definitions: FlureeItem[];
  tags?: FlureeTag[];
}
