import { FlureeQueryOptions } from '../fluree.schema';
import { ref, select } from './query.builder';

describe('Query Builder', () => {
  it('should build a basic query', () => {
    const spec = select('*')
      .from('test')
      .where('test < 1')
      .and('test > 0')
      .limit(10)
      .offset(0)
      .orderBy(['ASC', 'test'])
      .build();

    expect(spec.predicates).toEqual(['*']);
    expect(spec.from).toBe('test');
    expect(spec.where).toEqual(['test < 1', 'test > 0']);
    expect(spec.whereOperator).toBe('AND');
    expect(spec.opts).toBeDefined();
    expect(spec.opts.limit).toBe(10);
    expect(spec.opts.orderBy).toEqual(['ASC', 'test']);
  });

  it('should allow for reference following', () => {
    const options = { _limit: 10, _offset: 0 };
    const reference = ref('something', ['else'], options);
    const context = select('thing', reference).from('place').build();

    expect(context.predicates).toEqual([
      'thing',
      { field: 'something', predicates: ['else'], options },
    ]);
    expect(context.from).toBe('place');
    expect(context.opts).toBeUndefined();
  });

  it('should allow for or clauses and custom options', () => {
    const options: FlureeQueryOptions = {
      limit: 10,
      offset: 0,
      syncTimeout: 1000,
    };
    const spec = select('*')
      .where('a != b')
      .or('b > 1')
      .options(options)
      .build();

    expect(spec.opts).toEqual(options);
    expect(spec.where).toEqual(['a != b', 'b > 1']);
    expect(spec.whereOperator).toBe('OR');
  });
});
