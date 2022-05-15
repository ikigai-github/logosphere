import { Definition, Property, DefinitionType } from '../canonical';
import { strings } from '@angular-devkit/core';
import { classify, dasherize } from '@angular-devkit/core/src/utils/strings';

function typeFormat(prop: Partial<Property>, objectType: string = '') {
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
    case DefinitionType.ExternalEntity:
      return `${strings.classify(prop.type)}${classify(objectType)}`;
    case DefinitionType.ExternalEntityArray:
      return `${strings.classify(prop.type)}${classify(objectType)}[]`;
    default:
      return `${strings.classify(prop.type)}${classify(objectType)}`;
  }
}

function nameFormat(prop: Partial<Property>) {
  return prop.isRequired ? prop.name : `${prop.name}?`;
}

export function dtoProp(prop: Partial<Property>) {
  return {
    name: nameFormat(prop),
    type: typeFormat(prop, 'dto'),
  };
}

export interface TsImport {
  name: string;
  file: string;
}

export function dtoImports(def: Definition): TsImport[] {
  return def.props
    .filter(
      (prop: Property) =>
        prop.defType !== DefinitionType.Scalar &&
        prop.defType !== DefinitionType.ScalarArray
    )
    .map((prop: Property) => {
      return {
        name:
          prop.defType === DefinitionType.Enum ||
          prop.defType === DefinitionType.EnumArray
            ? classify(prop.type)
            : `${classify(prop.type)}Dto`,
        file:
          prop.defType === DefinitionType.Enum ||
          prop.defType === DefinitionType.EnumArray
            ? `../enum-types/${dasherize(prop.type)}.type`
            : `./${dasherize(prop.type)}.dto`,
      };
    });
}
