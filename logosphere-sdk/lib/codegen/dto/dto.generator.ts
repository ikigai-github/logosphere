import { pascalCase } from 'pascal-case';
import { Generator } from '../abstract';
import { Definition, Property } from '../canonical.schema';
import { DtoPropGenerator } from './dto.prop-generator';
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

    const propGenerator = new DtoPropGenerator();

    let schemaString =  `export class  ${pascalCase(def.name)} {\n`;
    schemaString += `\t_id: number | string;\n`;
    def.props.forEach((prop: Property) => {
      schemaString += propGenerator.generate(prop);
    });
    schemaString += `}\n`

    return schemaString;
    
  }
  protected generateExternalEntity(def: Definition) {
    return this.generateEntity(def);
  }

}