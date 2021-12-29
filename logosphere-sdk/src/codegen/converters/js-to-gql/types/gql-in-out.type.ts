import { TYPENAME } from "./common";
import { GQLFieldType } from "./gql-field.type";

/**
 * represents a GQL input/output type definition
 *
 * note: does NOT support object types with function fields.
 * This is because Hackolade doesn't support it well in the JSON schema and
 * I don't want to implement it
 */
export default class GQLInOutType {
  #name: string;
  #fields: GQLField[];

  constructor(name: string) {
    this.#name = name;
    this.#fields = [];
  }

  addField(fieldName: string, fieldType: GQLFieldType): void {
    this.#fields.push({
      name: fieldName,
      type: fieldType,
    });
  }

  getName(): string {
    return this.#name;
  }

  /**
   * WARNING: this isn't cloning the fields, so be wary of mutating the result!
   */
  getFields(): GQLField[] {
    return this.#fields;
  }

  findField(fieldName: string): GQLField | undefined {
    return this.#fields.find((field) => field.name === fieldName);
  }

  toSchema(options: InOutTypeSchemaOptions): string {
    const { isInputType = false, allowTypename = true } = options;

    let schemaString = isInputType ? "input" : "type";
    schemaString += ` ${this.#name} {\n`;
    this.#fields.forEach((field) => {
      if (!allowTypename && field.name === TYPENAME) {
        return;
      }

      schemaString += `  ${field.name}: ${field.type.toSchema()}\n`;
    });
    schemaString += "}";

    return schemaString;
  }
}

interface InOutTypeSchemaOptions {
  isInputType?: boolean;
  allowTypename?: boolean;
}

export interface GQLField {
  name: string;
  type: GQLFieldType;
}
