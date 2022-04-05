/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AnyParamConstructor, DeferredFunc } from '../common';
import { MetadataKeys } from '../metadata';
import { PropMetadata, PropMetadataMap } from './prop.metadata';

export type PropOptions = Partial<PropMetadata>;

/**
 * This decorator can be added to entity properties to add additional metadata
 * @param options The optional decooration parameters to add to the metadata
 */
export function Prop(options?: PropOptions): PropertyDecorator {
  return (target: AnyParamConstructor, key: string) => {
    options = options ?? {};

    const metadataMap = fetchOrCreateMap(target);

    const type = options.type || createTypeGetter(target, key);

    const metadata: PropMetadata = {
      name: options.name || key,
      type,
      index: options.index || false,
      unique: options.unique || false,
      required: options.required || true,
      examples: options.examples || [],
      readOnly: options.readOnly,
      writeOnly: options.writeOnly,
      doc: options.doc,
      spec: options.spec,
      specDoc: options.specDoc,
    };

    metadataMap.set(key, metadata);
  };
}

/**
 * If a type function was not supplied then will create one that uses
 * reflection to get the type of the given object.
 * @param target The class the property belongs to
 * @param key The name of the property within the class
 * @returns A function that can get the type of the
 */
function createTypeGetter(target: Object, key: string): DeferredFunc {
  return () => Reflect.getMetadata(MetadataKeys.Type, target, key);
}

/**
 * A utility function for getting property metadata assigned to a target
 * @param target The target class the metadata is stored on
 * @returns a map of property metadata assigned to the target
 */
function fetchOrCreateMap(target: Object): PropMetadataMap {
  const hasData = Reflect.hasOwnMetadata(MetadataKeys.PropCache, target);

  if (!hasData) {
    Reflect.defineMetadata(
      MetadataKeys.PropCache,
      new Map<string, PropMetadata>(),
      target
    );
  }

  return Reflect.getOwnMetadata(
    MetadataKeys.PropCache,
    target
  ) as PropMetadataMap;
}
