import { getMetadataStorage } from '../metadata';

export function registerEnum<T extends object = object>(type: T, name: string);

export function registerEnum<T extends object = object>(
  type: T,
  name: string,
  description?: string
) {
  getMetadataStorage().addEnum({
    type,
    name,
    keys: Object.keys(type),
    description,
  });
}
