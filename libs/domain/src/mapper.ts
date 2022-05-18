/* eslint-disable @typescript-eslint/no-explicit-any */

export abstract class Mapper<T> {
  public abstract toEntity(data: any): T;

  protected scalarToEntity<S>(type: { (v: any): S }, val: any) {
    return type(val);
  }

  protected scalarArrayToEntity<S>(type: { (v: any): S }, vals: any[]) {
    if (vals && vals instanceof Array) {
      return vals.map((val: any) => type(val));
    } else {
      return undefined;
    }
  }
  protected enumToEntity<E extends { [name: string]: any }>(e: E, key: string) {
    return e[key];
  }
  protected enumArrayToEntity<E extends { [name: string]: any }>(
    e: E,
    keys: string[]
  ) {
    if (keys && keys instanceof Array) {
      return keys.map((key: string) => e[key]);
    } else {
      return undefined;
    }
  }
  protected entityToEntity<E, M extends Mapper<E>>(
    mapper: { new (): M },
    data: any
  ) {
    if (data) {
      const m = new mapper();
      return m.toEntity(data);
    } else {
      return undefined;
    }
  }

  protected entityArrayToEntity<E, M extends Mapper<E>>(
    mapper: { new (): M },
    dataArray: any[]
  ) {
    if (dataArray && dataArray instanceof Array) {
      const m = new mapper();
      return dataArray.map((data: any) => m.toEntity(data));
    } else {
      return undefined;
    }
  }
}
