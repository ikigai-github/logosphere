/* eslint-disable no-restricted-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Definition,
  Property,
  DefinitionType,
  propExample,
} from '@logosphere/converters';
import { strings } from '@angular-devkit/core';
import {
  classify,
  dasherize,
  camelize,
} from '@angular-devkit/core/src/utils/strings';
import {
  flureeData,
  flureeFixtures,
  dtoData,
  dtoFixtures,
} from '../utils/fixtures';

import { asserts, defaults } from './constants';

export const flureeFx = flureeFixtures;
export const dtoFx = dtoFixtures;

function typeFormat(prop: Property, objectType = '') {
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

function nameFormat(prop: Property) {
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

/**
 * Formatter for DTOs
 * @param prop Canonical schema property
 * @returns Formatted DTO
 */
export function dtoProp(prop: Property) {
  return {
    name: nameFormat(prop),
    type: typeFormat(prop, 'dto'),
  };
}

/**
 * Formatter for entity properties
 * @param prop Canonical schema property
 * @returns Formatted property
 */
export function entityProp(prop: Property) {
  return {
    name: nameFormat(prop),
    type: typeFormat(prop),
  };
}

/**
 * Name and file for the imports
 */
export interface TsImport {
  name: string;
  file: string;
}

/**
 * Helper function for generating DTO import line
 * @param def Canonical schema definition
 * @param relativePath Relative path to DTOs
 * @returns  name and file for the imports
 */
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

/**
 * Helper function for generating entity import line
 * @param def
 * @param relativePath
 * @returns name and file for the imports
 */
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

/**
 * Helper function for generating mapper import line
 * @param def Canonical schema definition
 * @param mapperType Persistency type, such as `fluree` or `postgres`
 * @param relativePath relative part to imports
 * @returns name and file for the imports
 */
export function mapperImports(
  def: Definition,
  mapperType: string,
  relativePath = '.'
): TsImport[] {
  return def.props
    .filter(
      (prop: Property) =>
        prop.defType === DefinitionType.Entity ||
        prop.defType === DefinitionType.EntityArray
    )
    .map((prop: Property) => {
      return {
        name: `${classify(prop.type)}${classify(mapperType)}Map`,
        file: `${relativePath}/${dasherize(prop.type)}.${dasherize(
          mapperType
        )}.map`,
      };
    });
}

/**
 * Determines if enum imports are required
 * @param def Canonical schema definition
 * @returns true or false
 */
export function isEnumImport(def: Definition): boolean {
  return (
    def.props.find(
      (prop: Property) =>
        prop.defType === DefinitionType.Enum ||
        prop.defType === DefinitionType.EnumArray
    ) !== undefined
  );
}

/**
 * Determines if there is at least one indexed enum in definition
 * @param def Canonical schema definition
 * @returns true or false
 */
export function hasIndexedEnum(def: Definition): boolean {
  return (
    def.props.find(
      (prop: Property) =>
        (prop.defType === DefinitionType.Enum ||
          prop.defType === DefinitionType.EnumArray) &&
        prop.isIndexed
    ) !== undefined
  );
}

/**
 * Determines if mapper imports are required
 * @param def Canonical schema definition
 * @returns true or false
 */
export function isMapperImport(def: Definition): boolean {
  return (
    def.props.filter(
      (prop: Property) =>
        prop.defType === DefinitionType.Entity ||
        prop.defType === DefinitionType.EntityArray
    ).length > 0
  );
}

/**
 * Determines if entity imports are required
 * @param def Canonical schema definition
 * @returns true or false
 */
export function isEntityImport(def: Definition): boolean {
  return (
    def.props.filter(
      (prop: Property) =>
        prop.defType === DefinitionType.Entity ||
        prop.defType === DefinitionType.EntityArray
    ).length > 0
  );
}

/**
 * Generates import string for enums
 * @param def Canonical schema definition
 * @returns import line
 */
export function enumImports(def: Definition): string[] {
  return def.props
    .filter(
      (prop: Property) =>
        prop.defType === DefinitionType.Enum ||
        prop.defType === DefinitionType.EnumArray
    )
    .map((prop: Property) => `${classify(prop.type)}`);
}

/**
 * Generates example for the entity in unit tests
 * @param prop Canonical schema property
 * @returns Formatted example
 */
export function entityExample(prop: Property) {
  let val = propExample(prop);
  if (
    (prop.defType === DefinitionType.Scalar ||
      prop.defType === DefinitionType.ScalarArray) &&
    prop.type === 'string'
  )
    val = `'${val}'`;
  if (
    prop.defType === DefinitionType.Enum ||
    prop.defType === DefinitionType.EnumArray
  )
    val = `${prop.type}.${val}`;
  if (
    prop.defType === DefinitionType.EnumArray ||
    prop.defType === DefinitionType.ScalarArray
  ) {
    val = `[${val}]`;
  }
  return val;
}

