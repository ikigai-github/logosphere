import { sign_message } from '@fluree/crypto-base';
import { ConfigModule, registerAs } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { FlureeClient, flureeConfig } from '@logosphere/fluree';

import { SingingController } from './signing.controller';
import {
  createAccount,
  createCollection,
  createLedger,
  removeLedger,
} from '../util.spec';
import { CacheModule } from '@nestjs/common';

let client: FlureeClient;
let controller: SingingController;
const ledger = `test/signing${new Date().valueOf()}`;

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

describe('Fluree signing', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(flureeConfig), CacheModule.register()],
      providers: [FlureeClient, SingingController],
    }).compile();

    client = module.get<FlureeClient>(FlureeClient);
    controller = module.get<SingingController>(SingingController);

    await createLedger(client, ledger);
  });

  afterAll(async () => {
    await removeLedger(client, ledger);
  });

  it('should accept a signed command', async () => {
    const txResult = await createCollection(client, 'signing');
    expect(txResult.status).toBe(200);

    const { priv, auth } = await createAccount(client);
    expect(priv).toBeDefined();
    expect(auth).toBeDefined();

    const { hash, serialized } = await controller.getSampleSignable(
      auth,
      'signing',
      'test'
    );

    const signature = sign_message(serialized, priv);
    const result = await controller.submitSigned({ hash, signature });
    expect(result.status).toBe(200);
    expect(result.data).toBeDefined();

    // TODO: The `result.data` is the txid so might be a way to query that to see its status rather than blind wait
    await new Promise((resolve) => setTimeout(resolve, 200));

    const queryResult = await client.query({ select: ['*'], from: 'signing' });
    expect(queryResult.length).toBe(1);
    expect(queryResult[0]['signing/name']).toBe('test');
  });
});
