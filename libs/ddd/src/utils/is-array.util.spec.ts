import { isScalarArray } from './is-array.util';
describe('Array utils', () => {
  it('should test scalar arrays', () => {
    const objArr = [
      {
        one: 'one',
        two: 'two',
      },
      {
        one: 'one',
        two: 'two',
      },
    ];

    expect(isScalarArray(objArr)).toBeFalsy();

    const scalarArr = ['one', 'two', 'three'];
    expect(isScalarArray(scalarArr)).toBeTruthy();

    const mixedArr = [
      {
        one: 'one',
        two: 'two',
      },
      'one',
    ];

    expect(isScalarArray(mixedArr)).toBeFalsy();
  });
});
