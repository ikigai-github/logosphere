/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Mapper<T> {
  toEntity(data: any): T;
  toPersistence(entity: T): any;
}
