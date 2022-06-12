import { FlureePredicate } from './fluree.schema';
import { constants as c, types as t } from './fluree.constants';
import { canonicalTypes as ct, DefinitionType } from '../canonical';
import { FlureeSchemaPropParser } from './fluree.prop-parser';

describe('Fluree prop parser', () => {
  it('should parse scalar prop to canonical schema', () => {
    const predicate: FlureePredicate = {
      _id: c.PREDICATE,
      name: 'test',
      type: t.STRING,
    };

    const parser = new FlureeSchemaPropParser(predicate.name);
    const prop = parser.parse(predicate);
    expect(prop.name).toBe(predicate.name);
    expect(prop.defType).toBe(DefinitionType.Scalar);
    expect(prop.type).toBe(ct.STRING);
  });

  it('should parse scalar array prop to canonical schema', () => {
    const predicate: FlureePredicate = {
      _id: c.PREDICATE,
      name: 'test',
      type: t.STRING,
      multi: true,
    };

    const parser = new FlureeSchemaPropParser(predicate.name);
    const prop = parser.parse(predicate);
    expect(prop.name).toBe(predicate.name);
    expect(prop.defType).toBe(DefinitionType.ScalarArray);
    expect(prop.type).toBe(ct.STRING);
  });

  it('should parse entity prop to canonical schema', () => {
    const predicate: FlureePredicate = {
      _id: c.PREDICATE,
      name: 'test',
      type: c.REF,
      restrictCollection: 'other',
    };

    const parser = new FlureeSchemaPropParser(predicate.name);
    const prop = parser.parse(predicate);
    expect(prop.name).toBe(predicate.name);
    expect(prop.defType).toBe(DefinitionType.Entity);
    expect(prop.type).toBe('Other');
  });

  it('should parse entity array prop to canonical schema', () => {
    const predicate: FlureePredicate = {
      _id: c.PREDICATE,
      name: 'test',
      type: c.REF,
      restrictCollection: 'other',
      multi: true,
    };

    const parser = new FlureeSchemaPropParser(predicate.name);
    const prop = parser.parse(predicate);
    expect(prop.name).toBe(predicate.name);
    expect(prop.defType).toBe(DefinitionType.EntityArray);
    expect(prop.type).toBe('Other');
  });

  it('should parse identifier prop to canonical schema', () => {
    const predicate: FlureePredicate = {
      _id: c.PREDICATE,
      name: c.IDENTIFIER,
      type: t.STRING,
    };

    const parser = new FlureeSchemaPropParser(predicate.name);
    const prop = parser.parse(predicate);
    expect(prop.name).toBe(predicate.name);
    expect(prop.defType).toBe(DefinitionType.Scalar);
    expect(prop.type).toBe(ct.STRING);
    expect(prop.isPK).toBeTruthy();
  });
});
