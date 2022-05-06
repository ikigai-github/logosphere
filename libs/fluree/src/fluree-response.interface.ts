import { FlureeObject } from './query';

export interface FlureeResponse {
  transactionId: string;
  blockNumber: number;
  blockHash: string;
  timestamp: number;
  duration: number;
  fuel: number;
  auth: string;
  status: number;
  bytes: number;
  flakes: number;
}

export type FlureeListLedgerResponse = string[];

export type FlureeQueryResponse = FlureeObject;

// Fixme: For compatibility we just remap type here but we can delete once we can fully replace fluree.service with fluree.client
export type FlureeTransactionResponse = FlureeResponse;

export interface FlureeCreateLedgerResponse {
  status: number;
  result: string;
}

export interface FlureeDeleteLedgerResponse {
  status: number;
  result: boolean;
}

export interface FlureeLedgerInfoResponse {
  block?: number;
  flakes?: number;
  index?: number;
  indexed?: number;
  indexes?: object;
  size?: number;
  status: string;
}
