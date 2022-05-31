/* eslint-disable @typescript-eslint/no-unused-vars */
import 'reflect-metadata';
import { DefinitionType } from './common';
import { Entity } from './entity';
import { registerEnum } from './enum/enum';
import { getMetadataStorage, MetadataKeys } from './metadata';
import { Prop, PropMetadataMap, resolvePropType } from './prop';

describe('The Metadata store', () => {
  it('should support storing enum types', () => {
    enum TestEnum {
      FIRST = 0,
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
    expect(enumTypeInfo.items).toBeDefined();
    const keys = enumTypeInfo.items.map((item) => item[0]);
    expect(keys).toContain('FIRST');
    expect(keys).toContain('SECOND');

    const enumArrayMeta = props.get('aEnumArray');
    const enumArrayTypeInfo = resolvePropType(enumArrayMeta);
    expect(enumArrayTypeInfo.defType).toBe(DefinitionType.EnumArray);
    expect(enumArrayTypeInfo.typename).toBe('TestEnum');
  });

  it('should not add duplicate metadata entries for the same declaration', () => {
    const createDeclaration = () => {
      enum SingleEnum {
        FIRST = 0,
        SECOND = 'SECOND',
      }

      registerEnum(SingleEnum, 'SingleEnum');

      @Entity('SingleEntity')
      class SingleEntity {
        git;
        @Prop()
        aString: string;

        @Prop({ type: () => SingleEnum })
        aEnum: SingleEnum;
      }
    };

    // Invoke twice to cause class declaration to be evaluated twice
    createDeclaration();
    createDeclaration();

    const schema = getMetadataStorage().buildSchema();

    const entities = schema.definitions.filter(
      (definition) => definition.name === 'SingleEntity'
    );

    expect(entities.length).toBe(1);

    const enums = schema.definitions.filter(
      (definition) => definition.name === 'SingleEnum'
    );

    expect(enums.length).toBe(1);
  });

  it('should default the name of a reference entity to the name of the entity', () => {
    @Entity('match_this')
    class ExampleMatchEntity {
      @Prop()
      aString: string;
    }

    @Entity('has_match')
    class EntityWithMatch {
      @Prop()
      aMatch: ExampleMatchEntity;
    }

    const schema = getMetadataStorage().buildSchema();

    const match = schema.definitions.find(
      (definition) => definition.name === 'has_match'
    );

    expect(match).toBeDefined();

    const ref = match.props.find((prop) => prop.name === 'match_this');

    expect(ref).toBeDefined();
  });

  it('should use name of referenced entity as type in canonical schema', () => {
    @Entity({ name: 'my_ref' })
    class TestRefEntity {
      @Prop()
      aString: string;
    }

    @Entity({ name: 'my_root' })
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

  it('should include enums in schema', () => {
    enum Plants {
      Tree = 0,
      Shrub = 'Shrub',
      Grass = 10,
    }

    registerEnum(Plants, 'plants');

    const schema = getMetadataStorage().buildSchema();

    const plants = schema.definitions.find(
      (definition) => definition.name === 'plants'
    );

    expect(plants).toBeDefined();
    expect(plants.name).toBe('plants');
    expect(plants.props).toContainEqual({ name: 'Tree', type: 'string' });
    expect(plants.props).toContainEqual({ name: 'Shrub', type: 'string' });
    expect(plants.props).toContainEqual({ name: 'Grass', type: 'string' });
  });

  it('should correctly identify enums when type function is supplied', () => {
    enum Tree {
      Cedar,
      Oak,
      Pine,
    }

    registerEnum(Tree, 'tree');

    @Entity('soil')
    class Soil {
      @Prop({ type: () => Tree })
      aTree: Tree;
    }

    const schema = getMetadataStorage().buildSchema();

    const soil = schema.definitions.find(
      (definition) => definition.name === 'soil'
    );

    expect(soil).toBeDefined();
    expect(soil.props).toBeDefined();

    const tree = soil.props[0];
    expect(tree.defType).toBe('Enum');
    expect(tree.name).toBe('aTree');
    expect(tree.type).toBe('tree');
  });
});
