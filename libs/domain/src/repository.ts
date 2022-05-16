export interface Repository<T> {
  findAll(): Promise<T[]>;
  findBySpec(): Promise<T[]>;
  findOne(identifier: string): Promise<T>;
  delete(identifier: string): Promise<boolean>;
  exists(identifier: string): Promise<boolean>;
  save(t: T): Promise<T>;
}
