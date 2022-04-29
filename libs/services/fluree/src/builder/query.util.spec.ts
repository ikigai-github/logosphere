import { FlureeClient } from '../fluree.client';
import { FlureeObject } from '../fluree.schema';
import { select } from './query.builder';
import { query, removeNamespace } from './query.util';

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

/**
 * Utility function to make mock FlureeClients that return a fixed result from a query
 */
function mockQueryMethod(result: FlureeObject) {
  return () => {
    return {
      query: async () => result,
    };
  };
}

/**
 * Replacing the actual FlureeClient with amock
 */
jest.mock('../fluree.client', () => ({
  FlureeClient: jest.fn(),
}));

/**
 * So typescript knows we replaced it with a mock and we can use mock functions it comes with
 */
const MockFlureeClient = FlureeClient as jest.Mock;

/**
 * Common test setup
 */
const spec = select('*').from('test').build();

describe('Query Mapper', () => {
  it('should return raw results when no mapper is supplied', async () => {
    MockFlureeClient.mockImplementationOnce(mockQueryMethod(mockResult));
    const client = new MockFlureeClient({ url: 'test', ledger: 'test/test' });
    const result = await query(client, spec);
    expect(result).toEqual(mockResult);
  });

  it('should return mapped results', async () => {
    MockFlureeClient.mockImplementationOnce(mockQueryMethod(mockResult));
    const client = new MockFlureeClient({ url: 'test', ledger: 'test/test' });
    const result = await query(client, spec, removeNamespace);
    expect(result).toEqual(mappedResult);
  });

  it('should return array mapped results', async () => {
    MockFlureeClient.mockImplementationOnce(mockQueryMethod([mockResult]));
    const client = new MockFlureeClient({ url: 'test', ledger: 'test/test' });
    const result = await query(client, spec, removeNamespace);
    expect(result).toEqual([mappedResult]);
  });
});
