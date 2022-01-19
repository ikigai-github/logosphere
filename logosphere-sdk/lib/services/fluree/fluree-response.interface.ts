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