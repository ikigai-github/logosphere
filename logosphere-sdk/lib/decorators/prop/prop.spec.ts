import 'reflect-metadata';
import { MetadataKeys } from '../metadata';
import { Prop } from '../prop';
import { Entity } from '../entity';
import { resolveType } from '../utils';
import { PropMetadataMap } from './prop.metadata';

function validateTypeInfo<T>(
  props: PropMetadataMap,
  name: string,
  type: T,
  depth = 0
) {
  const typeFn = props.get(name).type;
  const typeInfo = resolveType(typeFn);
  expect(typeInfo.type).toBe(type);
  expect(typeInfo.depth).toBe(depth);
}

describe('The Prop decorator', () => {
  it('should capture boxed primitive types', () => {
    @Entity()
    class PrimitiveTypeTest {
      @Prop()
      aString: string;

      @Prop()
      aNumber: number;

      @Prop()
      aBoolean: boolean;
    }

    const props: PropMetadataMap = Reflect.getMetadata(
      MetadataKeys.PropCache,
      PrimitiveTypeTest.prototype
    );

    validateTypeInfo(props, 'aString', String);
    validateTypeInfo(props, 'aNumber', Number);
    validateTypeInfo(props, 'aBoolean', Boolean);
  });

  it('should use defined functions for getting array types', () => {
    @Entity()
    class ArrayTypeTest {
      @Prop({ type: () => [String] })
      aString: string[];

      @Prop({ type: () => [[Number]] })
      aNumber: number[][];

      @Prop({ type: () => [Boolean] })
      aBoolean: boolean;
    }

    const props: PropMetadataMap = Reflect.getMetadata(
      MetadataKeys.PropCache,
      ArrayTypeTest.prototype
    );

    validateTypeInfo(props, 'aString', String, 1);
    validateTypeInfo(props, 'aNumber', Number, 2);
    validateTypeInfo(props, 'aBoolean', Boolean, 1);
  });

  it('should provide default values for required metadata', () => {
    @Entity()
    class DefaultTypeTest {
      @Prop()
      aString: string;
    }

    const props: PropMetadataMap = Reflect.getMetadata(
      MetadataKeys.PropCache,
      DefaultTypeTest.prototype
    );

    const metadata = props.get('aString');

    expect(metadata.index).toBe(false);
    expect(metadata.unique).toBe(false);
    expect(metadata.name).toBe('aString');
    expect(metadata.required).toBe(true);
  });
});
