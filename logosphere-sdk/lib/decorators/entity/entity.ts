/* eslint-disable @typescript-eslint/no-unused-vars */
import { EntityMetadata } from './entity.metadata';
import { EntityOptions } from './entity.options';
import { StorageLayer } from './entity.types';

export function Entity(): ClassDecorator;
export function Entity(options?: EntityOptions): ClassDecorator;
export function Entity(name?: string, options?: EntityOptions): ClassDecorator;

export function Entity(
  nameOrOptions?: string | EntityOptions,
  maybeOptions?: EntityOptions
) {
  const { options, name } = getNameAndOptions(nameOrOptions, maybeOptions);

  return function (target) {
    const metadata = {
      target,
      name: name || target.name,
      root: options.root || target,
      version: options.version || 1,
      layer: options.layer || StorageLayer.Two | StorageLayer.Three,
      doc: options.doc,
      spec: options.spec,
      specDoc: options.specDoc,
    };
    // TODO: Store metadata for processing
    console.log('Extracted metadate for entity:');
    console.log(JSON.stringify(metadata));
  };
}

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
