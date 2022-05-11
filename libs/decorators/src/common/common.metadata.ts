// Metadata shared by multiple decorators
export type StringFunc = () => string;

export interface TargetMetadata {
  // eslint-disable-next-line @typescript-eslint/ban-types
  target: Function;
}

export interface NameMetadata {
  name: string | StringFunc;
}

export interface DocMetadata {
  doc?: string;
}

export interface SpecMetadata {
  spec?: string[];
  specDoc?: string;
}

export type CommonMetadata = TargetMetadata &
  NameMetadata &
  DocMetadata &
  SpecMetadata;
