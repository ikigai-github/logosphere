/* eslint-disable prettier/prettier */
import { TypeFunc } from './common';

type RecursiveArray<TValue> = Array<RecursiveArray<TValue> | TValue>;

export interface TypeInfo {
  type: unknown;
  depth: number;
}

export function resolveType(typeFunc: TypeFunc): TypeInfo {
  const type = typeFunc();

  if(isPrimitiveType(type)) {
      return { type, depth: 0}
  } else if (Array.isArray(type)) {
    const { depth: arrayDepth, type: returnType } = resolveArrayType(type);

    if (returnType !== undefined && returnType !== null) {
      return { type: returnType, depth: arrayDepth };
    } 
  } 
  
  return { type: undefined, depth: 0};
}

function isPrimitiveType(type: unknown) {
  if(type instanceof Function) {
    return type.name == 'String' || type.name === 'Number' || type.name === 'Boolean';
  }

  return type instanceof String || type instanceof Boolean || type instanceof Number;
}

function resolveArrayType([type]: RecursiveArray<unknown>, depth = 1): TypeInfo {
  if (!Array.isArray(type)) {
    return { type, depth };
  }

  return resolveArrayType(type, depth + 1);
}
