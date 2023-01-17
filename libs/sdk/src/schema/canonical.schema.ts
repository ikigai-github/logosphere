export enum DefinitionType {
  Scalar = 'Scalar',
  Enum = 'Enum',
  Entity = 'Entity',
  ScalarArray = 'ScalarArray',
  EnumArray = 'EnumArray',
  EntityArray = 'EntityArray',
  ExternalEntity = 'ExternalEntity',
  ExternalEntityArray = 'ExternalEntityArray',
}

export interface Property {
  name: string;
  type: string;
  defType: DefinitionType;
  isEnabled?: boolean;
  isRequired?: boolean;
  isPK?: boolean;
  isUnique?: boolean;
  isFullText?: boolean;
  isReadOnly?: boolean;
  isWriteOnly?: boolean;
  isIndexed?: boolean;
  examples?: string[];
  pattern?: string;
  description?: string;
  minLength?: number;
  maxLength?: number;
  comment?: string;
  externalModule?: string;
}

export interface Definition {
  name: string;
  type: DefinitionType;
  props: Property[];
  module?: string;
  description?: string;
  isNft?: boolean;
}

export interface CanonicalSchema {
  definitions: Definition[];
}
