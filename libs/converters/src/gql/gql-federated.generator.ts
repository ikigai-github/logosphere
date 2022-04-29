import { GqlGenerator } from './gql.generator';
import {
  CanonicalSchema,
  Definition,
  DefinitionType,
  Property,
} from '../canonical';

import { GqlFederatedSchema } from './gql-federated.schema';

export class GqlFederatedGenerator extends GqlGenerator {
  generate(schema: CanonicalSchema): GqlFederatedSchema[] {
    const defs = schema.definitions.map((def: Definition) => {
      return {
        props: def.props.filter(
          (prop: Property) =>
            prop.defType !== DefinitionType.ExternalEntity &&
            prop.defType !== DefinitionType.ExternalEntityArray
        ),
        ...def,
      };
    });

    // group external definitions by module & type
    const externalDefs = schema.definitions.reduce<any>(
      (acc: any, def: Definition) => {
        return def.props
          .filter(
            (prop: Property) =>
              prop.defType === DefinitionType.ExternalEntity ||
              prop.defType === DefinitionType.ExternalEntityArray
          )
          .reduce<any>((accum: any, prop: Property) => {
            if (!(prop.externalModule in accum)) {
              accum[prop.externalModule] = {};
            }
            if (!(def.name in accum[prop.externalModule])) {
              accum[prop.externalModule][def.name] = {};
            }
            accum[prop.externalModule][def.name][prop.name] = prop;
            return accum;
          }, acc);
      },
      {}
    );

    //add to existing defs
    Object.keys(externalDefs).map((module: string) => {
      Object.keys(externalDefs[module]).map((defName: string) => {
        const props: Property[] = [];
        Object.keys(externalDefs[module][defName]).map((propName: string) => {
          props.push(externalDefs[module][defName][propName]);
        });
        defs.push({
          name: defName,
          type: DefinitionType.ExternalEntity,
          props,
          module,
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

    // generate subgraph schemas
    const gqlFederated: GqlFederatedSchema[] = [];
    Object.keys(moduleDefs).map((module: string) => {
      const sch: CanonicalSchema = {
        definitions: moduleDefs[module] as Definition[],
      };
      const gql = super.generate(sch);
      gqlFederated.push({
        module,
        schema: gql,
      });
    });

    return gqlFederated;
  }
}
/*
const canonical: CanonicalSchema = this.parser.parse(modules);
    
    // transform definitions subset to only have non-external props
    const defs = canonical.definitions.map((def: Definition) => {
      return {
        props: def.props.filter(
          (prop: Property) => prop.defType !== DefinitionType.ExternalEntity && 
                              prop.defType !== DefinitionType.ExternalEntityArray
          ),
        ...def
      }
    });
    
    // group external definitions by module & type
    const externalDefs = canonical.definitions
      .reduce<any>((acc: any, def: Definition) => {
      return def.props
        .filter((prop: Property) => prop.defType === DefinitionType.ExternalEntity || 
                                    prop.defType === DefinitionType.ExternalEntityArray)
        .reduce<any>((accum: any, prop: Property) => {
          if (!(prop.externalModule in accum)) {
            accum[prop.externalModule] = {}
          }
          if (!(def.name in accum[prop.externalModule])) {
            accum[prop.externalModule][def.name] = {}
          }
          accum[prop.externalModule][def.name][prop.name] = prop;
          return accum;
      }, acc)

    }, {});

    //add to existing defs 
    Object.keys(externalDefs).map((module: string) => {
      Object.keys(externalDefs[module]).map((defName: string) => {
        const props: Property[] = [];
        Object.keys(externalDefs[module][defName]).map((propName: string) => {
          props.push(externalDefs[module][defName][propName]);
        })
        defs.push({
          name: defName,
          type: DefinitionType.ExternalEntity,
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


    // generate subgraph schemas
    const gqlFederated = {};
    Object.keys(moduleDefs).map((module: string) => {
      const sch: CanonicalSchema = {
        definitions: moduleDefs[module] as Definition[]
      }
      const gql = this.generator.generate(sch);
      gqlFederated[module] = gql;
    });

    return gqlFederated;
  }
*/
