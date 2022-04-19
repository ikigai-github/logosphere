import { ref, select } from './query.builder';
import { QueryOptions } from './query.schema';

describe('Query Builder', () => {
  it('should build a basic query', () => {
    const context = select('*')
      .from('test')
      .where('test < 1')
      .and('test > 0')
      .limit(10)
      .offset(0)
      .orderBy(['ASC', 'test'])
      .build();

    expect(context.predicates).toEqual(['*']);
    expect(context.from).toBe('test');
    expect(context.where).toEqual(['test < 1', 'test > 0']);
    expect(context.whereOperator).toBe('AND');
    expect(context.options).toBeDefined();
    expect(context.options.limit).toBe(10);
    expect(context.options.orderBy).toEqual(['ASC', 'test']);
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
    expect(context.options).toBeUndefined();
  });

  it('should allow for or clauses and custom options', () => {
    const options: QueryOptions = { limit: 10, offset: 0, syncTimeout: 1000 };
    const context = select('*')
      .where('a != b')
      .or('b > 1')
      .options(options)
      .build();

    expect(context.options).toEqual(options);
    expect(context.where).toEqual(['a != b', 'b > 1']);
    expect(context.whereOperator).toBe('OR');
  });
});
