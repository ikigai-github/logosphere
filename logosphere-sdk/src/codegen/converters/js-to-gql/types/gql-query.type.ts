import GQLInOutType, { GQLField } from "./gql-in-out.type";
import { GQLFieldType } from "./gql-field.type";

/**
 * represents a GQL query definition
 */
export class GQLQueryType {
  #name: string;
  #inputs: GQLField[] = [];
  #outputType: GQLFieldType;

  constructor(name: string, outputType: GQLFieldType) {
    this.#name = name;
    this.#outputType = outputType;
  }

  addInputParam(paramName: string, paramType: GQLFieldType): void {
    this.#inputs.push({ name: paramName, type: paramType });
  }

  setOutputType(outputType: GQLFieldType): void {
    this.#outputType = outputType;
  }

  /**
   * recursively searches for all the input types used within the type
   * i.e. required/array decorations are stripped and it's just the bare type name.
   */
  getBareInputTypes(gqlInOutTypes: GQLInOutType[]): Set<string> {
    return this.#recursiveSearchInputTypes(
      new Set<string>(),
      this.#inputs,
      gqlInOutTypes
    );
  }

  #recursiveSearchInputTypes(
    inputTypes: Set<string>,
    fields: GQLField[],
    gqlInOutTypes: GQLInOutType[]
  ): Set<string> {
    // go through each field and add it to the input type set
    fields.forEach((field) => {
      const fieldTypeName = field.type.getBareType();

      const gqlInOutType = gqlInOutTypes.find(
        (type) => type.getName() === fieldTypeName
      );

      // if we can't find it, it's not an in/out type
      if (!gqlInOutType) {
        return;
      }

      // we don't want to continue drilling into types we've seen already
      const hasSeenBefore = inputTypes.has(fieldTypeName);
      if (!hasSeenBefore) {
        inputTypes.add(fieldTypeName);
        this.#recursiveSearchInputTypes(
          inputTypes,
          gqlInOutType.getFields(),
          gqlInOutTypes
        );
      }
    });

    return inputTypes;
  }

  getName(): string {
    return this.#name;
  }

  getOutputFieldType(): GQLFieldType {
    return this.#outputType;
  }

  toSchema(): string {
    let schemaString = this.#name;

    if (this.#inputs && this.#inputs.length > 0) {
      schemaString += "(";
      this.#inputs.forEach((input, index) => {
        const separator = index === this.#inputs.length - 1 ? "" : ", ";
        schemaString += `${input.name}: ${input.type.toSchema()}${separator}`;
      });
      schemaString += ")";
    }

    schemaString += `: ${this.#outputType.toSchema()}`;

    return schemaString;
  }
}
