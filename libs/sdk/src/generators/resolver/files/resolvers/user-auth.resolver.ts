/* eslint-disable @typescript-eslint/no-explicit-any */
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserAuthDto } from '../dto/user-auth.dto';
import { UserAuthFlureeRepository } from '../repositories/fluree';

@Resolver()
export class UserAuthResolver {
  constructor(private repo: UserAuthFlureeRepository) {}

  @Mutation(() => UserAuthDto)
  async createUserAuth(

    @Args({ name: 'username', type: () => String })
    username: string,

    @Args({ name: 'cardanoPublicKey', type: () => String })
    cardanoPublicKey: string,

    @Args({ name: 'role', type: () => String })
    role: string
  ): Promise<UserAuthDto> {
    const authId = await this.repo.createUserAuth(cardanoPublicKey, role);

    return {
      username,
      cardanoPublicKey,
      authId,
    };
  }

  @Mutation(() => String)
  async createPassword(
    @Args({ name: 'username', type: () => String })
    username: string,

    @Args({ name: 'password', type: () => String })
    password: string
  ): Promise<string> {
    const token = await this.repo.createPassword(username, password);

    return token;
  }

  @Mutation(() => UserAuthDto)
  async createUser(
    @Args({ name: 'username', type: () => String })
    username: string,
    @Args({ name: 'password', type: () => String })
    password: string,
    @Args({ name: 'role', type: () => String })
    role: string
  ): Promise<UserAuthDto> {
    const token = await this.repo.createUser(username, password, role);

    return {
      username,
      token
    }
  }

  @Query(() => String)
  async getLastTxId(
    @Args({ name: 'username', type: () => String }) 
    username: string
  ): Promise<string> {
    return '62864a47f9d68d0a817f7eb8c2edc38c00ff7dda74993ac2860eec20b6e553e6';
  }

  @Query(() => String)
  async loginUser(
    @Args({ name: 'username', type: () => String }) 
    username: string,
    @Args({ name: 'password', type: () => String }) 
    password: string
  ): Promise<string> {
    return await this.repo.loginUser(username, password);
  }
  
}