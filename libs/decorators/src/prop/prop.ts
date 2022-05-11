/* eslint-disable @typescript-eslint/ban-types */
import { StringFunc, TypeFunc } from '../common';
import { getMetadataStorage, MetadataKeys } from '../metadata';
import { isDefined } from '../utils';
import { PropMetadata, PropMetadataMap } from './prop.metadata';

export type PropOptions = Partial<PropMetadata>;

/**
 * This decorator can be added to entity properties to add additional metadata
 * @param options The optional decooration parameters to add to the metadata
 */
export function Prop(options?: PropOptions): PropertyDecorator {
  return (target: Object, key: string) => {
    options = options ?? {};

    const { constructor } = target;
    const metadataMap = fetchOrCreateMap(constructor);

    const type = options.type || createTypeGetter(target, key);
    const name = options.name || createNameGetter(target, key);
    // TODO: Add validation step for example readOnly && writeOnly can't both be true
    // TODO: Probably clearer to just use flags like `rw`, `r`, `w` so validation not required
    // TODO: Pattern, MinLength, MaxLength, and potentially other validators can come from other decorators
    const metadata: PropMetadata = {
      target: constructor,
      type,
      name,
      index: isDefined(options.index) ? options.index : false,
      enabled: isDefined(options.enabled) ? options.enabled : true,
      primary: isDefined(options.primary) ? options.primary : false,
      unique: isDefined(options.unique) ? options.unique : false,
      required: isDefined(options.required) ? options.required : false,
      readOnly: isDefined(options.readOnly) ? options.readOnly : false,
      writeOnly: isDefined(options.writeOnly) ? options.writeOnly : false,
      doc: options.doc,
      spec: options.spec,
      specDoc: options.specDoc,
      examples: options.examples,
      maxLength: options.maxLength,
      minLength: options.minLength,
      pattern: options.pattern,
      externalModule: options.externalModule,
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
function createTypeGetter(target: Object, key: string): TypeFunc {
  return () => Reflect.getMetadata(MetadataKeys.Type, target, key);
}

/**
 * A function that will defer determining the name of a reference so
 * that it can use the name of the entity it references
 * @param target The class the property belongs to
 * @param key The name of the property within the class
 * @returns A function that can get the type of the
 */
function createNameGetter(target: Object, key: string): StringFunc {
  return () => {
    const type = Reflect.getMetadata(MetadataKeys.Type, target, key);
    const entity = Reflect.getMetadata(MetadataKeys.EntityCache, type);
    return entity?.name ?? key;
  };
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
