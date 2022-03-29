import { Injectable, NotImplementedException } from '@nestjs/common';

/**
 * Service dealing with JSON schemas
 */
 @Injectable()
 export class BufferService {

  public async getLatestState(userIdentifier: string, entityIdentifier: string): Promise<Readonly<any>> {
    //TODO: Implement
    throw new NotImplementedException();
  }
   
 }