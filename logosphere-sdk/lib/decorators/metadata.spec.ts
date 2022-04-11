import 'reflect-metadata';
import { DefinitionType } from '../codegen';
import { Entity } from './entity';
import { registerEnum } from './enum/enum';
import { getMetadataStorage, MetadataKeys } from './metadata';
import { Prop, PropMetadataMap, resolvePropType } from './prop';

describe('The Metadata store', () => {
  it('should support storing enum types', () => {
    enum TestEnum {
      FIRST = 'FIRST',
      SECOND = 'SECOND',
    }

    registerEnum(TestEnum, 'TestEnum');

    @Entity()
    class TestEnumEntity {
      @Prop({ type: () => TestEnum })
      aEnum: TestEnum;

      @Prop({ type: () => [TestEnum] })
      aEnumArray: TestEnum[];
    }

    const props: PropMetadataMap = Reflect.getMetadata(
      MetadataKeys.PropCache,
      TestEnumEntity
    );

    const enumMeta = props.get('aEnum');
    const enumTypeInfo = resolvePropType(enumMeta);
    expect(enumTypeInfo.defType).toBe(DefinitionType.Enum);
    expect(enumTypeInfo.typename).toBe('TestEnum');

    const enumArrayMeta = props.get('aEnumArray');
    const enumArrayTypeInfo = resolvePropType(enumArrayMeta);
    expect(enumArrayTypeInfo.defType).toBe(DefinitionType.EnumArray);
    expect(enumArrayTypeInfo.typename).toBe('TestEnum');
  });

  it('should use name of referenced entity as type in canonical schema', () => {
    @Entity({ name: 'my_ref' })
    class TestRefEntity {
      @Prop()
      aString: string;
    }

    @Entity({ name: 'my_root' })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class TestRootEntity {
      @Prop({ name: 'a_ref' })
      aRefEntity: TestRefEntity;
    }

    const schema = getMetadataStorage().buildSchema();

    const root = schema.definitions.find(
      (definition) => definition.name === 'my_root'
    );

    expect(root).toBeDefined();

    const ref = root.props.find((prop) => prop.name === 'a_ref');

    expect(ref).toBeDefined();
    expect(ref.type).toBe('my_ref');
  });
});
