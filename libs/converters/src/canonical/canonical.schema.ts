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
  isEnabled: boolean;
  isRequired: boolean;
  isPK: boolean;
  isUnique: boolean;
  isFullText: boolean;
  isReadOnly: boolean;
  isWriteOnly: boolean;
  isIndexed: boolean;
  defType: DefinitionType;
  examples: string[];
  pattern: string;
  description: string;
  minLength: number;
  maxLength: number;
  comment: string;
  externalModule: string;
}

export interface Definition {
  name: string;
  type: DefinitionType;
  module?: string;
  description?: string;
  isNft?: boolean;
  props: Partial<Property>[];
}

export interface CanonicalSchema {
  definitions: Definition[];
}
