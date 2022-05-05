import { ConfigModule, registerAs } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs-extra';
import {
  PinataService,
  pinataConfig,
  PinataPinOptions,
} from '@logosphere/ipfs';

let pinata: PinataService;
const filePath = `${__dirname}/ikigai_logo.png`;

jest.mock('@logosphere/ipfs', () => ({
  pinataConfig: registerAs('pinata', () => ({
    apiKey: process.env.PINATA_API_KEY,
    apiSecret: process.env.PINATA_API_SECRET,
    jwt: process.env.PINATA_JWT,
  })),
  PinataService: jest.requireActual('@logosphere/ipfs').PinataService,
}));

describe('IPFS Module', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(pinataConfig)],
      providers: [PinataService],
    }).compile();

    pinata = module.get<PinataService>(PinataService);

    expect(pinata).toBeDefined();
  });

  it('should authenticate', async () => {
    const authenticated = await pinata.testAuthentication();
    expect(authenticated).toBeTruthy();
  });

  it('should upload file from path', async () => {
    const response = await pinata.uploadFile(filePath);
    expect(response.IpfsHash).toBe(
      'QmPrhyaEVcavi3XuP7WHBcD2n8xcUK6mGcF1u6AchXYbgn'
    );
    expect(response.PinSize).toBe(9210);
  });

  it('should upload file from readable stream', async () => {
    const stream: fs.ReadStream = fs.createReadStream(filePath);
    const response = await pinata.uploadFile(stream);
    expect(response.IpfsHash).toBe(
      'QmPrhyaEVcavi3XuP7WHBcD2n8xcUK6mGcF1u6AchXYbgn'
    );
    expect(response.PinSize).toBe(9210);
  });
});
