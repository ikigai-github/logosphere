import { FlureeSchema } from './fluree.schema';
import { flureeSchemaDiff } from './fluree.schema.diff';

describe('Fluree schema diff', () => {
  it('should take diff of new schema from existing schema', () => {
    const currentSchema: FlureeSchema = {
      collections: [
        {
          _id: 12345,
          name: 'existingCollection',
          doc: 'This collection already exists in Fluree',
          predicates: [
            {
              _id: 1,
              name: 'stringPredicate',
              type: 'string',
            },
            {
              _id: 2,
              name: 'enumPredicate',
              type: 'tag',
              restrictTag: true,
              tags: [
                {
                  _id: 1,
                  id: 'One',
                },
                {
                  _id: 2,
                  id: 'Two',
                },
              ],
            },
          ],
        },
      ],
    };

    const updatedSchema: FlureeSchema = {
      collections: [
        {
          _id: '_collection',
          name: 'existingCollection',
          doc: 'This collection already exists in Fluree. We just updated description',
          predicates: [
            {
              _id: '_predicate',
              name: 'stringPredicate',
              type: 'string',
              index: true,
              doc: 'This is existing predicate. We just added index to it',
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
                {
                  _id: '_tag',
                  id: 'Three',
                },
              ],
            },
          ],
        },
        {
          _id: '_collection',
          name: 'newCollection',
          doc: 'This is new collection',
          predicates: [
            {
              _id: '_predicate',
              name: 'stringPredicate',
              type: 'string',
            },
          ],
        },
      ],
    };
    const diffSchema = flureeSchemaDiff(currentSchema, updatedSchema);
    expect(diffSchema).toStrictEqual({
      collections: [
        {
          _id: 12345,
          name: 'existingCollection',
          doc: 'This collection already exists in Fluree. We just updated description',
          predicates: [
            {
              _id: 1,
              name: 'stringPredicate',
              type: 'string',
              index: true,
              doc: 'This is existing predicate. We just added index to it',
            },
            {
              _id: 2,
              name: 'enumPredicate',
              type: 'tag',
              restrictTag: true,
              tags: [
                {
                  _id: 1,
                  id: 'One',
                },
                {
                  _id: 2,
                  id: 'Two',
                },
                {
                  _id: '_tag',
                  id: 'Three',
                },
              ],
            },
          ],
        },
        {
          _id: '_collection',
          name: 'newCollection',
          doc: 'This is new collection',
          predicates: [
            {
              _id: '_predicate',
              name: 'stringPredicate',
              type: 'string',
            },
          ],
        },
      ],
    });
  });
});
