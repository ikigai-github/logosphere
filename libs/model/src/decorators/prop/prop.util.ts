// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { DefType } from '../common';
import { MetadataKeys, getMetadataStorage } from '../metadata';
import { isScalarType, resolveType } from '../utils';
import { PropMetadata } from './prop.metadata';
import { EnumItem } from '../enum';

export interface PropTypeInfo {
  typename: string;
  defType?: DefType;
  items?: EnumItem[];
}

export function resolvePropType(meta: PropMetadata): PropTypeInfo {
  const { type, depth } = resolveType(meta.type);
  const isArray = depth > 0;
  let typename = typeof type as string;

  if (meta.externalModule) {
    return isArray
      ? { typename, defType: DefType.ExternalEntityArray }
      : { typename, defType: DefType.ExternalEntity };
  }

  if (isScalarType(type)) {
    if (type instanceof Function) {
      typename = type.name.toLowerCase();
    }

    return isArray
      ? { typename, defType: DefType.ScalarArray }
      : { typename, defType: DefType.Scalar };
  }

  if (type instanceof Function) {
    typename = type.name;

    // If the type has entity metadata then it's a reference
    const entityRef = Reflect.getOwnMetadata(MetadataKeys.EntityCache, type);
    if (entityRef) {
      typename = entityRef.name;
      return isArray
        ? { typename, defType: DefType.EntityArray }
        : { typename, defType: DefType.Entity };
    }
  } else if (type instanceof Object) {
    const enumRef = getMetadataStorage().getEnumByType(type);

    if (enumRef) {
      typename = enumRef.name;
      return isArray
        ? { typename, defType: DefType.EnumArray, items: enumRef.items }
        : { typename, defType: DefType.Enum, items: enumRef.items };
    }
  }

  return { typename };
}
