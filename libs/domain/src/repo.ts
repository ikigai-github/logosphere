export interface Repo<T> {
  find(identifier: string): Promise<T>;
  exists(identifier: string): Promise<boolean>;
  save(t: T): Promise<T>;
  delete(identifier: string): Promise<boolean>;
}
