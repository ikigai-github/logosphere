import { pascalCase } from 'pascal-case';
import { Property } from '../canonical.schema';
import { PropGenerator } from '../prop-generator.abstract';

export class GqlPropGenerator extends PropGenerator {
  private _typeMap = {
    number: 'float',
    integer: 'int',
  };

  #typeMap(key: string): string {
    return this._typeMap[key] ? this._typeMap[key] : key;
  }

  protected genScalar(prop: Property): string {
    console.log(prop.name);
    return `\t${prop.name}: ${pascalCase(this.#typeMap(prop.type))}${
      prop.isRequired ? '!' : ''
    }\n`;
  }
  protected genDefinition(prop: Property): string {
    return `\t${prop.name}: ${pascalCase(prop.type)}${
      prop.isRequired ? '!' : ''
    }\n`;
  }
  protected genEnum(prop: Property): string {
    return `\t${prop.name}: ${pascalCase(prop.type)}${
      prop.isRequired ? '!' : ''
    }\n`;
  }
  protected genDefArray(prop: Property): string {
    return `\t${prop.name}: [${pascalCase(prop.type)}]${
      prop.isRequired ? '!' : ''
    }\n`;
  }
  protected genScalarArray(prop: Property): string {
    return `\t${prop.name}: [${pascalCase(this.#typeMap(prop.type))}]${
      prop.isRequired ? '!' : ''
    }\n`;
  }

  protected genEnumArray(prop: Property): string {
    return `\t${prop.name}: [${pascalCase(prop.type)}]${
      prop.isRequired ? '!' : ''
    }\n`;
  }

  protected genLinkedDefArray(prop: Property): string {
    return `\t${prop.name}: [${pascalCase(prop.type)}]${
      prop.isRequired ? '!' : ''
    }\n`;
  }

  protected genLinkedDef(prop: Property): string {
    return `\t${prop.name}: ${pascalCase(prop.type)}${
      prop.isRequired ? '!' : ''
    }\n`;
  }
}
