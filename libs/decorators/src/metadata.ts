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
    if (!this.entities.find((entity) => entity.name === metadata.name)) {
      this.entities.push(metadata);
    }
  }

  addEnum(metadata: EnumMetadata) {
    if (!this.enums.find((enumeration) => enumeration.name === metadata.name)) {
      this.enums.push(metadata);
    }
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
      if (propMetaMap) {
        for (const meta of propMetaMap.values()) {
          const { typename, defType, items } = resolvePropType(meta);

          if (!isDefined(defType)) {
            const name =
              meta.name instanceof Function ? meta.name() : meta.name;
            throw Error(
              `Could not determine definition type for property ${name} on entity ${meta.target.name}`
            );
          }

          props.push({
            name: meta.name instanceof Function ? meta.name() : meta.name,
            type: typename,
            isEnabled: meta.enabled,
            isRequired: meta.required,
            isIndexed: meta.index,
            isUnique: meta.unique,
            isPK: meta.primary,
            isReadOnly: meta.readOnly,
            isWriteOnly: meta.writeOnly,
            examples: meta.examples || items,
            pattern: meta.pattern,
            description: meta.doc,
            minLength: meta.minLength,
            maxLength: meta.maxLength,
            externalModule: meta.externalModule,
            comment: meta.comment,
            defType,
          });
        }
      }

      definitions.push({
        name: entity.name,
        type: 'Entity',
        module: entity.module,
        description: entity.description,
        props,
      });
    });

    this.enums.forEach((enumeration) => {
      const values = enumeration.items.map((item) => {
        return { name: item[0], type: 'string' };
      });
      definitions.push({
        name: enumeration.name,
        type: 'Enum',
        // TODO: Should these have a module?
        description: enumeration.description,
        props: values,
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
