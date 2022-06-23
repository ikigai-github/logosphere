export interface FlureeGeneratorSchema {
  module: string;
  tags?: string;
  directory?: string;
  schemaSource?: string;
  schemaTransactSource?: string;
  skipLedgerUpdate?: boolean;
}
