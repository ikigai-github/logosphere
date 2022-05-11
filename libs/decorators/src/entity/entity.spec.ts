import 'reflect-metadata';
import { MetadataKeys } from '../metadata';
import { Prop } from '../prop';
import { Entity } from './entity';
import { EntityMetadata } from './entity.metadata';
import { StorageLayer } from './entity.types';

describe('The Entity decorator', () => {
  it('should have default metadata', () => {
    @Entity()
    class SampleEntity {
      @Prop()
      aProp: string;
    }

    const entity: EntityMetadata = Reflect.getMetadata(
      MetadataKeys.EntityCache,
      SampleEntity
    );

    expect(entity.name).toBe('sampleEntity');
    expect(entity.layer).toBe(
      StorageLayer.HotLayer | StorageLayer.KnowledgeGraph
    );
    expect(entity.root).toBe(SampleEntity);
    expect(entity.version).toBe(1);
  });
});
