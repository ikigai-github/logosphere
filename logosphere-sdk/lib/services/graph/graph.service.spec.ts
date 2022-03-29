import { Test, TestingModule } from '@nestjs/testing';
import { FlureeService } from '../fluree';
import { GraphService } from './graph.service';
import { ConfigModule } from '@nestjs/config';
import { loadConfiguration, Configuration, ModuleConfiguration } from '../../configuration';
import { JsonSchemaParser } from '../../codegen/json-schema';
import * as f from '../../../test/fixtures/schemas/monolith/json-schema.json';
import { CanonicalSchema } from 'lib/codegen';
import { ConsoleLogger } from '@nestjs/common';

const fixturePath = `${__dirname}/../../../test/fixtures`;
const parser = new JsonSchemaParser();
const canonical: CanonicalSchema = parser.parse(f);

describe('Graph Service', () => {
  let graphService: GraphService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GraphService, 
        FlureeService
      ],
      imports: [ConfigModule.forRoot({
        load: [()=>loadConfiguration(fixturePath)]
      })]
    }).compile();

    const config: Configuration = loadConfiguration(fixturePath);
    graphService = module.get<GraphService>(GraphService);
  
  });

  it('should be defined', () => {
    expect(graphService).toBeDefined();
  });

  it('should build a state query', () => {
    
    const select = [];
    graphService.buildStateQuery(canonical, 'listing', select, 1);
    expect(select).toBeDefined();
    expect(select.length > 0).toBe(true);
    
  });

  it('should get graph state from the DB', () => {
    
    console.log('TODO: Implement query state test once there is data in DB')
    
  });

  it('should run custom query from the DB', () => {
    
    console.log('TODO: Implement custom query test once there is data in DB')
    
  });



});