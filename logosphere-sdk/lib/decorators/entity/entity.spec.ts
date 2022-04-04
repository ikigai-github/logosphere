/* eslint-disable @typescript-eslint/no-unused-vars */
import 'reflect-metadata';
import { MetadataKeys } from '../metadata';
import { Prop } from '../prop';
import { Entity } from './entity';
import { StorageLayer } from './entity.types';

describe('Test Entity Decorator', () => {
  it('should use reflection to get default metadata', () => {
    @Entity({ name: 'sample' })
    class SampleEntity {
      @Prop({ type: () => String })
      label: string;

      @Prop()
      thing: number;

      @Prop({ type: () => Boolean })
      lie: string;
    }

    const props = Reflect.getMetadata(
      MetadataKeys.PropCache,
      SampleEntity.prototype
    );

    expect(props.get('label').type()).toBe(String);
    expect(props.get('thing').type()).toBe(Number);
    expect(props.get('lie').type()).toBe(Boolean);
  });
});
