import { GqlPropGenerator } from './gql.prop-generator';
import { DefinitionType, Property } from '../canonical.schema';

describe('GQL prop generator', () => {
  const propGen = new GqlPropGenerator();

  it('should generate enum', () => {
    const prop: Partial<Property> = {
      name: 'name',
      type: 'type',
      isRequired: true,
      defType: DefinitionType.Enum,
    };

    const output = propGen.generate(prop);
    expect(output).toBe('\tname: Type!\n');
  });

  it('should generate type', () => {
    const prop: Partial<Property> = {
      name: 'name',
      type: 'type',
      isRequired: true,
      defType: DefinitionType.Entity,
    };

    const output = propGen.generate(prop);
    expect(output).toBe('\tname: Type!\n');
  });

  it('should generate float scalar', () => {
    const prop: Partial<Property> = {
      name: 'name',
      type: 'number',
      defType: DefinitionType.Scalar,
    };

    const output = propGen.generate(prop);
    expect(output).toBe('\tname: Float\n');
  });

  it('should generate int scalar', () => {
    const prop: Partial<Property> = {
      name: 'name',
      type: 'integer',
      defType: DefinitionType.Scalar,
    };

    const output = propGen.generate(prop);
    expect(output).toBe('\tname: Int\n');
  });

  it('should generate scalar array', () => {
    const prop: Partial<Property> = {
      name: 'name',
      type: 'string',
      defType: DefinitionType.ScalarArray,
    };

    const output = propGen.generate(prop);
    expect(output).toBe('\tname: [String]\n');
  });

  it('should generate type array', () => {
    const prop: Partial<Property> = {
      name: 'name',
      type: 'type',
      defType: DefinitionType.EntityArray,
    };

    const output = propGen.generate(prop);
    expect(output).toBe('\tname: [Type]\n');
  });

  it('should generate enum array', () => {
    const prop: Partial<Property> = {
      name: 'name',
      type: 'enumType',
      defType: DefinitionType.EnumArray,
    };

    const output = propGen.generate(prop);
    expect(output).toBe('\tname: [EnumType]\n');
  });
});
