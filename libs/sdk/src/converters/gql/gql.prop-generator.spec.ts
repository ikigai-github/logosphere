import { GqlPropGenerator } from './gql.prop-generator';
import { DefinitionType, Property } from '../../schema';

describe('GQL prop generator', () => {
  const propGen = new GqlPropGenerator();

  it('should generate enum', () => {
    const prop: Property = {
      name: 'name',
      type: 'type',
      isRequired: true,
      defType: DefinitionType.Enum,
    };

    const output = propGen.generate(prop);
    expect(output).toBe('\tname: Type!\n');
  });

  it('should generate entity', () => {
    const prop: Property = {
      name: 'name',
      type: 'type',
      isRequired: true,
      defType: DefinitionType.Entity,
    };

    const output = propGen.generate(prop);
    expect(output).toBe('\tname: Type!\n');
  });

  it('should generate float scalar', () => {
    const prop: Property = {
      name: 'name',
      type: 'number',
      defType: DefinitionType.Scalar,
    };

    const output = propGen.generate(prop);
    expect(output).toBe('\tname: Int\n');
  });

  it('should generate int scalar', () => {
    const prop: Property = {
      name: 'name',
      type: 'integer',
      defType: DefinitionType.Scalar,
    };

    const output = propGen.generate(prop);
    expect(output).toBe('\tname: Int\n');
  });

  it('should generate ID', () => {
    const prop: Property = {
      name: 'identifier',
      type: 'string',
      defType: DefinitionType.Scalar,
      isPK: true,
      isRequired: true,
    };

    const output = propGen.generate(prop);
    expect(output).toBe('\tidentifier: ID!\n');
  });

  it('should generate scalar array', () => {
    const prop: Property = {
      name: 'name',
      type: 'string',
      defType: DefinitionType.ScalarArray,
    };

    const output = propGen.generate(prop);
    expect(output).toBe('\tname: [String]\n');
  });

  it('should generate type array', () => {
    const prop: Property = {
      name: 'name',
      type: 'type',
      defType: DefinitionType.EntityArray,
    };

    const output = propGen.generate(prop);
    expect(output).toBe('\tname: [Type]\n');
  });

  it('should generate enum array', () => {
    const prop: Property = {
      name: 'name',
      type: 'enumType',
      defType: DefinitionType.EnumArray,
    };

    const output = propGen.generate(prop);
    expect(output).toBe('\tname: [EnumType]\n');
  });
});
