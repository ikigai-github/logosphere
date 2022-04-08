/* eslint-disable @typescript-eslint/ban-types */
import { TypeFunc } from './common';

export type TypeValue = Function | string | number | boolean | object;

export interface TypeInfo {
  type: TypeValue;
  depth: number;
}

export function resolveType(typeFunc: TypeFunc): TypeInfo {
  const type = typeFunc();

  if (Array.isArray(type)) {
    const { depth: arrayDepth, type: returnType } = resolveArrayType(type);

    if (isDefined(returnType)) {
      return { type: returnType, depth: arrayDepth };
    }
  } else {
    return { type, depth: 0 };
  }
}

export function isDefined(variable: any) {
  return variable !== undefined && variable !== null;
}

export function isScalarType(type: TypeValue) {
  if (type instanceof Function) {
    return (
      type.name == 'String' || type.name === 'Number' || type.name === 'Boolean'
    );
  }

  if (type instanceof Object) return false;

  return type !== null && type !== undefined;
}

type RecursiveArray<TValue> = Array<RecursiveArray<TValue> | TValue>;

export function isTypeValue(type: unknown): type is TypeValue {
  if (type instanceof Function) {
    return (
      type.name == 'String' || type.name === 'Number' || type.name === 'Boolean'
    );
  }

  return (
    type instanceof Object ||
    type instanceof String ||
    type instanceof Boolean ||
    type instanceof Number
  );
}

function resolveArrayType(
  [type]: RecursiveArray<unknown>,
  depth = 1
): TypeInfo {
  if (!Array.isArray(type)) {
    if (isTypeValue(type)) {
      return { type, depth };
    } else {
      return { type: undefined, depth };
    }
  }

  return resolveArrayType(type, depth + 1);
}
