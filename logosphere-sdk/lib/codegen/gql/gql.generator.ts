import { pascalCase } from 'pascal-case';
import { Definition, Property } from '../canonical';
import { Generator } from '../abstract/generator.abstract';
import { GqlPropGenerator } from './gql.prop-generator';

export class GqlGenerator extends Generator {
  protected generateEnum(def: Definition): string {
    let schemaString = `enum ${pascalCase(def.name)} {\n`;

    def.props.forEach((prop: Property) => {
      schemaString += `  ${prop.name}\n`;
    });

    schemaString += '}\n\n';

    return schemaString;
  }
  protected generateEntity(def: Definition): string {
    const propGenerator = new GqlPropGenerator();
    let schemaString = `type ${pascalCase(def.name)} {\n`;
    def.props.forEach((prop: Property) => {
      if (prop.isEnabled) {
        schemaString += propGenerator.generate(prop);
      }
    });

    schemaString += '}\n\n';

    return schemaString;
  }

  protected generateExternalEntity(def: Definition): string {
    const propGenerator = new GqlPropGenerator();
    let schemaString = `extend type ${pascalCase(
      def.name
    )} @key(fields: \\"identifier\\") {\n`;
    def.props.forEach((prop: Property) => {
      if (prop.isEnabled) {
        schemaString += propGenerator.generate(prop);
      }
    });

    schemaString += '}\n\n';

    return schemaString;
  }
}
