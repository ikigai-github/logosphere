import { Entity } from './entity';
import { Result } from './result';

interface TestProps {
  name: string;
  description: string;
}

class TestEntity extends Entity<TestProps> {}

const testProps: TestProps = {
  name: 'test',
  description: 'this is test',
};

const testEntity = new TestEntity(testProps);

describe('Result', () => {
  it('should create new OK result', () => {
    const ok = Result.ok<TestEntity>(testEntity);
    expect(ok.isSuccess).toBeTruthy();
    expect(ok.isFailure).toBeFalsy();
    expect(ok.getValue().equals(testEntity)).toBeTruthy();
  });

  it('should create new Fail result with an error message', () => {
    const fail = Result.fail<TestEntity>('failed');
    expect(fail.isSuccess).toBeFalsy();
    expect(fail.isFailure).toBeTruthy();
    expect(fail.errorValue()).toBe('failed');
  });

  it('should create new Fail result with an entity', () => {
    const fail = Result.fail<TestEntity>(testEntity);
    expect(fail.isSuccess).toBeFalsy();
    expect(fail.isFailure).toBeTruthy();
    expect(fail.errorValue().equals(testEntity)).toBeTruthy();
  });
});
