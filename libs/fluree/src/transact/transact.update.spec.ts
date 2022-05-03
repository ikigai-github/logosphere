import { update } from './transact.update';

describe('Update transaction builder', () => {
  it('should build basic update FlureeQL', () => {
    const tx = update('city')
      .data({
        _id: 3424,
        population: 100,
      })
      .build();

    expect(tx).toEqual([{ _action: 'update', _id: 3424, population: 100 }]);
  });

  it('should accept id-object tuples', () => {
    const tx = update('person/handle')
      .data([
        ['test01', { name: 'Test 01' }],
        ['test02', { name: 'Test 02' }],
      ])
      .build();

    expect(tx).toEqual([
      { _action: 'update', _id: ['person/handle', 'test01'], name: 'Test 01' },
      { _action: 'update', _id: ['person/handle', 'test02'], name: 'Test 02' },
    ]);
  });

  it('should accept subject id tuples', () => {
    const tx = update()
      .data([
        [34242, { name: 'Test 01' }],
        [24242, { name: 'Test 02' }],
      ])
      .build();

    expect(tx).toEqual([
      { _action: 'update', _id: 34242, name: 'Test 01' },
      { _action: 'update', _id: 24242, name: 'Test 02' },
    ]);
  });
});
