import { getMetadataStorage } from '../metadata';
import { EnumItem } from './enum.metadata';

export function registerEnum<T extends object = object>(type: T, name: string);

export function registerEnum<T extends object = object>(
  type: T,
  name: string,
  description?: string
) {
  // Exclude the numeric properties of the enum keys
  const items = Object.keys(type)
    .filter((key) => isNaN(+key))
    .map((key) => [key, type[key]] as EnumItem);
  getMetadataStorage().addEnum({
    type,
    name,
    items,
    description,
  });
}
