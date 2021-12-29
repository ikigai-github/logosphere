import GQLEnumType from "./gql-enum.type";
import { GQLBasicType } from "./common";

export class GQLFieldType {
  #name: string;
  #properties: GQLFieldProperties = {
    isArray: false,
    isArrayRequired: false,
    isRequired: false,
    minItems: 0,
    maxItems: 3,
  };
  #examples?: (string | number)[];

  constructor(
    name: string,
    properties?: GQLFieldProperties,
    examples?: (string | number)[]
  ) {
    this.#name = name;

    if (properties) {
      this.#properties = properties;
    }

    this.#examples = examples;
  }

  getBareType(): string {
    return this.#name;
  }

  getProperties(): GQLFieldProperties {
    return this.#properties;
  }

  getExamples(): (string | number)[] | undefined {
    return this.#examples;
  }

  isObjectType(gqlEnumTypes: GQLEnumType[]): boolean {
    return (
      !Object.values(GQLBasicType).includes(this.#name as GQLBasicType) &&
      !this.isEnumType(gqlEnumTypes)
    );
  }

  isEnumType(gqlEnumTypes: GQLEnumType[]): boolean {
    return gqlEnumTypes.some(
      (gqlEnumType) => gqlEnumType.getName() === this.#name
    );
  }

  isArray(): boolean {
    return this.#properties.isArray;
  }

  isFieldRequired(): boolean {
    return this.#properties.isArrayRequired || this.#properties.isRequired;
  }

  toSchema(): string {
    let schemaString = this.#name;

    if (this.#properties.isRequired) {
      schemaString = `${schemaString}!`;
    }

    if (this.#properties.isArray) {
      schemaString = `[${schemaString}]`;

      if (this.#properties.isArrayRequired) {
        schemaString = `${schemaString}!`;
      }
    }

    return schemaString;
  }
}

export interface GQLFieldProperties {
  // NOTE: Hackolade can only represent [Type]! and Type!
  // [Type!] and [Type!]! are not supported for now
  isRequired: boolean;
  isArray: boolean;
  isArrayRequired: boolean;
  minItems: number;
  maxItems: number;
}
