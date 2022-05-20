/* eslint-disable @typescript-eslint/no-empty-interface */
import { Repository } from '@logosphere/domain';
import { Injectable } from "@nestjs/common";
import { 
  compile, 
  ref, 
  select, 
  create, 
  update, 
  remove, 
  FlureeClient } from '@logosphere/fluree';
import { <%= classify(name) %> } from '../../entities';
import { <%= classify(name) %>FlureeMap } from '../../mappers/fluree';

export interface I<%= classify(name) %>Repository extends Repository<<%= classify(name) %>>{}

@Injectable()
export class <%= classify(name) %>Repository {}