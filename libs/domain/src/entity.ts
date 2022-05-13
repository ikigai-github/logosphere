/* eslint-disable @typescript-eslint/no-explicit-any */
import { SHA256Identifier } from './sha256-identifier';

const isEntity = (v: any): v is Entity<any> => {
  return v instanceof Entity;
};

export abstract class Entity<T> {
  protected readonly _id: SHA256Identifier;
  public readonly props: T;

  constructor(props: T, id?: string) {
    this._id = id ? new SHA256Identifier(id) : new SHA256Identifier(props);
    this.props = props;
  }

  public get id(): string {
    return this._id.toString();
  }

  public equals(object?: Entity<T>): boolean {
    if (object == null || object == undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!isEntity(object)) {
      return false;
    }

    return this._id.equals(object._id);
  }
}
