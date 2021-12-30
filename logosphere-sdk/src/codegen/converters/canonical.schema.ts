export enum DefinitionType {
  Scalar = "Scalar",
  Enum = "Enum",
  Definition = "Definition",
  ScalarArray = "ScalarArray",
  EnumArray = "EnumArray",
  DefArray = "DefArray",
  LinkedDef = "LinkedDef",
  LinkedDefArray = "LinkedDefArray",
}

export interface IProperty {
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
}

export interface IDefinition {
  name: string;
  type: DefinitionType;
  props: Partial<IProperty>[];
}

export interface ICanonicalSchema {
  definitions: IDefinition[];
}
