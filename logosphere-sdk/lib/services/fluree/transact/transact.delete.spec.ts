import { remove } from './transact.delete';

describe('Delete transaction builder', () => {
  it('should accept subject and predice tupls', () => {
    const tx = remove().id(['person/handle', 'user001']).id(13141).build();

    expect(tx).toEqual([
      {
        _id: ['person/handle', 'user001'],
        _action: 'delete',
      },
      {
        _id: 13141,
        _action: 'delete',
      },
    ]);
  });
});
