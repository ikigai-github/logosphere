import { DefinitionType, IDefinition, IProperty } from "../canonical.schema";
import { Parser } from "../parser";
import { JsonSchemaPropParser } from "./json-schema.prop-parser";
import { constants as c } from "./json-schema.constants";
import { hasKey } from "../util";

export class JsonSchemaParser extends Parser {
  #isEnum = (schema: any): boolean => {
    return hasKey(schema, c.ENUM, c.OBJECT);
  };

  #isDef = (schema: any): boolean => {
    return hasKey(schema, c.PROPERTIES, c.OBJECT);
  };

  protected getDefs(schema: any): IDefinition[] {
    const defs: IDefinition[] = [];

    // parse enums
    Object.keys(schema)
      .filter((defKey: string) => {
        return this.#isEnum(schema[defKey]);
      })
      .map((defKey: string) => {
        const props: Partial<IProperty>[] = [];
        Object.keys(schema[defKey][c.ENUM]).map((propKey: string) => {
          props.push({
            name: schema[defKey][c.ENUM][propKey],
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
    Object.keys(schema)
      .filter((defKey: string) => {
        return this.#isDef(schema[defKey]);
      })
      .map((defKey: string) => {
        const props: Partial<IProperty>[] = [];
        Object.keys(schema[defKey][c.PROPERTIES]).map((propKey: string) => {
          const propParser = new JsonSchemaPropParser(
            propKey,
            schema[defKey][c.REQUIRED],
            schema
          );
          props.push(propParser.parse(schema[defKey][c.PROPERTIES][propKey]));
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
