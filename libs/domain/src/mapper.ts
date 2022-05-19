/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Abstract class for mapping data between different components
 */
export abstract class Mapper<T> {
  /**
   * Takes data from persistence layer and create entity
   * @param data Persistency layer data
   */
  public abstract dataToEntity(data: any): T;

  /**
   * Serializes entity into persistence layer data
   * @param entity Entity
   */
  public abstract entityToData(entity: T): any;

  /**
   * Basic scalar mapper. Converts scalar value of one type
   * to scalar value of another type. Will work with any primitive type
   * constructor such as String(value: any), Number(value: any), Boolean(value: any), Date(value: any)
   * @param type Scalar type to convert to, i.e String, Number, Boolean etc.
   * @param val Value to convert
   * @returns Converted value into type
   */
  protected scalar<S>(type: { (v: any): S }, val: any) {
    return type(val);
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
      return vals.map((val: any) => type(val));
    } else {
      return undefined;
    }
  }

  /**
   * Converts string value of enum, that would typically come from
   * an enum type, into actual enum value
   * @param e Enum, for example
   * ```
   * enum SomeEnum {
   *  First = 1,
   *  Second = 2
   * }
   * ```
   * @param key String key in the enum, such as `'First'`
   * @returns Value of the key in the enum, such as `1`
   */
  protected stringToEnum<E extends { [name: string]: any }>(e: E, key: string) {
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
   * @param keys array of string keys in the enum, such as `['First', 'Second']`
   * @returns Array of values of the keys in the enum, such as `[1, 2]`
   */
  protected stringArrayToEnum<E extends { [name: string]: any }>(
    e: E,
    keys: string[]
  ) {
    if (keys && keys instanceof Array) {
      return keys.map((key: string) => e[key]);
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
      return m.dataToEntity(data);
    } else {
      return undefined;
    }
  }

  /**
   * Invokes mapper of another type on array of object data of this type
   * @param mapper Mapper  of type M
   * @param data Array of object data
   * @returns Array of entities of type E
   */
  protected objectArrayToEntity<E, M extends Mapper<E>>(
    mapper: { new (): M },
    dataArray: any[]
  ) {
    if (dataArray && dataArray instanceof Array) {
      const m = new mapper();
      return dataArray.map((data: any) => m.dataToEntity(data));
    } else {
      return undefined;
    }
  }
}
