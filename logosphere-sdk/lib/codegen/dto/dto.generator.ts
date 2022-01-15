import { pascalCase } from 'pascal-case';
import { Generator } from '../abstract';
import { Definition, Property } from '../canonical.schema';
export class DtoGenerator extends Generator {
  protected generateEnum(def: Definition) {

    let schemaString = `export type ${pascalCase(def.name)} = `;

    schemaString += def.props.map((prop: Property) => {
      return `'${prop.name}'`;
    }).join(' | ');

    schemaString += ';\n';

    return schemaString;
  }

  protected generateEntity(def: Definition) {
    return '';
  }
  protected generateExternalEntity(def: Definition) {
    return '';
  }

}