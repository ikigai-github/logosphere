import { getMetadataStorage } from '../metadata';

export function registerEnum<T extends object = any>(type: T, name: string);

export function registerEnum<T extends object = any>(
  type: T,
  name: string,
  description?: string
) {
  getMetadataStorage().addEnum({
    type,
    name,
    description,
  });
}