export function dataExample(prop: Property) {
  const val = first(prop.examples);
  switch (prop.defType) {
    case DefinitionType.Enum:
      return `'${val[0]}'`;
    default:
      return `'${propExample(prop)}'`;
  }
}

/**
 * Determines protected method to use in abstract Mapper class
 * depending on definition type
 * @param prop Canonical schema property
 * @returns Mapper method to use in generated mapper class
 */
export function mapperToEntity(prop: Property, mapperType: string): string {
  switch (prop.defType) {
    case DefinitionType.Scalar:
      return `scalar<${camelize(prop.type)}>(${classify(prop.type)}`;
    case DefinitionType.ScalarArray:
      return `scalarArray<${camelize(prop.type)}>(${classify(prop.type)}`;
    case DefinitionType.Entity:
      return `objectToEntity<${classify(prop.type)}, ${classify(
        prop.type
      )}${classify(mapperType)}Map>(${classify(prop.type)}${classify(
        mapperType
      )}Map`;
    case DefinitionType.EntityArray:
      return `objectArrayToEntity<${classify(prop.type)}, ${classify(
        prop.type
      )}${classify(mapperType)}Map>(${classify(prop.type)}${classify(
        mapperType
      )}Map`;
    case DefinitionType.Enum:
      return `enum<typeof ${classify(prop.type)}>(${classify(prop.type)}`;
    case DefinitionType.EnumArray:
      return `enumArray<typeof ${classify(prop.type)}>(${classify(prop.type)}`;
    default:
      return 'undefined';
  }
}

export function mapperToData(prop: Property, mapperType: string): string {
  switch (prop.defType) {
    case DefinitionType.Scalar:
      return `scalar<${camelize(prop.type)}>(${classify(prop.type)}`;
    case DefinitionType.ScalarArray:
      return `scalarArray<${camelize(prop.type)}>(${classify(prop.type)}`;
    case DefinitionType.Entity:
      return `entityToData<${classify(prop.type)}, ${classify(
        prop.type
      )}${classify(mapperType)}Map>(${classify(prop.type)}${classify(
        mapperType
      )}Map`;
    case DefinitionType.EntityArray:
      return `entityArrayToData<${classify(prop.type)}, ${classify(
        prop.type
      )}${classify(mapperType)}Map>(${classify(prop.type)}${classify(
        mapperType
      )}Map`;
    case DefinitionType.Enum:
      return `enum<typeof ${classify(prop.type)}>(${classify(prop.type)}`;
    case DefinitionType.EnumArray:
      return `enumArray<typeof ${classify(prop.type)}>(${classify(prop.type)}`;
    default:
      return 'undefined';
  }
}

/**
 * Determines if expect needs to be created in generated unit tests
 * @param prop
 * @returns true or false
 */
export function createExpect(prop: Property): boolean {
  return (
    prop.defType !== DefinitionType.Entity &&
    prop.defType !== DefinitionType.EntityArray
  );
}

/**
 * Create Fluree nested JSON data fixture
 * @param defs Canonical schema definitions
 * @param rootDefName Name of the root collection
 * @param fixtureDepth Depth of nested JSON
 * @returns Fluree data fixture
 */
export function flureeDataFixture(
  defs: Definition[],
  rootDefName: string,
  fixtureDepth = defaults.FIXTURE_MAX_DEPTH
) {
  return JSON.stringify(
    flureeData(defs, rootDefName, true, false, fixtureDepth),
    null,
    2
  );
}

/**
 * Create DTO nested JSON data fixture
 * @param defs Canonical schema definitions
 * @param rootDefName Name of the root collection
 * @param fixtureDepth Depth of nested JSON
 * @returns DTO data fixture
 */
export function dtoDataFixture(
  defs: Definition[],
  rootDefName: string,
  fixtureDepth = defaults.FIXTURE_MAX_DEPTH,
  gqlInput = false
) {
  return JSON.stringify(
    dtoData(defs, rootDefName, false, fixtureDepth, gqlInput),
    null,
    2
  );
}

/**
 * Determines assertion in generated unit tests
 * @param prop Canonical schema property
 * @returns Assertion
 */
export function assert(prop: Property): string {
  switch (prop.defType) {
    case DefinitionType.EntityArray:
    case DefinitionType.EnumArray:
    case DefinitionType.ScalarArray:
      return asserts.TO_STRICT_EQUAL;
    default:
      return asserts.TO_BE;
  }
}
