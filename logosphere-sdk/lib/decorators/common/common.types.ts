export interface AnyClass<T = any> {
  new (...args: any[]): T;
}

export type AnyParamConstructor<T = any> = new (...args: any) => T;

export type DeferredFunc<T = unknown> = (...args: unknown[]) => T;

export type TypeFunc<T = unknown> = () => T;
