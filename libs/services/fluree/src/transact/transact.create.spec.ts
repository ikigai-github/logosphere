import { create } from './transact.create';
import { child, link } from './transact.link';

describe('Create transaction builder', () => {
  it('should build basic add FlureeQL', () => {
    const tx = create('person')
      .data({
        name: 'Jack',
      })
      .data({
        name: 'Jill',
      })
      .build();

    for (let i = 0; i < tx.length; ++i) {
      expect(tx[i]._action).toBe('add');
      expect(typeof tx[i]._id).toBe('string');
      expect((tx[i]._id as string).startsWith('person')).toBe(true);
    }

    expect((tx[0] as any).name).toBe('Jack');
    expect((tx[1] as any).name).toBe('Jill');
  });

  it('should support reference objects', () => {
    const tx = create('person')
      .data({
        name: 'Jack',
        friend: link('person').data({
          name: 'Jill',
        }),
        doctor: link('person/name', 'Dr. Docta'),
      })
      .build();

    const tx0 = tx[0] as any;
    expect(tx0.name).toBe('Jack');
    expect(tx0._id).toBeDefined();
    expect(tx0.friend.name).toBe('Jill');
    expect(tx0.friend._id).toBeDefined();
    expect(tx0.doctor).toEqual(['person/name', 'Dr. Docta']);
  });

  it('should build nested objects', () => {
    const tx = create('movie')
      .data({
        title: 'The Movie',
        director: child('person', { name: 'Bilby' }),
      })
      .build();

    const tx0 = tx[0] as any;
    expect(tx0.title).toBe('The Movie');
    expect(tx0.director.name).toBe('Bilby');
    expect(tx0.director._id).toBeDefined();
  });

  it('should accept arrays of elements', () => {
    const tx = create('movie')
      .data([
        { title: 'The First Movie' },
        { title: 'The Second Movie' },
        { title: "The Third and Final Movie... until it's remade" },
      ])
      .build();

    expect((tx[0] as any).title).toBe('The First Movie');
    expect(tx[0]._id).toBeDefined();
    expect((tx[1] as any).title).toBe('The Second Movie');
    expect(tx[1]._id).toBeDefined();
    expect((tx[2] as any).title).toBe(
      "The Third and Final Movie... until it's remade"
    );
    expect(tx[2]._id).toBeDefined();
  });
});
