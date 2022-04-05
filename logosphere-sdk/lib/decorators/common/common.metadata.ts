// Metadata shared by multiple decorators

export interface NameMetadata {
  name: string;
}

export interface DocMetadata {
  doc?: string;
}

export interface SpecMetadata {
  spec?: string[];
  specDoc?: string;
}

export type CommonMetadata = NameMetadata & DocMetadata & SpecMetadata;
