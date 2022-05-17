/* eslint-disable @typescript-eslint/no-unused-vars */
import { Definition, Property, DefinitionType } from '../canonical';
import { strings } from '@angular-devkit/core';
import { classify, dasherize } from '@angular-devkit/core/src/utils/strings';
import * as rs from 'randomstring';

function typeFormat(prop: Partial<Property>, objectType = '') {
  switch (prop.defType) {
    case DefinitionType.Scalar:
      return strings.camelize(prop.type);
    case DefinitionType.ScalarArray:
      return `${strings.camelize(prop.type)}[]`;
    case DefinitionType.Entity:
      return `${strings.classify(prop.type)}${classify(objectType)}`;
    case DefinitionType.EntityArray:
      return `${strings.classify(prop.type)}${classify(objectType)}[]`;
    case DefinitionType.Enum:
      return `${strings.classify(prop.type)}`;
    case DefinitionType.EnumArray:
      return `${strings.classify(prop.type)}[]`;
    default:
      return `${strings.classify(prop.type)}${classify(objectType)}`;
  }
}

function nameFormat(prop: Partial<Property>) {
  return prop.isRequired ? prop.name : `${prop.name}?`;
}

function random(arr: any[]): number {
  return arr && arr.length > 0
    ? arr[Math.floor(Math.random() * arr.length)]
    : undefined;
}

function first(arr: any[]): number {
  return arr && arr.length > 0 ? arr[0] : undefined;
}

export function dtoProp(prop: Partial<Property>) {
  return {
    name: nameFormat(prop),
    type: typeFormat(prop, 'dto'),
  };
}

export function entityProp(prop: Partial<Property>) {
  return {
    name: nameFormat(prop),
    type: typeFormat(prop),
  };
}

export interface TsImport {
  name: string;
  file: string;
}

export function dtoImports(def: Definition, relativePath = '.'): TsImport[] {
  return def.props
    .filter(
      (prop: Property) =>
        prop.defType === DefinitionType.Entity ||
        prop.defType === DefinitionType.EntityArray
    )
    .map((prop: Property) => {
      return {
        name: `${classify(prop.type)}Dto`,
        file: `${relativePath}/${dasherize(prop.type)}.dto`,
      };
    });
}

export function entityImports(def: Definition, relativePath = '.'): TsImport[] {
  return def.props
    .filter(
      (prop: Property) =>
        prop.defType === DefinitionType.Entity ||
        prop.defType === DefinitionType.EntityArray
    )
    .map((prop: Property) => {
      return {
        name: classify(prop.type),
        file: `${relativePath}/${dasherize(prop.type)}.entity`,
      };
    });
}

export function isEnumImport(def: Definition): boolean {
  return (
    def.props.filter(
      (prop: Property) =>
        prop.defType === DefinitionType.Enum ||
        prop.defType === DefinitionType.EnumArray
    ).length > 0
  );
}

export function isEntityImport(def: Definition): boolean {
  return (
    def.props.filter(
      (prop: Property) =>
        prop.defType === DefinitionType.Entity ||
        prop.defType === DefinitionType.EntityArray
    ).length > 0
  );
}

export function enumImports(def: Definition): string[] {
  return def.props
    .filter(
      (prop: Property) =>
        prop.defType === DefinitionType.Enum ||
        prop.defType === DefinitionType.EnumArray
    )
    .map((prop: Property) => `${classify(prop.type)}`);
}

function example(prop: Property) {
  const val = first(prop.examples);

  switch (prop.defType) {
    case DefinitionType.Scalar:
      switch (prop.type) {
        case 'string':
          return `'${
            val
              ? val
              : rs.generate({
                  length: prop.maxLength,
                  charset: 'alphabetic',
                })
          }'`;
        case 'number':
          return val ? +val : Math.floor(Math.random() * 10);
        case 'boolean':
          return true;
        default:
          return '';
      }
    case DefinitionType.Enum:
      return `${prop.type}.${val[0]}`;
    default:
      return '';
  }
}

export function entityExample(prop: Property) {
  return example(prop);
}

export function dataExample(prop: Property) {
  const val = first(prop.examples);
  switch (prop.defType) {
    case DefinitionType.Enum:
      return `'${val[0]}'`;
    default:
      return example(prop);
  }
}

export function entityMap(prop, val) {
  switch (prop.defType) {
    case DefinitionType.Enum:
      return `${prop.type}[${val}]`;
    default:
      return val;
  }
}
