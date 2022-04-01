export interface NameOptions {
  name?: string;
}

export interface DocOptions {
  doc?: string;
}

export interface SpecOptions {
  spec?: string[];
  specDoc?: string;
}

export interface VersionOptions {
  version?: string;
}

export type CommonOptions = NameOptions & DocOptions & SpecOptions;
