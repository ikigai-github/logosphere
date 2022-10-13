import { strings as s } from '@angular-devkit/core';
import { GqlGenerator } from './gql.generator';
import {
  CanonicalSchema,
  Definition,
  DefinitionType,
  Property,
} from '../canonical';
import { constants as c } from './gql.constants';
import { GqlFederatedSchema } from './gql-federated.schema';

export class GqlFederatedGenerator extends GqlGenerator {
  #generateQueries(schema: CanonicalSchema): string {
    let queryString = 'type Query {\n';
    schema.definitions
      .filter((def: Definition) => def.type === DefinitionType.Entity)
      .map((def: Definition) => {
        queryString += `\t${s.camelize(def.name)}Exists(id: ID): Boolean\n`;
        queryString += `\t${s.camelize(def.name)}FindAll(id: ID): [${s.classify(
          def.name
        )}]\n`;
        queryString += `\t${s.camelize(
          def.name
        )}FindOneById(id: ID): ${s.classify(def.name)}\n`;
        queryString += `\t${s.camelize(
          def.name
        )}FindOneBySubjectId(subjectId: String): ${s.classify(def.name)}\n`;
        queryString += `\t${s.camelize(
          def.name
        )}FindManyById(idList: [ID]): [${s.classify(def.name)}]\n`;
        def.props
          .filter((prop: Property) => prop.isUnique)
          .map((prop: Property) => {
            queryString += `\t${s.camelize(def.name)}FindOneBy${s.classify(
              prop.name
            )}(${s.camelize(prop.name)}: ${s.classify(
              prop.type
            )}): ${s.classify(def.name)}\n`;
          });
        def.props
          .filter((prop: Property) => prop.isIndexed && !prop.isUnique)
          .map((prop: Property) => {
            queryString += `\t${s.camelize(def.name)}FindAllBy${s.classify(
              prop.name
            )}(${s.camelize(prop.name)}: ${s.classify(
              prop.type
            )}): [${s.classify(def.name)}]\n`;
          });
      });
    queryString += '\tgetWalletBalance(walletId: String): Float\n';
    queryString += '\tgetWallet(walletId: String, mnemonic: String): Wallet\n';
    queryString += '\tgenerateKeys(username: String): WalletKeyPair\n';
    queryString +=
      '\tloginUser(username: String, password: String): UserAuth\n';
    queryString += '\tgetLastTxId(username: String): String\n';
    queryString += '\tgetUserWallet(username: String): Wallet\n';
    queryString += '}\n\n';
    return queryString;
  }

  #generateMutations(schema: CanonicalSchema): string {
    let mutationString = 'type Mutation {\n';
    schema.definitions
      .filter((def: Definition) => def.type === DefinitionType.Entity)
      .map((def: Definition) => {
        mutationString += `\t${s.camelize(def.name)}Save(${s.camelize(
          def.name
        )}: ${s.classify(def.name)}Input): ${s.classify(def.name)}\n`;
        mutationString += `\t${s.camelize(def.name)}Delete(id: ID): Boolean\n`;
        if (def.isNft) {
          mutationString += `\t${s.camelize(def.name)}MintNft(${s.camelize(
            def.name
          )}: ${s.classify(def.name)}Input): ${s.classify(def.name)}\n`;
          mutationString += `\t${s.camelize(def.name)}MintNftTx(${s.camelize(
            def.name
          )}: ${s.classify(def.name)}Input): String\n`;
        }
      });
    mutationString +=
      '\tcreateWallet(name: String, passphrase: String): Wallet\n';
    mutationString +=
      '\tcreateWalletFromPubKey(username: String, cardanoPublicKey: String): Wallet\n';
    mutationString +=
      '\tcreateUserAuth(publicKey: String, role: String): UserAuth\n';
    mutationString +=
      '\tcreatePassword(username: String, password: String): String\n';
    mutationString +=
      '\tcreateUser(username: String, password: String, role: String): UserAuth\n';
    mutationString += '\tsubmitTx(txCborHex: String): String\n';
    mutationString += '}\n\n';
    return mutationString;
  }

  generate(schema: CanonicalSchema): GqlFederatedSchema[] {
    // add common entity props
    schema.definitions
      .filter((def: Definition) => def.type !== DefinitionType.Enum)
      .map((def: Definition) => {
        def.props = [
          {
            name: c.ID,
            type: c.STRING,
            isEnabled: true,
            isPK: true,
            defType: DefinitionType.Scalar,
          },
          {
            isEnabled: true,
            name: c.SUBJECT_ID,
            type: c.STRING,
            defType: DefinitionType.Scalar,
          },
          ...def.props,
          {
            isEnabled: true,
            name: c.CREATED_AT,
            type: c.STRING,
            defType: DefinitionType.Scalar,
          },
          {
            isEnabled: true,
            name: c.UPDATED_AT,
            type: c.STRING,
            defType: DefinitionType.Scalar,
          },
        ];
      });

    // filter out all external entities
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
      let gql = super.generate(sch);
      //       gql += `
      // type Wallet {
      //   name: String
      //   passphrase: String
      //   id: String
      //   publicKey: String
      //   privateKey: String
      //   mnemonic: String
      //   address: String
      // }\n`;
      gql += `
type WalletKeyPair {
  privateKey: String
  publicKey: String
}\n`;
      gql += `
type UserAuth {
  username: String
  cardanoPublicKey: String
  authId: String
  token: String
}\n\n`;
      gql += this.#generateQueries(sch);
      gql += this.#generateMutations(sch);

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
