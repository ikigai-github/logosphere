import { LogosphereError } from '@logosphere/errors';

export class RepositoryError extends LogosphereError {
  constructor(message: string, error?: any) {
    super(message, error);
  }
}

export interface Repository<T> {
  exists(id: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<T[]>;
  // TODO: implement findBySpec, once it naturally comes up in projects
  // https://ikigai-technologies.atlassian.net/browse/LOG-151
  //findBySpec(spec: QuerySpec): Promise<T[]>;
  findOneById(id: string): Promise<T>;
  findOneBySubjectId(subjectId: string): Promise<T>;
  findManyById(idList: string[]): Promise<T[]>;
  save(entity: T): Promise<T>;
}
