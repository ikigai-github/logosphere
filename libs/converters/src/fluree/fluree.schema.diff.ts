import { cloneDeep } from 'lodash';
import {
  FlureeCollection,
  FlureeSchema,
  FlureePredicate,
  FlureeTag,
} from './fluree.schema';

export function flureeSchemaDiff(
  currentSchema: FlureeSchema,
  updatedSchema: FlureeSchema
): FlureeSchema {
  const diffSchema = cloneDeep(updatedSchema);

  diffSchema.collections.forEach((updCol: FlureeCollection) => {
    const existingCollection = currentSchema.collections.find(
      (exCol: FlureeCollection) => exCol.name === updCol.name
    );
    if (existingCollection) {
      updCol._id = existingCollection._id;
      updCol.predicates.forEach((updPred: FlureePredicate) => {
        const existingPredicate = existingCollection.predicates.find(
          (exPred: FlureePredicate) => exPred.name === updPred.name
        );
        if (existingPredicate) {
          updPred._id = existingPredicate._id;
          if (updPred.unique && !existingPredicate.unique) {
            // TODO: handle all the cases of non-updateable predicate properties
            // https://ikigai-technologies.atlassian.net/browse/LOG-193
            console.log(
              `Can not make existing non-unique predicate unique for ${updCol.name}/${updPred.name} `
            );
            updPred.unique = false;
          }
          if (updPred.tags && existingPredicate.tags) {
            updPred.tags.forEach((updTag: FlureeTag) => {
              const existingTag = existingPredicate.tags.find(
                (exTag: FlureeTag) => exTag.id === updTag.id
              );
              if (existingTag) {
                updTag._id = existingTag._id;
              }
            });
          }
        }
      });
    }
  });

  return diffSchema;
}
