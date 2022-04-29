export interface FlureeApi {
  listDbs: string;
  newDb: string;
  transact: string;
  query: string;
}

export const api = (url: string, db?: string): FlureeApi => {
  return {
    listDbs: `${url}/fdb/dbs`,
    newDb: `${url}/fdb/new-db`,
    transact: `${url}/fdb/${db}/transact`,
    query: `${url}/fdb/${db}/query`,
  };
};
