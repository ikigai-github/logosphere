/* eslint-disable @typescript-eslint/ban-types */

/**
 * Generic metadata that comes from any property decorator
 */
export interface PropertyMetadata {
  /**
   * 
   */
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
