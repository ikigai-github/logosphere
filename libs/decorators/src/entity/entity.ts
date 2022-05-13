import 'reflect-metadata';
import { TypeFunc } from '../common';
import { getMetadataStorage, MetadataKeys } from '../metadata';
import { EntityMetadata } from './entity.metadata';
import { StorageLayer } from './entity.types';

export type EntityOptions = Partial<EntityMetadata>;

export function Entity(): ClassDecorator;
export function Entity(options?: EntityOptions): ClassDecorator;
export function Entity(name?: string, options?: EntityOptions): ClassDecorator;

/**
 * Any class decorated with the entity decorator can be evaluated for modeling
 * @param nameOrOptions The name of the entity or an options object
 * @param maybeOptions The options object in the event the name was passed as the first param
 * @returns A class decorator function
 */
export function Entity(
  nameOrOptions?: string | EntityOptions,
  maybeOptions?: EntityOptions
): ClassDecorator {
  const { options, name } = getNameAndOptions(nameOrOptions, maybeOptions);

  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (target: Function) {
    const metadata: EntityMetadata = {
      target,
      module: options.module,
      name: name || toCamelCase(target.name),
      root: options.root || (target as TypeFunc),
      version: options.version || 1,
      layer:
        options.layer || StorageLayer.KnowledgeGraph | StorageLayer.HotLayer,
      doc: options.doc,
      spec: options.spec,
      specDoc: options.specDoc,
    };

    Reflect.defineMetadata(MetadataKeys.EntityCache, metadata, target);
    getMetadataStorage().addEntity(metadata);
  };
}

/**
 * Utility function to distinguish the name and options passed in.
 */
function getNameAndOptions(
  nameOrOptions: string | EntityOptions | undefined,
  maybeOptions: EntityOptions | undefined
) {
  if (typeof nameOrOptions === 'string') {
    return {
      name: nameOrOptions,
      options: maybeOptions || ({} as EntityOptions),
    };
  } else {
    return {
      name: nameOrOptions?.name,
      options: nameOrOptions || ({} as EntityOptions),
    };
  }
}

/**
 * Util function to convert any tring to cammel case
 * Taken from: https://caseconverter.pro/blog/convert-any-string-to-camelcase-javascript
 * @param text The text to convert to camel case
 * @returns A camel case formatted string
 */
function toCamelCase(text: string) {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (leftTrim: string, index: number) =>
      index === 0 ? leftTrim.toLowerCase() : leftTrim.toUpperCase()
    )
    .replace(/\s+/g, '');
}
