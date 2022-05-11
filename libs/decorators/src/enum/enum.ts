import { getMetadataStorage } from '../metadata';

export function registerEnum<T extends object = object>(type: T, name: string);

export function registerEnum<T extends object = object>(
  type: T,
  name: string,
  description?: string
) {
  // Exclude the numeric properties of the enum keys
  const keys = Object.keys(type).filter((key) => isNaN(+key));
  getMetadataStorage().addEnum({
    type,
    name,
    keys,
    description,
  });
}
