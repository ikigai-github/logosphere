/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FlureeItem {
  _id: string | number;
  doc?: string;
}

export interface FlureeCollection extends FlureeItem {
  name: string;
  spec?: any[];
  specDoc?: string;
  version?: string;
  predicates?: FlureePredicate[];
}

export interface FlureePredicate extends FlureeItem {
  name: string;
  spec?: any[];
  specDoc?: string;
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
  tags?: FlureeTag[];
}

export interface FlureeTag extends FlureeItem {
  id: string;
}

export interface FlureeSchema {
  collections: FlureeCollection[];
}
