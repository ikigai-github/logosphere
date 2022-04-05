/**
 * Type for any class that has a new function
 */
export interface NewableClass<T = any> {
  new (...args: any[]): T;
}

/**
 * Type for any constructor new function
 */
export type NewConstructor<T = any> = new (...args: any) => T;


export type NoArgFunc<T = any> = () => T;

/**
 * Function that takes now arguments and returns a type by its constructor
 * This is used by decorators to lazily assign a type to a property.
 * ex `() => String`
 */
export type TypeFunc<T = any> = () =>
  | NewConstructor<T>
  | NewConstructor<T>[]
  | NewConstructor<T>[][];
