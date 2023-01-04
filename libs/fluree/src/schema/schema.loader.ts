import { FlureeClient } from '../fluree.client';
import { compile, select, flattenNames } from '../query';

import { system as sc } from '../fluree.constants';
import { FlureeSchema } from './schema.interfaces';

export async function schemaLoader(ledger: string): Promise<FlureeSchema> {
  const fluree = new FlureeClient({
    url: process.env.FLUREE_URL || 'http://localhost:8090',
    ledger: process.env.FLUREE_LEDGER || ledger,
  });

  const collectionSpec = compile(select().from(sc.COLLECTION).build());
  const collections = await fluree.query(collectionSpec);
  const colNameKey = `${sc.COLLECTION}/${sc.NAME}`;

  const predicateSpec = compile(select().from(sc.PREDICATE).build());
  const predicates = await fluree.query(predicateSpec);
  const predNameKey = `${sc.PREDICATE}/${sc.NAME}`;

  const tagSpec = compile(select().from(sc.TAG).build());
  const tags = await fluree.query(tagSpec);
  const tagNameKey = `${sc.TAG}/${sc.ID}`;

  const schema: FlureeSchema = {
    collections: [
      ...collections
        //filter out system collections, starting with _
        //.filter((collection) => collection[colNameKey][0] !== '_')
        .map((collection) => {
          return {
            ...flattenNames(collection),
            predicates: predicates
              .filter(
                (predicate) =>
                  predicate[predNameKey].split('/')[0] ===
                  collection[colNameKey]
              )
              .map((predicate) => {
                return {
                  ...flattenNames(predicate),
                  name: predicate[predNameKey].split('/')[1],
                  tags: tags
                    .filter(
                      (tag) =>
                        tag[tagNameKey].split(':')[0] === predicate[predNameKey]
                    )
                    .map((tag) => {
                      return {
                        ...flattenNames(tag),
                        id: tag[tagNameKey].split(':')[1],
                      };
                    }),
                };
              }),
          };
        }),
    ],
  };

  return schema;
}
