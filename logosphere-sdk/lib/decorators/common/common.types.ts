export interface AnyClass<T = any> {
  new (...args: any[]): T;
}

export type AnyParamConstructor<T> = new (...args: any) => T;

export type DeferredFunc<T = any> = (...args: unknown[]) => T;
