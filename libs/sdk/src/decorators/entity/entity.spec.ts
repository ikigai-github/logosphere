import 'reflect-metadata';
import { MetadataKeys } from '../metadata';
import { Prop } from '../prop';
import { Ent } from './entity';
import { EntMetadata } from './entity.metadata';
import { StorageLayer } from './entity.types';

describe('The Entity decorator', () => {
  it('should have default metadata', () => {
    @Ent()
    class SampleEntity {
      @Prop()
      aProp: string;
    }

    const entity: EntMetadata = Reflect.getMetadata(
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
