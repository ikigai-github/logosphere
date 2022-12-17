import { strings as s } from '@angular-devkit/core/src';
import { Definition, DefinitionType, Property } from '@logosphere/schema';
import { KEY, VALUE, tsTypes as ts, cppTypes as cpp } from './const';

/**
 * Determines if the definition is a key-value pair.
 * It will be converted to TMap in C++ code
 * @param def Canonical definition
 * @returns true / false
 */
export function isKeyValueDef(def: Definition) {
  return (
    !!def &&
    !!def.props &&
    def.props.length === 2 &&
    !!def.props.find((prop: Property) => prop.name === KEY) &&
    !!def.props.find((prop: Property) => prop.name === VALUE)
  );
}

function kvType(definitions: Definition[], prop: Property, kv: string) {
  const def = definitions.find(
    (d: Definition) => s.capitalize(d.name) === s.capitalize(prop.type)
  );
  const key = def.props.find((p: Property) => p.name === kv);
  return typeMap(definitions, key);
}

export function isKeyValueProp(definitions: Definition[], prop: Property) {
  return isKeyValueDef(
    definitions.find(
      (d: Definition) => s.capitalize(d.name) === s.capitalize(prop.type)
    )
  );
}

export function typeMap(
  definitions: Definition[],
  prop: Property,
  namePrefix = ''
): string {
  switch (prop.type) {
    case ts.STRING:
      return prop.defType === DefinitionType.ScalarArray
        ? `TArray<${cpp.FSTRING}>`
        : cpp.FSTRING;
    case ts.NUMBER:
      return prop.defType === DefinitionType.ScalarArray
        ? `TArray<${cpp.INT}>`
        : cpp.INT;
    default:
      if (isKeyValueProp(definitions, prop)) {
        return `TMap<${kvType(definitions, prop, KEY)}, ${kvType(
          definitions,
          prop,
          VALUE
        )}>`; //TODO: process types
      } else {
        switch (prop.defType) {
          case DefinitionType.Entity:
            return `F${namePrefix}${s.classify(prop.type)}`;
          case DefinitionType.EntityArray:
            return `TArray<F${namePrefix}${s.classify(prop.type)}>`;
          case DefinitionType.Enum:
            return `E${s.classify(prop.type)}`;
          case DefinitionType.EnumArray:
            return `TArray<E${namePrefix}${s.classify(prop.type)}>`;

          default:
            return s.classify(prop.type);
        }
      }
  }
}

export function isEnum(def: Definition) {
  return def.type === DefinitionType.Enum;
}

export function isEntity(def: Definition) {
  return def.type === DefinitionType.Entity;
}

export function imports(definitions: Definition[], def: Definition) {
  if (isEnum(def)) {
    return [];
  } else {
    return def.props
      .filter(
        (prop: Property) =>
          (prop.defType === DefinitionType.Entity ||
            prop.defType === DefinitionType.EntityArray ||
            prop.defType === DefinitionType.Enum ||
            prop.defType === DefinitionType.EnumArray) &&
          !isKeyValueProp(definitions, prop)
      )
      .map((prop: Property) => {
        return {
          name: s.classify(prop.type),
        };
      });
  }
}

export function propToF(prop: Property, namePrefix = '') {
  switch (prop.defType) {
    case DefinitionType.Entity:
      return `${s.classify(prop.type)}ToF${namePrefix}${s.classify(
        prop.type
      )}(v.${prop.name}),`;
    case DefinitionType.EntityArray:
      return `${s.classify(prop.type)}ModelToUnreal(v.${prop.name}),`;
    case DefinitionType.ScalarArray:
      return `${s.classify(prop.name)}ModelToUnreal(v.${prop.name}),`;
    default:
      switch (prop.type) {
        case ts.NUMBER:
          return `v.${prop.name}.value_or(0),`;
        default:
          return `v.${prop.name}.value_or("").c_str(),`;
      }
  }
}

export function propToInput(prop: Property, namePrefix = '') {
  switch (prop.defType) {
    case DefinitionType.Entity:
      return `F${namePrefix}${s.classify(prop.type)}To${s.classify(
        prop.type
      )}Input(input.${prop.name}),`;
    case DefinitionType.EntityArray:
      return `${s.classify(prop.type)}UnrealToModel(input.${prop.name}),`;
    case DefinitionType.ScalarArray:
      return `${s.classify(prop.name)}UnrealToModel(input.${prop.name}),`;
    default:
      switch (prop.type) {
        case ts.NUMBER:
          return `input.${prop.name},`;
        default:
          return `ConvertUnrealString(input.${prop.name}),`;
      }
  }
}

export function kvTMaps(definitions: Definition[], def: Definition) {
  if (isEnum(def)) {
    return [];
  } else {
    return def.props
      .filter(
        (prop: Property) =>
          prop.defType === DefinitionType.EntityArray &&
          isKeyValueProp(definitions, prop)
      )
      .map((prop: Property) => {
        return {
          name: prop.name,
          type: s.classify(prop.type),
        };
      });
  }
}

export function tArrays(definitions: Definition[], def: Definition) {
  if (isEnum(def)) {
    return [];
  } else {
    return def.props
      .filter(
        (prop: Property) =>
          prop.defType === DefinitionType.ScalarArray && prop.type === ts.STRING
      )
      .map((prop: Property) => {
        return {
          name: prop.name,
        };
      });
  }
}
