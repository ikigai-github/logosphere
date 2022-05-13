export type EnumItem = [string, string | number];

export class EnumMetadata<T extends object = object> {
  type: T;
  name: string;
  items: EnumItem[];
  description?: string;
}
