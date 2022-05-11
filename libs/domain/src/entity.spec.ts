import { Entity } from './entity';

interface TestProps {
  name: string;
  description: string;
}

class TestEntity extends Entity<TestProps> {}

const testProps: TestProps = {
  name: 'test',
  description: 'this is test',
};

const identifier =
  '6552ccc4b9025ba2917dcf5aa997d082d3e8d088b4bf00694b8cfb03e176e364';

describe('Entity', () => {
  it('should create new entity', () => {
    const testEntity = new TestEntity(testProps);
    expect(testEntity).toBeDefined();
    expect(testEntity.props).toBe(testProps);
    expect(testEntity.identifier).toBeDefined();
  });

  it('should create entity with existing identifier', () => {
    const testEntity = new TestEntity(testProps, identifier);
    expect(testEntity).toBeDefined();
    expect(testEntity.props).toBe(testProps);
    expect(testEntity.identifier.toString()).toBe(identifier);
  });

  it('entities should be equal when props and identifiers equal', () => {
    const testEntity1 = new TestEntity(testProps, identifier);
    const testEntity2 = new TestEntity(testProps, identifier);
    expect(testEntity1.equals(testEntity2)).toBeTruthy();
  });

  it('entities should not be equal when props are equal, but identifiers not', () => {
    const testEntity1 = new TestEntity(testProps);
    const testEntity2 = new TestEntity(testProps);
    expect(testEntity1.equals(testEntity2)).toBeFalsy();
  });
});
