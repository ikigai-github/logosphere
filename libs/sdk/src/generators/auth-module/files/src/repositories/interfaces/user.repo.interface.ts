/* eslint-disable @typescript-eslint/no-empty-interface */
import { Repository } from '@logosphere/sdk';
import { User } from '../../entities';

export interface IUserRepository extends Repository<User> {
  findOneByUsername(username: string): Promise<User>;
}
