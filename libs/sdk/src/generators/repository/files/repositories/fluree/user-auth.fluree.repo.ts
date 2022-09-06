/* eslint-disable @typescript-eslint/no-empty-interface */
import { Injectable } from '@nestjs/common';
import { generateKeyPair, getSinFromPublicKey } from '@fluree/crypto-utils';
import { 
  compile,
  selectOne, 
  FlureeClient 
} from '@logosphere/fluree';

@Injectable()
export class UserAuthFlureeRepository {
  constructor(private fluree: FlureeClient) {}

  public async createUserAuth(
    publicKey: string,
    role: string
  ): Promise<string> {
    const authId = await this.fluree.createUserAuth(publicKey, role);
    return authId;
  }

  public async createPassword(
    username: string, 
    password: string
  ): Promise<string> {
    return await this.fluree.createPassword(username, password);
  }

  public async userExists(username: string): Promise<boolean> {
    const query = selectOne('_user/username')
      .where(`_user/username = '${username}'`)
      .build();
    const fql = compile(query);
    const result = await this.fluree.query(fql);
    console.log(`Result: ${JSON.stringify(result)}`)
    return !!result && result['_user/username'] === username;
  }

  public async roleExists(role: string): Promise<boolean> {
    const query = selectOne('_role/id')
      .where(`_role/id = '${role}'`)
      .build();
    const fql = compile(query);
    const result = await this.fluree.query(fql);
    return !!result && result['_role/id'] === role;
  }


  public async createUser(
    username: string,
    password: string,
    role: string
  ): Promise<string> {
    const { publicKey, privateKey }  = generateKeyPair();
    const authId = getSinFromPublicKey(publicKey);

    const userExists = await this.userExists(username);
    const roleExists = await this.roleExists(role);

    let token;

    if (! roleExists) {
      const tx = [
        {
          _id: `_role$${role}`,
          id: role
        }
      ];

      const response = await this.fluree.transactRaw(tx);
      if (response.status === 200) {
        console.log(
          `Role ${role} created successfully`
        );
      } else {
        console.log('Creating role failed');
        console.log(JSON.stringify(tx, null, 2));
      }

    }

    if (! userExists) {
      const tx = [
        {
          _id: '_auth$1',
          id: authId,
          roles: [['_role/id', role]]
        },
        {
          _id: `_user$${username}`,
          auth: '_auth$1',
          salt: Buffer.from(Math.random().toString()).toString("base64").substring(10,15),
          username: username
        }
      ];
      const response = await this.fluree.transactRaw(tx);
      if (response.status === 200) {
        token =  await this.fluree.createPassword(username, password);
        console.log(
          `User ${username} created successfully`
        );

      } else {
        console.log('Creating user failed');
        console.log(JSON.stringify(tx, null, 2));
      }

      
    } else {
      console.log(`User ${username} already exists`);
      token = await this.fluree.loginUser(username, password);
    }

    return token;

  }

  public async loginUser(
    username: string,
    password: string
  ): Promise<string> {
    
    return await this.fluree.loginUser(username, password); 
  }

}
