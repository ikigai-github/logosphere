export class EnumMetadata<T extends object = object> {
  type: T;
  name: string;
  keys: string[];
  description?: string;
}
