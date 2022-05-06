import { ConfigModule, registerAs } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  command,
  create,
  FlureeClient,
  flureeConfig,
  serialize,
} from '@logosphere/fluree';

import { createCollection, createLedger, removeLedger } from '../util.spec';

let client: FlureeClient;
const ledger = `test/test${new Date().valueOf()}`;

jest.mock('@logosphere/fluree', () => {
  const original = jest.requireActual('@logosphere/fluree');
  return {
    ...original,
    flureeConfig: registerAs('fluree', () => ({
      url: 'http://localhost:8090',
      ledger,
    })),
  };
});

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

    await createLedger(client, ledger);
  });

  /**
   * Remove the temporary ledger and close the connection after tests complete
   */
  afterAll(async () => {
    await removeLedger(client, ledger);
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
    const txResult = await createCollection(client, 'cmdtest');
    expect(txResult.status).toBe(200);

    const tx = create('cmdtest').data({ name: 'something' }).build();
    const cmd = command(ledger, tx);
    const result = await client.command(serialize(cmd));
    expect(result.status).toBe(200);
  });
});
