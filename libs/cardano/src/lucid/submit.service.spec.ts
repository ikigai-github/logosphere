import { SubmitService } from './submit.service';

jest.mock('./lucid.cardano', () => ({
  LucidCardano: {
    getImport: jest.fn(async () => ({
      fromHex: jest.fn((cbor: string) => `hex_${cbor}`),
    })),
  },
}));

global.fetch = async (url: string, body?: any) => ({
  json: async () => `${body.body}_response`,
} as Response);

describe('SubmitService', () => {
  const submitService = new SubmitService();

  it('should submit cbor', async () => {
    // GIVEN
    const mockCbor = 'MockCbor';
    // WHEN
    const result = await submitService.submit(mockCbor);
    // THEN
    expect(result).toBe(`hex_${mockCbor}_response`);
  });
});
