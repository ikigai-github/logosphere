import {
  FlureeClient,
  compile,
  select,
  flattenNames,
} from '@logosphere/fluree';
import { constants as fc } from './fluree.constants';
import { FlureeSchema } from './fluree.schema';

export async function flureeSchemaLoader(
  module: string
): Promise<FlureeSchema> {
  const fluree = new FlureeClient({
    url: process.env.FLUREE_URL || 'http://localhost:8090',
    ledger: process.env.FLUREE_LEDGER || `local/${module}`,
  });

  const collectionSpec = compile(select().from(fc.COLLECTION).build());
  const collections = await fluree.query(collectionSpec);
  const colNameKey = `${fc.COLLECTION}/${fc.NAME}`;

  const predicateSpec = compile(select().from(fc.PREDICATE).build());
  const predicates = await fluree.query(predicateSpec);
  const predNameKey = `${fc.PREDICATE}/${fc.NAME}`;

  const tagSpec = compile(select().from(fc.TAG).build());
  const tags = await fluree.query(tagSpec);
  const tagNameKey = `${fc.TAG}/${fc.ID}`;

  const schema: FlureeSchema = {
    collections: [
      ...collections
        //filter out system collections, starting with _
        .filter((collection) => collection[colNameKey][0] !== '_')
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
