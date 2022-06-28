import { pascalCase } from 'pascal-case';
import { PropGenerator } from '../abstract';
import { Property } from '../canonical';

export class DtoPropGenerator extends PropGenerator {
  #name(prop: Property) {
    return prop.isRequired ? prop.name : `${prop.name}?`;
  }

  protected generateScalar(prop: Property): string {
    return `\t${this.#name(prop)}: ${prop.type};\n`;
  }
  protected generateEnum(prop: Property): string {
    return `\t${this.#name(prop)}: ${pascalCase(prop.type)};\n`;
  }
  protected generateEntity(prop: Property): string {
    return `\t${this.#name(prop)}: ${pascalCase(prop.type)};\n`;
  }
  protected generateExternalEntity(prop: Property): string {
    return '';
    `\t${this.#name(prop)}: ${pascalCase(prop.type)};\n`;
  }
  protected generateScalarArray(prop: Property): string {
    return `\t${this.#name(prop)}: ${prop.type}[];\n`;
  }
  protected generateEnumArray(prop: Property): string {
    return `\t${this.#name(prop)}: ${pascalCase(prop.type)}[];\n`;
  }
  protected generateEntityArray(prop: Property): string {
    return `\t${this.#name(prop)}: ${pascalCase(prop.type)}[];\n`;
  }
  protected generateExternalEntityArray(prop: Property): string {
    return '';
    `\t${this.#name(prop)}: ${pascalCase(prop.type)}[];\n`;
  }
}
