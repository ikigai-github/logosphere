import {
  update,
  processUpdateTransactSpec,
  reconcileArrays,
} from './transact.update';

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

  it('should flatten update raw transact spec', () => {
    const raw = [
      {
        _action: 'update',
        _id: 369435906932737,
        'album/identifier':
          '4961525adc47d0115a77f110d2955161ee26deb6c8cf325e007fbf45328e63ef',
        'album/createdAt': 1659328279918,
        'album/updatedAt': 1659328279918,
        'album/name': 'Fearless Updated Again',
        'album/genre': 'Pop',
        'album/artist': {
          _id: 351843720888321,
          'artist/identifier':
            'be42179bae9c2499741ab1a9d05cc1d26b88495efcf17769b4ce43569652a3e1',
          'artist/createdAt': 1659328279918,
          'artist/updatedAt': 1659328279918,
          'artist/name': 'Taylor Swift Updated',
          'artist/about': 'About Taylor Swift',
          'artist/user': {
            _id: 351843722888321,
            name: 'Taylor',
          },
        },
        'album/tracks': [
          {
            _id: 351843720888323,
            name: 'Shake it off',
          },
          {
            _id: 351843720888324,
            name: 'New song',
          },
        ],
        'album/covers': ['cover1.jpeg', 'cover2.jpeg'],
      },
    ];

    const flat = processUpdateTransactSpec(raw);

    expect(flat).toStrictEqual([
      {
        _id: 351843722888321,
        name: 'Taylor',
      },
      {
        _id: 351843720888321,
        'artist/identifier':
          'be42179bae9c2499741ab1a9d05cc1d26b88495efcf17769b4ce43569652a3e1',
        'artist/createdAt': 1659328279918,
        'artist/updatedAt': 1659328279918,
        'artist/name': 'Taylor Swift Updated',
        'artist/about': 'About Taylor Swift',
      },
      {
        _id: 351843720888323,
        name: 'Shake it off',
      },
      {
        _id: 351843720888324,
        name: 'New song',
      },
      {
        _action: 'update',
        _id: 369435906932737,
        'album/identifier':
          '4961525adc47d0115a77f110d2955161ee26deb6c8cf325e007fbf45328e63ef',
        'album/createdAt': 1659328279918,
        'album/updatedAt': 1659328279918,
        'album/name': 'Fearless Updated Again',
        'album/genre': 'Pop',
        'album/covers': ['cover1.jpeg', 'cover2.jpeg'],
      },
    ]);
  });

  it('should reconcile arrays', () => {
    const existingSpec = [
      {
        _action: 'update',
        _id: 369435906932737,
        'album/identifier':
          '4961525adc47d0115a77f110d2955161ee26deb6c8cf325e007fbf45328e63ef',
        'album/createdAt': 1659328279918,
        'album/updatedAt': 1659328279918,
        'album/name': 'Fearless Updated Again',
        'album/genre': 'Pop',
        'album/covers': ['1.jpeg', '2.jpeg'],
      },
    ];

    const updateSpec = [
      {
        _action: 'update',
        _id: 369435906932737,
        'album/identifier':
          '4961525adc47d0115a77f110d2955161ee26deb6c8cf325e007fbf45328e63ef',
        'album/createdAt': 1659328279918,
        'album/updatedAt': 1659328279918,
        'album/name': 'Fearless Updated Again',
        'album/genre': 'Pop',
        'album/covers': ['2.jpeg', '3.jpeg'],
      },
    ];

    const reconciledSpec = reconcileArrays(updateSpec, existingSpec);

    expect(reconciledSpec).toStrictEqual([
      {
        _action: 'update',
        _id: 369435906932737,
        'album/identifier':
          '4961525adc47d0115a77f110d2955161ee26deb6c8cf325e007fbf45328e63ef',
        'album/createdAt': 1659328279918,
        'album/updatedAt': 1659328279918,
        'album/name': 'Fearless Updated Again',
        'album/genre': 'Pop',
        'album/covers': ['2.jpeg', '3.jpeg'],
      },
      {
        _id: 369435906932737,
        _action: 'delete',
        'album/covers': ['1.jpeg'],
      },
    ]);
  });
});
