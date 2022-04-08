import 'reflect-metadata';
import { DefinitionType } from '../codegen';
import { Entity } from './entity';
import { registerEnum } from './enum/enum';
import { MetadataKeys } from './metadata';
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
});
