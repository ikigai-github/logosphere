import { pascalCase } from 'pascal-case';
import { PropGenerator } from '../abstract';
import { Property } from '../canonical.schema';

export class DtoPropGenerator extends PropGenerator {
  #name(prop: Partial<Property>) {
    return prop.isRequired ? prop.name : `${prop.name}?`;
  }

  protected generateScalar(prop: Partial<Property>): string {
    return `\t${this.#name(prop)}: ${prop.type};\n`;
  }
  protected generateEnum(prop: Partial<Property>): string {
    return `\t${this.#name(prop)}: ${pascalCase(prop.type)};\n`;
  }
  protected generateEntity(prop: Partial<Property>): string {
    return `\t${this.#name(prop)}: ${pascalCase(prop.type)};\n`;
  }
  protected generateExternalEntity(prop: Partial<Property>): string {
    return ''; //`\t${this.#name(prop)}: ${pascalCase(prop.type)};\n`;
  }
  protected generateScalarArray(prop: Partial<Property>): string {
    return `\t${this.#name(prop)}: ${prop.type}[];\n`;
  }
  protected generateEnumArray(prop: Partial<Property>): string {
    return `\t${this.#name(prop)}: ${pascalCase(prop.type)}[];\n`;
  }
  protected generateEntityArray(prop: Partial<Property>): string {
    return `\t${this.#name(prop)}: ${pascalCase(prop.type)}[];\n`;
  }
  protected generateExternalEntityArray(prop: Partial<Property>): string {
    return '';
    `\t${this.#name(prop)}: ${pascalCase(prop.type)}[];\n`;
  }
}
