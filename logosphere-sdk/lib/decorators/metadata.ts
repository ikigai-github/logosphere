import {
  CanonicalSchema,
  Definition,
  DefinitionType,
  Property,
} from '../codegen';
import { lowerCase } from 'lodash';
import { EntityMetadata } from './entity';
import { PropMetadataMap } from './prop';
import { resolveType } from './utils';

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
  private schema: CanonicalSchema;

  addEntity(entity: EntityMetadata) {
    this.entities.push(entity);
  }

  clear() {
    this.entities = [];
    this.schema = undefined;
  }

  buildSchema() {
    const definitions: Definition[] = [];
    this.entities.forEach((entity) => {
      const propMetaMap: PropMetadataMap = Reflect.getMetadata(
        MetadataKeys.PropCache,
        entity.target
      );

      const props: Partial<Property>[] = [];
      for (const [_, meta] of propMetaMap.entries()) {
        const { type, depth } = resolveType(meta.type);
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
          // TODO: There can be enums, references,  to other entities which are TBA
          defType:
            depth > 0 ? DefinitionType.ScalarArray : DefinitionType.Scalar,
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

    this.schema = { definitions };
  }
}

export function getMetadataStorage(): MetadataStorage {
  return (
    globalThis.LogosphereMetadataStorage ||
    (globalThis.LogosphereMetadataStorage = new MetadataStorage())
  );
}
