import { ref, select } from './query.builder';
import { compile } from './query.compiler';

describe('Query Compiler', () => {
  it('should convert a basic query context into FlureeQL', () => {
    const context = select('*').from('test').build();

    const fql = compile(context);

    expect(fql).toEqual({
      select: ['*'],
      from: 'test',
    });
  });

  it('should convert a nested query into valid FlureeQL', () => {
    const movie = ref('movie', ['title'], { _limit: 10 });
    const character = ref('character', ['name', movie]);
    const context = select('name', character).from('person').build();

    const fql = compile(context);

    expect(fql).toEqual({
      select: [
        'name',
        { character: ['name', { movie: ['title', { _limit: 10 }] }] },
      ],
      from: 'person',
    });
  });

  it('should support options', () => {
    const context = select('*')
      .from('test')
      .limit(10)
      .offset(10)
      .orderBy(['ASC', 'name'])
      .build();

    const fql = compile(context);

    expect(fql).toEqual({
      select: ['*'],
      from: 'test',
      opts: {
        limit: 10,
        offset: 10,
        orderBy: ['ASC', 'name'],
      },
    });
  });

  it('combine where clauses', () => {
    const context = select('*')
      .where('person/job == "judge"')
      .and('person/firstName == "Judy"')
      .build();

    const fql = compile(context);

    expect(fql).toEqual({
      select: ['*'],
      where: 'person/job == "judge" AND person/firstName == "Judy"',
    });
  });

  it('combine or clauses', () => {
    const context = select('*')
      .where('person/job == "judge"')
      .or('person/job == "clerk"')
      .build();

    const fql = compile(context);

    expect(fql).toEqual({
      select: ['*'],
      where: 'person/job == "judge" OR person/job == "clerk"',
    });
  });
});
