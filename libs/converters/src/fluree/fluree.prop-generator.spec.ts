import { FlureePropGenerator } from './fluree.prop-generator';
import { Property, DefinitionType } from '../canonical';
import { FlureePredicate } from './fluree.schema';
import { constants as fc, types as ft } from './fluree.constants';

describe('Fluree Schema Prop Generator', () => {
  const propGen = new FlureePropGenerator('user');
  it('should generate bigint scalar', () => {
    const prop: Partial<Property> = {
      name: 'name',
      type: 'number',
      description: 'desc',
      defType: DefinitionType.Scalar,
    };

    const output = propGen.generate(prop);
    expect(output).toStrictEqual({
      _id: fc.PREDICATE,
      name: 'name',
      type: ft.BIGINT,
      doc: 'desc',
      unique: false,
      index: false,
    } as FlureePredicate);
  });

  it('should generate bigint scalar array', () => {
    const prop: Partial<Property> = {
      name: 'name',
      type: 'number',
      description: 'desc',
      defType: DefinitionType.ScalarArray,
    };

    const output = propGen.generate(prop);
    expect(output).toStrictEqual({
      _id: fc.PREDICATE,
      name: 'name',
      type: ft.BIGINT,
      doc: 'desc',
      multi: true,
      unique: false,
      index: false,
    } as FlureePredicate);
  });

  it('should generate instant', () => {
    const prop: Partial<Property> = {
      name: 'name',
      type: 'number',
      description: 'unix time',
      defType: DefinitionType.Scalar,
    };

    const output = propGen.generate(prop);
    expect(output).toStrictEqual({
      _id: fc.PREDICATE,
      name: 'name',
      type: ft.INSTANT,
      doc: 'unix time',
      unique: false,
      index: false,
    } as FlureePredicate);
  });

  it('should generate entity', () => {
    const prop: Partial<Property> = {
      name: 'artwork',
      type: 'artwork',
      description: 'desc',
      defType: DefinitionType.Entity,
    };

    const output = propGen.generate(prop);
    expect(output).toStrictEqual({
      _id: fc.PREDICATE,
      name: 'artwork',
      type: fc.REF,
      doc: 'desc',
      restrictCollection: 'artwork',
      unique: false,
      index: false,
    } as FlureePredicate);
  });

  it('should generate entity array', () => {
    const prop: Partial<Property> = {
      name: 'artwork',
      type: 'artwork',
      description: 'desc',
      defType: DefinitionType.EntityArray,
    };

    const output = propGen.generate(prop);
    expect(output).toStrictEqual({
      _id: fc.PREDICATE,
      name: 'artwork',
      type: fc.REF,
      doc: 'desc',
      restrictCollection: 'artwork',
      multi: true,
      unique: false,
      index: false,
    } as FlureePredicate);
  });

  it('should generate external entity', () => {
    const prop: Partial<Property> = {
      name: 'artwork',
      type: 'artwork',
      description: 'desc',
      defType: DefinitionType.ExternalEntity,
    };

    const output = propGen.generate(prop);
    expect(output).toStrictEqual({
      _id: fc.PREDICATE,
      name: 'artwork',
      type: ft.STRING,
      doc: 'desc, identifier of artwork',
      unique: false,
      index: false,
    } as FlureePredicate);
  });

  it('should generate external entity array', () => {
    const prop: Partial<Property> = {
      name: 'artwork',
      type: 'artwork',
      description: 'desc',
      defType: DefinitionType.ExternalEntityArray,
    };

    const output = propGen.generate(prop);
    expect(output).toStrictEqual({
      _id: fc.PREDICATE,
      name: 'artwork',
      type: ft.STRING,
      doc: 'desc, identifier of artwork',
      multi: true,
      unique: false,
      index: false,
    } as FlureePredicate);
  });
});
