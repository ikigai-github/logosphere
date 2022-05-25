import { pascalCase } from 'pascal-case';
import { Property } from '../canonical';
import { PropGenerator } from '../abstract/prop-generator.abstract';

export class GqlPropGenerator extends PropGenerator {
  // TODO: add support for different number types
  // https://ikigai-technologies.atlassian.net/browse/LOG-163
  private _typeMap = {
    number: 'int',
    integer: 'int',
  };

  #typeMap(key: string): string {
    return this._typeMap[key] ? this._typeMap[key] : key;
  }

  protected generateScalar(prop: Property): string {
    return `\t${prop.name}: ${
      prop.isPK ? 'ID' : pascalCase(this.#typeMap(prop.type))
    }${prop.isRequired ? '!' : ''}\n`;
  }

  protected generateEnum(prop: Property): string {
    return `\t${prop.name}: ${pascalCase(prop.type)}${
      prop.isRequired ? '!' : ''
    }\n`;
  }

  protected generateEntity(prop: Property): string {
    return `\t${prop.name}: ${pascalCase(prop.type)}${
      prop.isRequired ? '!' : ''
    }\n`;
  }

  protected generateExternalEntity(prop: Property): string {
    return `\t${prop.name}: ${pascalCase(prop.type)}${
      prop.isRequired ? '!' : ''
    }\n`;
  }

  protected generateScalarArray(prop: Property): string {
    return `\t${prop.name}: [${pascalCase(this.#typeMap(prop.type))}]${
      prop.isRequired ? '!' : ''
    }\n`;
  }

  protected generateEnumArray(prop: Property): string {
    return `\t${prop.name}: [${pascalCase(prop.type)}]${
      prop.isRequired ? '!' : ''
    }\n`;
  }

  protected generateEntityArray(prop: Property): string {
    return `\t${prop.name}: [${pascalCase(prop.type)}]${
      prop.isRequired ? '!' : ''
    }\n`;
  }

  protected generateExternalEntityArray(prop: Property): string {
    return `\t${prop.name}: [${pascalCase(prop.type)}]${
      prop.isRequired ? '!' : ''
    }\n`;
  }
}
