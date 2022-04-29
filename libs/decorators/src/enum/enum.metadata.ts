export class EnumMetadata<T extends object = any> {
  type: T;
  name: string;
  description?: string;
}
