import { ValueObject } from './value-object';

interface TestProps {
  name: string;
  description: string;
}

class TestVO extends ValueObject<TestProps> {}

const testProps: TestProps = {
  name: 'test',
  description: 'this is test',
};

describe('Value Object', () => {
  it('should create new value object', () => {
    const testVO = new TestVO(testProps);
    expect(testVO).toBeDefined();
    expect(testVO.props).toEqual(testProps);
  });

  it('two value objects with same props should be equal', () => {
    const testVO1 = new TestVO(testProps);
    const testVO2 = new TestVO(testProps);
    expect(testVO1.equals(testVO2)).toBeTruthy();
  });

  it('two value objects with different props should not be equal', () => {
    const testVO1 = new TestVO(testProps);
    const testVO2 = new TestVO({
      name: 'something else',
      description: 'something else again',
    });
    expect(testVO1.equals(testVO2)).toBeFalsy();
  });
});
