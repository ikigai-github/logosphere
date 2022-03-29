export interface RangeFilter {
  min : number;
  max : number;
}

export interface SearchFilter {
  type        : string;
  predicate   : string;
  value       : string | number | boolean | RangeFilter;
}