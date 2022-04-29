/**
 * Type for any constructor new function
 */
export type NewConstructor<T = any> = new (...args: any) => T;

/**
 * Function that takes no arguments and returns a constructor.
 * This is used by decorators to lazily assign a type to a property.
 * ex `() => String`
 */
export type TypeFunc<T = any> = () =>
  | NewConstructor<T>
  | NewConstructor<T>[]
  | NewConstructor<T>[][]
  | object;

export enum DefinitionType {
  Scalar = 'Scalar',
  Enum = 'Enum',
  Entity = 'Entity',
  ScalarArray = 'ScalarArray',
  EnumArray = 'EnumArray',
  EntityArray = 'EntityArray',
  ExternalEntity = 'ExternalEntity',
  ExternalEntityArray = 'ExternalEntityArray'
}