import { FlureeClient } from '../fluree.client';
import { FlureeObject, FlureeQuery } from '../fluree.schema';
import { select } from './query.builder';
import { query, removeNamespace } from './query.mapper';

const mockResult: FlureeObject = {
  _id: 23423,
  'person/name': 'john',
  'movies/_person': [
    {
      _id: 342,
      'movies/title': 'The best',
    },
  ],
  'person/spouse': {
    _id: 34242,
    name: 'jill',
  },
};

const mappedResult: FlureeObject = {
  _id: 23423,
  name: 'john',
  movies: [
    {
      _id: 342,
      title: 'The best',
    },
  ],
  spouse: {
    _id: 34242,
    name: 'jill',
  },
};

jest.mock('../fluree.client', () => ({
  FlureeClient: class MockClient {
    query(fql: FlureeQuery): Promise<FlureeObject> {
      return new Promise<FlureeObject>((resolve) => {
        resolve(mockResult);
      });
    }
  },
}));

describe('Query Mapper', () => {
  it('should return raw results when no mapper is supplied', async () => {
    const spec = select('*').from('test').build();
    const client = new FlureeClient({ url: 'test', ledger: 'test/test' });
    const result = await query(client, spec);

    expect(result).toEqual(mockResult);
  });

  it('should return mapped results', async () => {
    const spec = select('*').from('test').build();
    const client = new FlureeClient({ url: 'test', ledger: 'test/test' });
    const result = await query(client, spec, removeNamespace);

    expect(result).toEqual(mappedResult);
  });
});
