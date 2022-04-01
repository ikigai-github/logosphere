export interface ClassType<T = any> {
  new (...args: any[]): T;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type ObjectType = ClassType | Function | object | symbol;
export type LazyObjectType = (returns?: void) => ObjectType;
export type PropDecoratorType = PropertyDecorator & MethodDecorator;
