import { dtoRemoveSystemFields } from './dto.remove-system-fields';
describe('Dto remove system fields', () => {
  const data = {
    id: 'some id',
    subjectId: 'some subject id',
    createdAt: 'yesterday',
    updatedAt: 'today',
    something: 'something',
    moreData: {
      id: 'some id',
      subjectId: 'some subject id',
      createdAt: 'yesterday',
      updatedAt: 'today',
      somethingElse: 'something else',
      yetMoreData: {
        id: 'some id',
        subjectId: 'some subject id',
        createdAt: 'yesterday',
        updatedAt: 'today',
        entirelyDifferent: 'entirely different',
      },
    },
  };

  const expected = {
    something: 'something',
    moreData: {
      somethingElse: 'something else',
      yetMoreData: {
        entirelyDifferent: 'entirely different',
      },
    },
  };

  it('should remove system fields from object', () => {
    const newData = dtoRemoveSystemFields(data);
    expect(newData).toStrictEqual(expected);
  });

  it('should remove system fields from array of objects', () => {
    const newData = dtoRemoveSystemFields([data]);
    expect(newData).toStrictEqual([expected]);
  });
});
