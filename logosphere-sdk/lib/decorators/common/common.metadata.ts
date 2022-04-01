export interface PropertyMetadata {
  // eslint-disable-next-line @typescript-eslint/ban-types
  target: Object;
  propertyKey: string | symbol;
}

export interface MethodMetadata<T> extends PropertyMetadata {
  descriptor: TypedPropertyDescriptor<T>;
}

export interface ParameterMetadata extends PropertyMetadata {
  parameterIndex: number;
}

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
