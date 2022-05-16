import { Entity, EntityProps } from './entity';

interface TestProps extends EntityProps {
  name: string;
  description: string;
}

class TestEntity extends Entity<TestProps> {}

const testProps: TestProps = Object.freeze({
  name: 'test',
  description: 'this is test',
});

const id = '6552ccc4b9025ba2917dcf5aa997d082d3e8d088b4bf00694b8cfb03e176e364';

describe('Entity', () => {
  it('should create new entity', () => {
    const testEntity = new TestEntity(testProps);
    expect(testEntity).toBeDefined();
    expect(testEntity.id).toBeDefined();
  });

  it('should create entity with existing identifier', () => {
    const props = {
      ...testProps,
      id,
    };
    const testEntity = new TestEntity(props);
    expect(testEntity).toBeDefined();
    expect(testEntity.id).toBe(id);
  });

  it('entities should be equal when props and identifiers equal', () => {
    const props = {
      ...testProps,
      id,
    };
    const testEntity1 = new TestEntity(props);
    const testEntity2 = new TestEntity(props);
    expect(testEntity1.equals(testEntity2)).toBeTruthy();
  });

  it('entities should not be equal when props are equal, but identifiers not', () => {
    const testEntity1 = new TestEntity(testProps);
    const testEntity2 = new TestEntity(testProps);
    expect(testEntity1.equals(testEntity2)).toBeFalsy();
  });
});
