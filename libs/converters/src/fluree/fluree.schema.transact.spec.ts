import { FlureeSchema } from './fluree.schema';
import { flureeSchemaTransact } from './fluree.schema.transact';

describe('Fluree schema diff', () => {
  it('should create FQL transact from Fluree schema', () => {
    const schema: FlureeSchema = {
      collections: [
        {
          _id: '_collection',
          name: 'someCollection',
          doc: 'Some collection in Fluree',
          predicates: [
            {
              _id: '_predicate',
              name: 'stringPredicate',
              type: 'string',
            },
            {
              _id: '_predicate',
              name: 'enumPredicate',
              type: 'tag',
              restrictTag: true,
              tags: [
                {
                  _id: '_tag',
                  id: 'One',
                },
                {
                  _id: '_tag',
                  id: 'Two',
                },
              ],
            },
          ],
        },
      ],
    };
    const transact = flureeSchemaTransact(schema);
    expect(transact).toStrictEqual([
      {
        _id: '_collection',
        name: 'someCollection',
        doc: 'Some collection in Fluree',
      },
      {
        _id: '_predicate',
        name: 'someCollection/stringPredicate',
        type: 'string',
      },
      {
        _id: '_tag',
        id: 'someCollection/enumPredicate:One',
      },
      {
        _id: '_tag',
        id: 'someCollection/enumPredicate:Two',
      },
      {
        _id: '_predicate',
        name: 'someCollection/enumPredicate',
        type: 'tag',
        restrictTag: true,
      },
    ]);
  });
});
