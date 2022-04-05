/* eslint-disable @typescript-eslint/ban-types */
import { TypeFunc } from './common';

type RecursiveArray<TValue> = Array<RecursiveArray<TValue> | TValue>;

export interface TypeInfo {
  type: Function;
  depth: number;
}

export function resolveType(typeFunc: TypeFunc): TypeInfo {
  const type = typeFunc();

  if (type instanceof Function && isPrimitiveType(type)) {
    return { type, depth: 0 };
  } else if (Array.isArray(type)) {
    const { depth: arrayDepth, type: returnType } = resolveArrayType(type);

    if (isDefined(returnType)) {
      return { type: returnType, depth: arrayDepth };
    }
  }

  return { type: undefined, depth: 0 };
}

export function isDefined(variable: any) {
  return variable !== undefined && variable !== null;
}

function isPrimitiveType(type: Function) {
  return (
    type.name == 'String' || type.name === 'Number' || type.name === 'Boolean'
  );
}

function resolveArrayType(
  [type]: RecursiveArray<unknown>,
  depth = 1
): TypeInfo {
  if (!Array.isArray(type)) {
    if (type instanceof Function) {
      return { type, depth };
    } else {
      return { type: undefined, depth };
    }
  }

  return resolveArrayType(type, depth + 1);
}
