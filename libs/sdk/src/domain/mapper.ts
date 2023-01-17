/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogosphereError } from '../errors';

export class MapperError extends LogosphereError {
  constructor(message: string, error?: any) {
    super(message, error);
  }
}

/**
 * Abstract class for mapping data between different components
 */
export abstract class Mapper<T> {
  /**
   * Takes data from persistence layer and create entity
   * @param data Persistency layer data
   */
  public abstract toEntity(data: any): T;

  /**
   * Serializes entity into persistence layer data
   * @param entity Entity
   */
  public abstract fromEntity(entity: T): any;

  /**
   * Basic scalar mapper. Converts scalar value of one type
   * to scalar value of another type. Will work with any primitive type
   * constructor such as String(value: any), Number(value: any), Boolean(value: any), Date(value: any)
   * @param type Scalar type to convert to, i.e String, Number, Boolean etc.
   * @param val Value to convert
   * @returns Converted value into type
   */
  protected scalar<S>(type: { (v: any): S }, val: any) {
    return val !== undefined ? type(val) : undefined;
  }

  /**
   * Basic scalar array mapper. Converts array of scalar values of one type
   * to an array of scalar values of another type. Will work with any primitive type
   * constructor such as `String(value: any)`, `Number(value: any)`, `Boolean(value: any)`, `Date(value: any)`
   * @param type Scalar type to convert to, i.e `String`, `Number`, `Boolean` etc.
   * @param vals Array of scalar values
   * @returns Array of scalar values converted into type
   */
  protected scalarArray<S>(type: { (v: any): S }, vals: any[]) {
    if (vals && vals instanceof Array) {
      return vals.map((val: any) => this.scalar(type, val));
    } else {
      return undefined;
    }
  }

  /**
   * Converts enum from key to value and back
   * @param e Enum, for example
   * ```
   * enum SomeEnum {
   *  First = 1,
   *  Second = 2
   * }
   * ```
   * @param key String key in the enum, such as `'First'`, or `1`
   * @returns Value of the key in the enum, such as `1`, or `SomeEnum.First`, or `'First'`
   */
  protected enum<E extends { [name: string]: any }>(
    e: E,
    key: string | number
  ) {
    return e[key];
  }

  /**
   * Converts array of string values of enum, that would typically come from
   * an enum type, into actual enum value
   * @param e Enum, for example
   * ```
   * enum SomeEnum {
   *  First = 1,
   *  Second = 2
   * }
   * ```
   * @param keys array of string keys in the enum, such as `['First', 'Second']` or `[1, 2]`
   * @returns Array of values of the keys in the enum, such as `[1, 2]` or `['First', 'Second']`
   */
  protected enumArray<E extends { [name: string]: any }>(e: E, keys: string[]) {
    if (keys && keys instanceof Array) {
      return keys.map((key: string) => this.enum(e, key));
    } else {
      return undefined;
    }
  }

  /**
   * Invokes mapper of another type on object data of this type
   * @param mapper Mapper  of type M
   * @param data Object data
   * @returns Entity of type E
   */
  protected objectToEntity<E, M extends Mapper<E>>(
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

  /**
   * Invokes mapper of another type on array of object data of this type
   * @param mapper Mapper  of type M
   * @param dataArray array of object data
   * @returns array of entities
   */
  protected objectArrayToEntity<E, M extends Mapper<E>>(
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

  /**
   * Invokes mapper of another type on entity of this type
   * @param mapper Mapper  of type M
   * @param entity Entity of type E
   * @returns Serialized data
   */
  protected entityToData<E, M extends Mapper<E>>(
    mapper: { new (): M },
    entity: E
  ) {
    if (entity) {
      const m = new mapper();
      return m.fromEntity(entity);
    } else {
      return undefined;
    }
  }

  /**
   * Invokes mapper of another type on array of entities of this type
   * @param mapper Mapper  of type M
   * @param entityArray Array of entities of type E
   * @returns array of serialized data
   */
  protected entityArrayToData<E, M extends Mapper<E>>(
    mapper: { new (): M },
    entityArray: E[]
  ) {
    if (entityArray && entityArray instanceof Array) {
      const m = new mapper();
      return entityArray.map((entity: E) => m.fromEntity(entity));
    } else {
      return undefined;
    }
  }
}
