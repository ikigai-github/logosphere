import { copySubjectId } from './copy-subject-id';

describe('copySubjectId() util', () => {
  it('should assign subject IDs to updated entity / no prefix', () => {
    const existing = {
      id: '123',
      subjectId: '456',
      ref: {
        id: '567',
        subjectId: '789',
      },
      arr: [
        {
          id: '123',
          subjectId: '456',
        },
        {
          id: '456',
          subjectId: '789',
        },
      ],
      scalar: '12345',
      scalarArr: ['12345', '6789'],
    };

    const updated = {
      id: '123',
      ref: {
        id: '567',
      },
      arr: [
        {
          id: '123',
        },
        {
          id: '456',
        },
      ],
      scalar: '1234567',
      scalarArr: ['12345', '678900'],
    };

    const copied = copySubjectId(existing, updated);
    expect(copied.subjectId).toBe('456');
    expect(copied.ref.subjectId).toBe('789');
    expect(JSON.stringify(copied.arr)).toBe(
      JSON.stringify([
        {
          id: '123',
          subjectId: '456',
        },
        {
          id: '456',
          subjectId: '789',
        },
      ])
    );
    expect(copied.scalar).toBe('1234567');
    expect(JSON.stringify(copied.scalarArr)).toBe(
      JSON.stringify(['12345', '678900'])
    );
  });

  it('should issign subject IDs to updated entity / with prefix', () => {
    const existing = {
      _id: '456',
      'a/identifier': '123',
      'a/ref': {
        'ref/identifier': '567',
        _id: '789',
      },
      'a/arrs': [
        {
          _id: '456',
          'arr/identifier': '123',
        },
        {
          _id: '789',
          'arr/identifier': '456',
        },
      ],
      'a/scalar': '12345',
      'a/scalarArr': ['12345', '6789'],
    };

    const updated = {
      'a/identifier': '123',
      'a/ref': {
        'ref/identifier': '567',
      },
      'a/arrs': [
        {
          'arr/identifier': '123',
        },
        {
          'arr/identifier': '456',
        },
      ],
      'a/scalar': '1234567',
      'a/scalarArr': ['12345', '678900'],
    };

    const copied = copySubjectId(existing, updated, 'identifier', '_id');
    expect(copied._id).toBe('456');
    expect(copied['a/ref']._id).toBe('789');
    expect(JSON.stringify(copied['a/arrs'])).toBe(
      JSON.stringify([
        {
          'arr/identifier': '123',
          _id: '456',
        },
        {
          'arr/identifier': '456',
          _id: '789',
        },
      ])
    );
    expect(copied['a/scalar']).toBe('1234567');
    expect(JSON.stringify(copied['a/scalarArr'])).toBe(
      JSON.stringify(['12345', '678900'])
    );
  });
});
