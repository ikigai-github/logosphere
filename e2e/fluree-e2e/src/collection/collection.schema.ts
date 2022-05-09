export interface CreatePredicateItem {
  name: string;
  type: string;
  doc?: string;
}

export interface CreateCollectionRequest {
  name: string;
  doc?: string;
  predicates?: CreatePredicateItem[];
}
