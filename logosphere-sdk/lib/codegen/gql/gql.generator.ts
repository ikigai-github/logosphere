import { pascalCase } from 'pascal-case';
import { IDefinition, IProperty } from '../canonical.schema';
import { Generator } from '../generator.abstract';
import { GqlPropGenerator } from './gql.prop-generator';

export class GqlGenerator extends Generator {
  protected genEnum(def: IDefinition): string {
    let schemaString = `enum ${pascalCase(def.name)} {\n`;

    def.props.forEach((prop: IProperty) => {
      schemaString += `  ${prop.name}\n`;
    });

    schemaString += '}\n\n';

    return schemaString;
  }
  protected genDef(def: IDefinition): string {
    const propGenerator = new GqlPropGenerator();

    let schemaString = `type ${pascalCase(def.name)} {\n`;
    def.props.forEach((prop: IProperty) => {
      if (prop.isEnabled) {
        schemaString += propGenerator.generate(prop);
      }
    });

    schemaString += '}\n\n';

    return schemaString;
  }
}
