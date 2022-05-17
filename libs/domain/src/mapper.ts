/* eslint-disable @typescript-eslint/no-explicit-any */
export class Mapper<T> {
  public static scalar<S>(s: S, val: any) {
    return val;
  }
  public static enum<E extends { [name: string]: any }>(e: E, key: string) {
    return e[key];
  }
}
