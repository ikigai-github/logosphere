import { Test, TestingModule } from '@nestjs/testing';
import { FlureeService } from './fluree.service';
import { FlureeResponse } from './fluree-response.interface';

describe('FlureeService', () => {
  let fluree: FlureeService;
  const url = 'http://localhost:8090';
  const testDb = 'test/testdb';
  const testCollection = `testCollection${Date.now()}`;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlureeService],
      // imports: [ConfigModule.forRoot({
      //   load: [()=>loadConfiguration(`${__dirname}/../../../test/fixtures`)]
      // })]
    }).compile();

    // const config: Configuration = loadConfiguration(`${__dirname}/../../../test/fixtures`);
    // const userModule: ModuleConfiguration = config.modules['user'];
    // const url = userModule.flureeLedgerEndpoint;
    // const network = userModule.flureeNetwork;
    // const db = userModule.flureeDb;

    fluree = module.get<FlureeService>(FlureeService);
  });

  it('should be defined', () => {
    expect(fluree).toBeDefined();
  });

  it('should create new db', async () => {
    const dbs = await fluree.listDBs(url);
    if (!dbs.find((db: string) => db === testDb)) {
      const id = await fluree.createDB(url, testDb);
      expect(id).toBeDefined();
      expect(id).toHaveLength(64);
    } else {
      console.log(`DB ${testDb} already created. Skipping`);
    }
  });

  it('should list dbs', async () => {
    const dbs = await fluree.listDBs(url);
    expect(dbs).toBeDefined();
    expect(dbs.length > 0).toBe(true);
  });

  it('should create collection', async () => {
    const transact = [
      {
        _id: '_collection',
        name: testCollection,
      },
    ];
    const response: FlureeResponse = await fluree.transact(
      url,
      testDb,
      transact
    );
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.transactionId).toBeDefined();
    expect(response.transactionId).toHaveLength(64);
    expect(response.blockNumber > 0).toBe(true);
    expect(response.blockHash).toBeDefined();
    expect(response.blockHash).toHaveLength(64);
    expect(response.duration > -1).toBe(true);
    expect(response.fuel > -1).toBe(true);
    expect(response.bytes > -1).toBe(true);
    expect(response.flakes > -1).toBe(true);

    //console.log(response)
  });

  it('should query collection', async () => {
    const query = { select: ['*'], from: '_collection' };

    const response = await fluree.query(url, testDb, query);
    expect(response).toBeDefined();
    expect(response.length > 0).toBe(true);
    //console.log(response);
  });
});
