export enum DefinitionType {
  Scalar = 'Scalar',
  Enum = 'Enum',
  Definition = 'Definition',
  ScalarArray = 'ScalarArray',
  EnumArray = 'EnumArray',
  DefArray = 'DefArray',
  LinkedDef = 'LinkedDef',
  LinkedDefArray = 'LinkedDefArray',
}

export interface Property {
  name: string;
  type: string;
  isEnabled: boolean;
  isRequired: boolean;
  isPK: boolean;
  isReadOnly: boolean;
  isWriteOnly: boolean;
  defType: DefinitionType;
  examples: string[];
  pattern: string;
  description: string;
  minLength: number;
  maxLength: number;
  comment: string;
  linkedModule: string;
}

export interface Definition {
  name: string;
  type: DefinitionType;
  props: Partial<Property>[];
}

export interface CanonicalSchema {
  definitions: Definition[];
}
