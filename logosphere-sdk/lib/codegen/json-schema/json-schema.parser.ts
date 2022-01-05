import { DefinitionType, IDefinition, IProperty } from '../canonical.schema';
import { Parser } from '../parser.abstract';
import { JsonSchemaPropParser } from './json-schema.prop-parser';
import { constants as c } from './json-schema.constants';
import { hasKey } from '../converters/util';

export class JsonSchemaParser extends Parser {
  #isEnum = (schema: any): boolean => {
    return hasKey(schema, c.ENUM, c.OBJECT);
  };

  #isDef = (schema: any): boolean => {
    return hasKey(schema, c.PROPERTIES, c.OBJECT);
  };

  protected getDefs(schema: any): IDefinition[] {
    const defs: IDefinition[] = [];
    // definitions in JSON schema can be in $defs and in properties
    // properties have the full list, but some of them refer to $defs
    // like this: 
    // "person": {
    //    "$ref": "#/$defs/person",
    //    "isActivated": true
    // },
    // so we need to grab the full definition from $defs in this case
    
    // let's grab everything from properties that is not a reference and bring them to $defs
    const resolved = Object.assign(schema[c.DEFS]);

    Object.keys(schema[c.PROPERTIES])
      .filter((propKey: string) => { return !hasKey(schema[c.PROPERTIES][propKey], c.REF, c.STRING)})
      .forEach((propKey: string) => {
        resolved[propKey] = schema[c.PROPERTIES][propKey]
      }
    );

    // parse enums
    Object.keys(resolved)
      .filter((defKey: string) => {
        return this.#isEnum(resolved[defKey]);
      })
      .forEach((defKey: string) => {
        const props: Partial<IProperty>[] = [];
        Object.keys(resolved[defKey][c.ENUM]).map((propKey: string) => {
          props.push({
            name: resolved[defKey][c.ENUM][propKey],
            type: c.STRING,
          });
        });
        defs.push({
          name: defKey,
          type: DefinitionType.Enum,
          props,
        });
      });

    // parse object definitions
    Object.keys(resolved)
      .filter((defKey: string) => {
        return this.#isDef(resolved[defKey]);
      })
      .forEach((defKey: string) => {
        const props: Partial<IProperty>[] = [];
        Object.keys(resolved[defKey][c.PROPERTIES]).map((propKey: string) => {
          const propParser = new JsonSchemaPropParser(
            propKey,
            resolved[defKey][c.REQUIRED],
            resolved
          );
          props.push(propParser.parse(resolved[defKey][c.PROPERTIES][propKey]));
        });

        defs.push({
          name: defKey,
          type: DefinitionType.Definition,
          props,
        });
      });

    return defs;
  }
}
