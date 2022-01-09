import { GqlGenerator } from '../../gql/gql.generator';
import { JsonSchemaFederatedParser } from '../../json-schema';
import { Converter } from '../../converter.abstract';
import { CanonicalSchema } from '../../canonical.schema';
import { Definition, Property, DefinitionType } from '../../../codegen';

export class JsonSchemaToGqlFederatedConverter extends Converter {
  protected getParser(): JsonSchemaFederatedParser {
    return new JsonSchemaFederatedParser();
  }
  protected getGenerator(): GqlGenerator {
    return new GqlGenerator();
  }

  async convert(schema: any): Promise<any> {
    const parser = this.getParser();
    const canonical: CanonicalSchema = await parser.parse(schema);
    
    // transform definitions subset to only have non-linked props
    const defs = canonical.definitions.map((def: Definition) => {
      return {
        props: def.props.filter(
          (prop: Property) => prop.defType !== DefinitionType.LinkedDef && 
                              prop.defType !== DefinitionType.LinkedDefArray
          ),
        ...def
      }
    });
    
    // group linked defs by linked module & type
    const linkedDefs = canonical.definitions
      .reduce<any>((acc: any, def: Definition) => {
      return def.props
        .filter((prop: Property) => prop.defType === DefinitionType.LinkedDef || 
                                    prop.defType === DefinitionType.LinkedDefArray)
        .reduce<any>((accum: any, prop: Property) => {
          if (!(prop.linkedModule in accum)) {
            accum[prop.linkedModule] = {}
          }
          if (!(def.name in accum[prop.linkedModule])) {
            accum[prop.linkedModule][def.name] = {}
          }
          accum[prop.linkedModule][def.name][prop.name] = prop;
          return accum;
      }, acc)

    }, {});

    //add to existing defs 
    Object.keys(linkedDefs).map((module: string) => {
      Object.keys(linkedDefs[module]).map((defName: string) => {
        const props: Property[] = [];
        Object.keys(linkedDefs[module][defName]).map((propName: string) => {
          props.push(linkedDefs[module][defName][propName]);
        })
        defs.push({
          name: defName,
          type: DefinitionType.LinkedDef,
          props,
          module
        });
      });
    });
    
    // group all defs by module
    const moduleDefs = defs.reduce<any>((accum: any, def: Definition) => {
      if (!(def.module in accum)) {
        accum[def.module] = [];
      }
      accum[def.module].push(def);
      return accum;
    }, {});

    const generator = this.getGenerator();

    // generate subgraph schemas
    const gqlFederated = {};
    Object.keys(moduleDefs).map((module: string) => {
      const sch: CanonicalSchema = {
        definitions: moduleDefs[module] as Definition[]
      }
      const gql = generator.generate(sch);
      gqlFederated[module] = gql;
    });

    return gqlFederated;
  }
}