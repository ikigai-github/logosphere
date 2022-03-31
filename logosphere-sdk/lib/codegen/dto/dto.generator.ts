import { pascalCase } from 'pascal-case';
import { Generator } from '../abstract';
import {
  Definition,
  Property,
  CanonicalSchema,
  DefinitionType,
} from '../canonical.schema';
import { DtoPropGenerator } from './dto.prop-generator';
import { DtoSchema } from './dto.schema';
export class DtoGenerator extends Generator {
  protected generateEnum(def: Definition) {
    let schemaString = `export type ${pascalCase(def.name)} = `;

    schemaString += def.props
      .map((prop: Property) => {
        return `'${prop.name}'`;
      })
      .join(' | ');

    schemaString += ';\n';

    return schemaString;
  }

  protected generateEntity(def: Definition) {
    const propGenerator = new DtoPropGenerator();

    let schemaString = `export class  ${pascalCase(def.name)} {\n`;
    schemaString += `\t_id: number | string;\n`;
    def.props.forEach((prop: Property) => {
      schemaString += propGenerator.generate(prop);
    });
    schemaString += `}\n`;

    return schemaString;
  }
  protected generateExternalEntity(def: Definition) {
    return this.generateEntity(def);
  }

  protected generateImports(def: Definition): string {
    let schemaString = '';
    def.props.forEach((prop: Property) => {
      if (
        prop.defType === DefinitionType.Entity ||
        prop.defType === DefinitionType.EntityArray ||
        prop.defType === DefinitionType.Enum ||
        prop.defType === DefinitionType.EnumArray
      ) {
        schemaString += `import { ${pascalCase(prop.type)} } from './${
          prop.type
        }.dto';\n`;
      }
    });

    return schemaString;
  }

  generate(schema: CanonicalSchema): DtoSchema[] {
    const dtoSchema: DtoSchema[] = [];

    schema.definitions.forEach((def: Definition) => {
      const imports = this.generateImports(def);

      switch (def.type) {
        case DefinitionType.Enum:
          dtoSchema.push({
            name: def.name,
            schema: imports + this.generateEnum(def),
          });
          break;
        case DefinitionType.Entity:
          dtoSchema.push({
            name: def.name,
            schema: imports + this.generateEntity(def),
          });
          break;
        default:
          break;
      }
    });

    return dtoSchema;
  }
}
