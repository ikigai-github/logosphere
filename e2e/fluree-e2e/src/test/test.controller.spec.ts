import { ConfigModule, registerAs } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  command,
  create,
  FlureeClient,
  flureeConfig,
  serialize,
} from '@logosphere/fluree';

let client: FlureeClient;
const ledger = `test/test${new Date().valueOf()}`;

jest.mock('@logosphere/fluree', () => ({
  flureeConfig: registerAs('fluree', () => ({
    url: 'http://localhost:8090',
    ledger,
  })),
  FlureeClient: jest.requireActual('@logosphere/fluree').FlureeClient,
  command: jest.requireActual('@logosphere/fluree').command,
  create: jest.requireActual('@logosphere/fluree').create,
  serialize: jest.requireActual('@logosphere/fluree').serialize,
}));

describe('Fluree client', () => {
  /*
   * Setup a temporary ledger for the tests to ensure predictable results.
   */
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(flureeConfig)],
      providers: [FlureeClient],
    }).compile();

    client = module.get<FlureeClient>(FlureeClient);

    const ledgers = await client.listLedgers();
    if (!ledgers.includes(ledger)) {
      await client.createLedger(ledger);
    }

    let info = await client.ledgerInfo(ledger);
    for (let i = 0; info.status !== 'ready' && i < 3; ++i) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      info = await client.ledgerInfo(ledger);
    }

    if (info.status !== 'ready') {
      throw Error('Timed out waiting for ledger to be ready for tests');
    }
  });

  /**
   * Remove the temporary ledger and close the connection after tests complete
   */
  afterAll(async () => {
    try {
      await client.deleteLedger(ledger);
    } catch (error) {
      console.log(error);
    }

    await client.close();
  });

  it('should accept a query', async () => {
    const result = await client.query({ select: ['*'], from: '_collection' });
    expect(result.length > 0).toBeTruthy();
  });

  it('should accept a transaction', async () => {
    const result = await client.transact([
      {
        _id: '_collection',
        _action: 'add',
        name: 'person',
      },
    ]);

    expect(result.status).toBe(200);

    console.log(JSON.stringify(result));
  });

  it('should accept a command', async () => {
    const collectionName = `thing${Math.floor(Math.random() * 10)}`;
    const txResult = await client.transact([
      {
        _id: '_collection',
        _action: 'add',
        name: collectionName,
      },
      {
        _id: '_predicate',
        _action: 'add',
        name: `${collectionName}/name`,
        type: 'string',
      },
    ]);

    expect(txResult.status).toBe(200);

    const tx = create(collectionName).data({ name: 'something' }).build();
    const cmd = command(ledger, tx);
    const result = await client.command(serialize(cmd));
    expect(result.status).toBe(200);
  });
});
