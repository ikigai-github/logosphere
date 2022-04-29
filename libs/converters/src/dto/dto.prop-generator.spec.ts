import { DtoPropGenerator } from './dto.prop-generator';
import { Property, DefinitionType } from '../canonical';
describe('DTO Prop Generator', () => {
  const propGenerator = new DtoPropGenerator();

  it('should generate scalar', () => {
    const prop: Partial<Property> = {
      name: 'name',
      type: 'type',
      defType: DefinitionType.Scalar,
    };
    const target = propGenerator.generate(prop);
    expect(target).toBe('\tname?: type;\n');
  });

  it('should generate enum', () => {
    const prop: Partial<Property> = {
      name: 'name',
      type: 'type',
      defType: DefinitionType.Enum,
    };
    const target = propGenerator.generate(prop);
    expect(target).toBe('\tname?: Type;\n');
  });

  it('should generate entity', () => {
    const prop: Partial<Property> = {
      name: 'name',
      type: 'type',
      defType: DefinitionType.Entity,
    };
    const target = propGenerator.generate(prop);
    expect(target).toBe('\tname?: Type;\n');
  });

  it('should generate scalar array', () => {
    const prop: Partial<Property> = {
      name: 'name',
      type: 'type',
      defType: DefinitionType.ScalarArray,
    };
    const target = propGenerator.generate(prop);
    expect(target).toBe('\tname?: type[];\n');
  });

  it('should generate enum array', () => {
    const prop: Partial<Property> = {
      name: 'name',
      type: 'type',
      defType: DefinitionType.EnumArray,
    };
    const target = propGenerator.generate(prop);
    expect(target).toBe('\tname?: Type[];\n');
  });

  it('should generate entity array', () => {
    const prop: Partial<Property> = {
      name: 'name',
      type: 'type',
      defType: DefinitionType.EntityArray,
    };
    const target = propGenerator.generate(prop);
    expect(target).toBe('\tname?: Type[];\n');
  });
});
