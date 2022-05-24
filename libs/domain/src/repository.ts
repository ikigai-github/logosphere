export interface Repository<T> {
  exists(id: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<T[]>;
  // TODO: implement findBySpec, once it naturally comes up in projects
  // https://ikigai-technologies.atlassian.net/browse/LOG-151
  //findBySpec(spec: QuerySpec): Promise<T[]>;
  findMany(ids: string[]): Promise<T[]>;
  findOne(id: string): Promise<T>;
  save(entity: T): Promise<T>;
}
