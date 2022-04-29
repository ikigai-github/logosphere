// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { DefinitionType } from '../common';
import { lowerCase } from 'lodash';
import { MetadataKeys, getMetadataStorage } from '../metadata';
import { isScalarType, resolveType } from '../utils';
import { PropMetadata } from './prop.metadata';

export interface PropTypeInfo {
  typename: string;
  defType: DefinitionType;
}

export function resolvePropType(meta: PropMetadata): PropTypeInfo {
  const { type, depth } = resolveType(meta.type);
  const isArray = depth > 0;
  let typename = typeof type as string;

  if (meta.externalModule) {
    return isArray
      ? { typename, defType: DefinitionType.ExternalEntityArray }
      : { typename, defType: DefinitionType.ExternalEntity };
  }

  if (isScalarType(type)) {
    if (type instanceof Function) {
      typename = lowerCase(type.name);
    }

    return isArray
      ? { typename, defType: DefinitionType.ScalarArray }
      : { typename, defType: DefinitionType.Scalar };
  }

  if (type instanceof Function) {
    typename = type.name;

    // If the type has entity metadata then it's a reference
    const entityRef = Reflect.getOwnMetadata(MetadataKeys.EntityCache, type);
    if (entityRef) {
      typename = entityRef.name;
      return isArray
        ? { typename, defType: DefinitionType.EntityArray }
        : { typename, defType: DefinitionType.Entity };
    }
  } else if (type instanceof Object) {
    const enumRef = getMetadataStorage().getEnumByType(type);

    if (enumRef) {
      typename = enumRef.name;
      return isArray
        ? { typename, defType: DefinitionType.EnumArray }
        : { typename, defType: DefinitionType.Enum };
    }
  }

  return { typename, defType: undefined };
}
