import { FlureePredicate } from './fluree.schema';
import { system as f, types as ft, predicates as fp } from './fluree.constants';
import { canonicalTypes as ct, DefinitionType } from '../../schema';
import { FlureeSchemaPropParser } from './fluree.prop-parser';

describe('Fluree prop parser', () => {
  it('should parse scalar prop to canonical schema', () => {
    const predicate: FlureePredicate = {
      _id: f.PREDICATE,
      name: 'test',
      type: ft.STRING,
    };

    const parser = new FlureeSchemaPropParser(predicate.name);
    const prop = parser.parse(predicate);
    expect(prop.name).toBe(predicate.name);
    expect(prop.defType).toBe(DefinitionType.Scalar);
    expect(prop.type).toBe(ct.STRING);
  });

  it('should parse scalar array prop to canonical schema', () => {
    const predicate: FlureePredicate = {
      _id: f.PREDICATE,
      name: 'test',
      type: ft.STRING,
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
      _id: f.PREDICATE,
      name: 'test',
      type: ft.REF,
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
      _id: f.PREDICATE,
      name: 'test',
      type: ft.REF,
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
      _id: f.PREDICATE,
      name: fp.IDENTIFIER,
      type: ft.STRING,
    };

    const parser = new FlureeSchemaPropParser(predicate.name);
    const prop = parser.parse(predicate);
    expect(prop.name).toBe(predicate.name);
    expect(prop.defType).toBe(DefinitionType.Scalar);
    expect(prop.type).toBe(ct.STRING);
    expect(prop.isPK).toBeTruthy();
  });
});
