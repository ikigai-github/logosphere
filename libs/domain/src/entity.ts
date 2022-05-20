/* eslint-disable @typescript-eslint/no-explicit-any */
import { SHA256Identifier } from './sha256-identifier';

const isEntity = (v: any): v is Entity<any> => {
  return v instanceof Entity;
};

export interface EntityProps {
  id?: string;
  subjectId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class Entity<T extends EntityProps> {
  protected readonly _id: SHA256Identifier;

  public readonly props: T;

  constructor(props: T) {
    this._id = props.id
      ? new SHA256Identifier(props.id)
      : new SHA256Identifier(props);
    this.props = { ...props };
    this.props.id = this._id.toString();
    this.props.createdAt = props.createdAt ? props.createdAt : new Date();
    this.props.updatedAt = props.updatedAt
      ? props.updatedAt
      : this.props.createdAt;
  }

  public get id(): string {
    return this._id.toString();
  }

  public get subjectId(): string {
    return this.props.subjectId;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
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
