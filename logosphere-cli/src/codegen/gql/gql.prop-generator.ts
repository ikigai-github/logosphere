import { pascalCase } from 'pascal-case';
import { IProperty } from '../canonical.schema';
import { PropGenerator } from '../prop-generator';

export class GqlPropGenerator extends PropGenerator {
  private _typeMap = {
    number: 'float',
    integer: 'int',
  };

  #typeMap(key: string): string {
    return this._typeMap[key] ? this._typeMap[key] : key;
  }

  protected genScalar(prop: IProperty): string {
    return `\t${prop.name}: ${pascalCase(this.#typeMap(prop.type))}${
      prop.isRequired ? '!' : ''
    }\n`;
  }
  protected genDefinition(prop: IProperty): string {
    return `\t${prop.name}: ${pascalCase(prop.type)}${
      prop.isRequired ? '!' : ''
    }\n`;
  }
  protected genEnum(prop: IProperty): string {
    return `\t${prop.name}: ${pascalCase(prop.type)}${
      prop.isRequired ? '!' : ''
    }\n`;
  }
  protected genDefArray(prop: IProperty): string {
    return `\t${prop.name}: [${pascalCase(prop.type)}]${
      prop.isRequired ? '!' : ''
    }\n`;
  }
  protected genScalarArray(prop: IProperty): string {
    return `\t${prop.name}: [${pascalCase(this.#typeMap(prop.type))}]${
      prop.isRequired ? '!' : ''
    }\n`;
  }

  protected genEnumArray(prop: IProperty): string {
    return `\t${prop.name}: [${pascalCase(prop.type)}]${
      prop.isRequired ? '!' : ''
    }\n`;
  }

  protected genLinkedDefArray(prop: IProperty): string {
    return `\t${prop.name}: [${pascalCase(prop.type)}]${
      prop.isRequired ? '!' : ''
    }\n`;
  }

  protected genLinkedDef(prop: IProperty): string {
    return `\t${prop.name}: ${pascalCase(prop.type)}${
      prop.isRequired ? '!' : ''
    }\n`;
  }
}
