// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
// import {
//   CanonicalSchema,
//   Definition,
//   DefinitionType,
//   Property,
// } from '@logosphere/converters';
import { EntityMetadata } from './entity';
import { PropMetadataMap, resolvePropType } from './prop';
import { isDefined } from './utils';
import { EnumMetadata } from './enum/enum.metadata';

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
  private enums: EnumMetadata[] = [];

  addEntity(metadata: EntityMetadata) {
    this.entities.push(metadata);
  }

  addEnum(metadata: EnumMetadata) {
    this.enums.push(metadata);
  }

  getEnumByType<T extends object = object>(type: T) {
    return this.enums.find((item) => item.type === type);
  }

  clear() {
    this.entities = [];
    this.enums = [];
  }

  buildSchema() {
    const definitions = [];
    this.entities.forEach((entity) => {
      const propMetaMap: PropMetadataMap = Reflect.getMetadata(
        MetadataKeys.PropCache,
        entity.target
      );

      const props = [];
      for (const meta of propMetaMap.values()) {
        const { typename, defType, values } = resolvePropType(meta);

        if (!isDefined(defType)) {
          throw Error(
            `Could not determine definition type for property ${meta.name} on entity ${meta.target.name}`
          );
        }

        props.push({
          name: meta.name instanceof Function ? meta.name() : meta.name,
          type: typename,
          isEnabled: meta.enabled,
          isRequired: meta.required,
          isPK: meta.primary,
          isReadOnly: meta.readOnly,
          isWriteOnly: meta.writeOnly,
          examples: meta.examples || values,
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
        type: 'Entity',
        module: entity.module,
        description: entity.description,
        props,
      });
    });

    return { definitions };
  }
}

export function getMetadataStorage(): MetadataStorage {
  return (
    globalThis.LogosphereMetadataStorage ||
    (globalThis.LogosphereMetadataStorage = new MetadataStorage())
  );
}
