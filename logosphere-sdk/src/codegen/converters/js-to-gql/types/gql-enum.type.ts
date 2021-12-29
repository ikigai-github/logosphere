/**
 * represents a GQL Enum type definition
 */
export default class GQLEnumType {
  #name: string;
  #enums: string[] = [];
  #examples?: (string | number)[];

  constructor(name: string, enums: string[], examples?: (string | number)[]) {
    this.#name = name;
    this.#enums = enums;
    this.#examples = examples;
  }

  addEnum(enumName: string): void {
    this.#enums.push(enumName);
  }

  addEnums(enums: string[]): void {
    this.#enums.push(...enums);
  }

  getName(): string {
    return this.#name;
  }

  getExamples(): (string | number)[] | undefined {
    return this.#examples;
  }

  getEnums(): string[] {
    return this.#enums;
  }

  toSchema(): string {
    let schemaString = `enum ${this.#name} {\n`;

    this.#enums.forEach((enumName) => {
      schemaString += `  ${enumName}\n`;
    });

    schemaString += "}";

    return schemaString;
  }
}
