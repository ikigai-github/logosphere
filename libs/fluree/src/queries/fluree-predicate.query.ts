/* eslint-disable no-useless-escape */
//return all predicates of a given collection
export const predicateQuery = (collection: string) => {
  return {
    select: '?name',
    where: [
      ['?_predicate', '_predicate/name', '?name'],
      {
        filter: [`(strStarts ?name \"${collection}/\")`],
      },
    ],
  };
};

//mark collection predicate as deprecated if the property has been deleted from schema
export const deprecatePredicate = (collection: string, predicate: string) => {
  return {
    _id: ['_predicate/name', `${collection}/${predicate}`],
    deprecated: true,
  };
};
