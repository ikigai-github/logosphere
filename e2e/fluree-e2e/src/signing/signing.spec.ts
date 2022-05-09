import { sign_message } from '@fluree/crypto-base';
import { CacheModule } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { FlureeClient, flureeConfig } from '@logosphere/fluree';

import { SingingController } from './signing.controller';
import { AccountController } from '../account';
import { CollectionController } from '../collection';
import { QueryController } from '../query';

import { createLedger, removeLedger } from '../util.spec';

let flureeClient: FlureeClient;
let signClient: SingingController;
let accountClient: AccountController;
let collectionClient: CollectionController;
let queryClient: QueryController;

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
      providers: [
        FlureeClient,
        SingingController,
        AccountController,
        CollectionController,
        QueryController,
      ],
    }).compile();

    flureeClient = module.get<FlureeClient>(FlureeClient);
    signClient = module.get<SingingController>(SingingController);
    accountClient = module.get<AccountController>(AccountController);
    collectionClient = module.get<CollectionController>(CollectionController);
    queryClient = module.get<QueryController>(QueryController);

    await createLedger(flureeClient, ledger);
  });

  afterAll(async () => {
    await removeLedger(flureeClient, ledger);
  });

  it('should accept a signed command', async () => {
    const txResult = await collectionClient.createCollection({
      name: 'signing',
      predicates: [{ name: 'name', type: 'string' }],
    });
    expect(txResult.status).toBe(200);

    const { privateKey, authId } = await accountClient.createAcount();
    expect(privateKey).toBeDefined();
    expect(authId).toBeDefined();

    const { hash, serialized } = await signClient.createSampleSignable({
      auth: authId,
      collection: 'signing',
      name: 'test',
    });

    // FIXME: Replace with hash signing instead of signing message directly
    const signature = sign_message(serialized, privateKey);

    const signResult = await signClient.submitSigned({ hash, signature });
    expect(signResult.status).toBe(200);
    expect(signResult.data).toBeDefined();

    await new Promise((resolve) => setTimeout(resolve, 200));

    // FIXME: I must misunderstand how monitorTx works.  If I immediately call it without
    // a sleep I get a 200 result even though the transaction hasn't completed.  If I do
    // a tiny 50ms sleep before calling it then it does wait for the transaction but
    // the transaction never completes.
    //
    // const txStatus = await signClient.waitTransaction(signResult.data as string, 1000);
    // expect(txStatus.status).toBe(200);

    const queryResult = await queryClient.findAll('signing');
    expect(queryResult.length).toBe(1);
    expect(queryResult[0]['signing/name']).toBe('test');
  }, 30000);
});

function toArrayBuffer(myBuf) {
  const myBuffer = new ArrayBuffer(myBuf.length);
  const res = new Uint8Array(myBuffer);
  for (let i = 0; i < myBuf.length; ++i) {
    res[i] = myBuf[i];
  }
  return myBuffer;
}
