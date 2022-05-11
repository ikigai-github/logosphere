import 'reflect-metadata';
import { MetadataKeys } from '../metadata';
import { Prop } from '../prop';
import { Entity, EntityMetadata } from '../entity';
import { resolveType } from '../utils';
import { PropMetadataMap } from './prop.metadata';
import { StringFunc } from '../common';

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
      PrimitiveTypeTest
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
      ArrayTypeTest
    );

    validateTypeInfo(props, 'aString', String, 1);
    validateTypeInfo(props, 'aNumber', Number, 2);
    validateTypeInfo(props, 'aBoolean', Boolean, 1);
  });

  it('should support arrays of entities', () => {
    @Entity()
    class ArrayEntityItem {
      @Prop()
      aString: string;
    }

    enum TestEnumItem {
      thing = 'thing',
      other = 'other',
    }

    @Entity()
    class ArrayWithEntityTest {
      @Prop({ type: () => [ArrayEntityItem] })
      entityItems: ArrayEntityItem[];

      @Prop({ type: () => [TestEnumItem] })
      enumItems: TestEnumItem[];
    }

    const props: PropMetadataMap = Reflect.getMetadata(
      MetadataKeys.PropCache,
      ArrayWithEntityTest
    );

    validateTypeInfo(props, 'entityItems', ArrayEntityItem, 1);
    validateTypeInfo(props, 'enumItems', TestEnumItem, 1);
  });

  it('should provide default values for required metadata', () => {
    @Entity()
    class DefaultTypeTest {
      @Prop()
      aString: string;
    }

    const props: PropMetadataMap = Reflect.getMetadata(
      MetadataKeys.PropCache,
      DefaultTypeTest
    );

    const metadata = props.get('aString');

    expect(metadata.target).toBe(DefaultTypeTest);
    expect((metadata.name as StringFunc)()).toBe('aString');
    expect(metadata.index).toBe(false);
    expect(metadata.enabled).toBe(true);
    expect(metadata.primary).toBe(false);
    expect(metadata.unique).toBe(false);
    expect(metadata.required).toBe(false);
    expect(metadata.readOnly).toBe(false);
    expect(metadata.writeOnly).toBe(false);
  });

  it('should accept customization options', () => {
    class CoolClass {
      aThing: string;
    }

    @Entity()
    class CustomizedTypeTest {
      @Prop({
        type: () => CoolClass,
        index: true,
        enabled: false,
        unique: true,
        primary: true,
        required: true,
        readOnly: true,
        writeOnly: true,
        pattern: 'ab+c',
        minLength: 0,
        maxLength: 1,
        examples: ['a', 'b'],
        externalModule: 'external',
        doc: 'a doc',
        spec: ['a spec'],
        specDoc: 'a specDoc',
      })
      aString: CoolClass;
    }

    const props: PropMetadataMap = Reflect.getMetadata(
      MetadataKeys.PropCache,
      CustomizedTypeTest
    );

    const metadata = props.get('aString');

    expect(metadata.target).toBe(CustomizedTypeTest);
    expect((metadata.name as StringFunc)()).toBe('aString');
    expect(metadata.index).toBe(true);
    expect(metadata.enabled).toBe(false);
    expect(metadata.primary).toBe(true);
    expect(metadata.unique).toBe(true);
    expect(metadata.required).toBe(true);
    expect(metadata.readOnly).toBe(true);
    expect(metadata.writeOnly).toBe(true);
    expect(metadata.pattern).toBe('ab+c');
    expect(metadata.minLength).toBe(0);
    expect(metadata.maxLength).toBe(1);
    expect(metadata.examples).toContain('a');
    expect(metadata.examples).toContain('b');
    expect(metadata.externalModule).toBe('external');
    expect(metadata.doc).toBe('a doc');
    expect(metadata.spec).toContain('a spec');
    expect(metadata.specDoc).toBe('a specDoc');
  });

  it('should support finding reference entities', () => {
    @Entity()
    class AnEntity {
      @Prop()
      aString: string;
    }

    @Entity()
    class AggregateRoot {
      @Prop()
      aEntity: AnEntity;
    }

    const props: PropMetadataMap = Reflect.getMetadata(
      MetadataKeys.PropCache,
      AggregateRoot
    );

    const metadata = props.get('aEntity');
    const childEntity: EntityMetadata = Reflect.getMetadata(
      MetadataKeys.EntityCache,
      metadata.target
    );

    expect(childEntity).toBeDefined();
  });
});
