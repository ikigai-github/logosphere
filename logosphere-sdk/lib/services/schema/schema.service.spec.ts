import { Test, TestingModule } from '@nestjs/testing';
import { SchemaService } from './schema.service';
import { loadConfiguration, Configuration, ModuleConfiguration } from '../../configuration';

describe('SchemaService', () => {
  let schemaService: SchemaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ SchemaService ],
    }).compile();

    schemaService = module.get<SchemaService>(SchemaService);
  });

  it('should be defined', () => {
    expect(schemaService).toBeDefined();
  });

  it('should return canonical schema', () => {
    const canonical = schemaService.canonical(`${__dirname}/../../../test/fixtures`);
    

  });



  
});
