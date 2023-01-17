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
import { DefType } from './common';

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
          props.push({
            name: meta.name,
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

        if (entity.nft) {
          props.push({
            name: 'nftIpfsCid',
            type: 'string',
            isEnabled: true,
            isRequired: false,
            isIndexed: true,
            isUnique: false,
            isPK: false,
            isReadOnly: false,
            isWriteOnly: false,
            description: 'CID from IPFS',
            examples: ['QmPrhyaEVcavi3XuP7WHBcD2n8xcUK6mGcF1u6AchXYbgn'],
            defType: DefType.Scalar,
          });

          props.push({
            name: 'nftCardanoTxId',
            type: 'string',
            isEnabled: true,
            isRequired: false,
            isIndexed: true,
            isUnique: false,
            isPK: false,
            isReadOnly: false,
            isWriteOnly: false,
            description: 'Cardano transaction ID',
            examples: [
              '664274fa17646981774ac9a5ab5f79d4229788ee5d78bb6e3af351f9b25e2ac3',
            ],
            defType: DefType.Scalar,
          });

          props.push({
            name: 'nftName',
            type: 'string',
            isEnabled: true,
            isRequired: false,
            isIndexed: true,
            isUnique: false,
            isPK: false,
            isReadOnly: false,
            isWriteOnly: false,
            description: 'Cardano NFT name',
            examples: ['NFT Name'],
            defType: DefType.Scalar,
          });

          props.push({
            name: 'nftDescription',
            type: 'string',
            isEnabled: true,
            isRequired: false,
            isIndexed: true,
            isUnique: false,
            isPK: false,
            isReadOnly: false,
            isWriteOnly: false,
            description: 'Cardano NFT description',
            examples: ['NFT Description'],
            defType: DefType.Scalar,
          });

          props.push({
            name: 'nftAssetName',
            type: 'string',
            isEnabled: true,
            isRequired: false,
            isIndexed: true,
            isUnique: false,
            isPK: false,
            isReadOnly: false,
            isWriteOnly: false,
            description: 'Cardano NFT asset name',
            examples: ['NFT Asset Name'],
            defType: DefType.Scalar,
          });
        }
      }

      definitions.push({
        name: entity.name,
        type: 'Entity',
        module: entity.module,
        description: entity.description,
        isNft: entity.nft,
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
