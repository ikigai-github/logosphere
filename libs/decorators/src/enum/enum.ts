import { getMetadataStorage } from '../metadata';

export function registerEnum<T extends object = object>(type: T, name: string);

export function registerEnum<T extends object = object>(
  type: T,
  name: string,
  description?: string
) {
  const keys = Object.keys(type);
  getMetadataStorage().addEnum({
    type,
    name,
    keys,
    description,
  });
}
