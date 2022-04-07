import {
  CanonicalSchema,
  Definition,
  DefinitionType,
  Property,
} from '../codegen';
import { lowerCase } from 'lodash';
import { EntityMetadata } from './entity';
import { PropMetadataMap } from './prop';
import { isDefined, resolveType } from './utils';
import { isScalarType } from 'graphql';

export enum MetadataKeys {
  /** Get the Typescript assigned Type at runtime */
  Type = 'design:type',

  /**
   * Property metadata cache
   */
  PropCache = 'logosphere:properties',

  /**
   * Entity metadata cache
   */
  EntityCache = 'logosphere:entity',
}

/**
 * This class provides a way to access collected metadata from decorators.
 */
export class MetadataStorage {
  private entities: EntityMetadata[] = [];

  addEntity(entity: EntityMetadata) {
    this.entities.push(entity);
  }

  clear() {
    this.entities = [];
  }

  buildSchema(): CanonicalSchema {
    const definitions: Definition[] = [];
    this.entities.forEach((entity) => {
      const propMetaMap: PropMetadataMap = Reflect.getMetadata(
        MetadataKeys.PropCache,
        entity.target
      );

      const props: Partial<Property>[] = [];
      for (const [_, meta] of propMetaMap.entries()) {
        const { type, depth } = resolveType(meta.type);
        const defType = getDefType(type, depth, isDefined(meta.externalModule));

        if (!isDefined(defType)) {
          throw Error(
            `Could not determine definition type for property ${meta.name} on entity ${meta.target.name}`
          );
        }

        props.push({
          name: meta.name,
          type: lowerCase(type.name),
          isEnabled: meta.enabled,
          isRequired: meta.required,
          isPK: meta.primary,
          isReadOnly: meta.readOnly,
          isWriteOnly: meta.writeOnly,
          examples: meta.examples,
          pattern: meta.pattern,
          description: meta.doc,
          minLength: meta.minLength,
          maxLength: meta.maxLength,
          externalModule: meta.externalModule,
          defType,
        });
      }

      definitions.push({
        name: entity.name,
        type: DefinitionType.Entity,
        module: entity.module,
        description: entity.description,
        props,
      });
    });

    return { definitions };
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
function getDefType(type: Function, depth: number, external: boolean) {
  // If we found another entity for the resolved type its a reference
  if (external) {
    return depth > 0
      ? DefinitionType.ExternalEntityArray
      : DefinitionType.ExternalEntity;
  } else {
    // If the type has entity metadata then itsa reference
    const ref = Reflect.hasMetadata(MetadataKeys.EntityCache, type);
    if (ref) {
      return depth > 0 ? DefinitionType.EntityArray : DefinitionType.Entity;
    }

    // TODO: See if we can determine the type is an Enum or Enum Array

    if (isScalarType(type)) {
      return depth > 0 ? DefinitionType.ScalarArray : DefinitionType.Scalar;
    }
  }

  return undefined;
}

export function getMetadataStorage(): MetadataStorage {
  return (
    globalThis.LogosphereMetadataStorage ||
    (globalThis.LogosphereMetadataStorage = new MetadataStorage())
  );
}
