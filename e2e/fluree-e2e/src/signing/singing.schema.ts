export interface CreateSampleRequest {
  auth: string;
  collection: string;
  name: string;
}

export interface SubmitSampleRequest {
  hash: string;
  signature: string;
}

export interface CreateAccountResult {
  privateKey: string;
  publicKey: string;
  authId: string;
}
