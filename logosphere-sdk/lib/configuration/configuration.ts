export interface ModuleConfiguration {
  name: string;
  jsonSchemaFile: string;
  fluree: FlureeConfiguration
}

export interface FlureeConfiguration {
  ledgerUrl: string;
  queryUrl: string;
  network: string;
  db: string;
}

export interface Configuration {
  
  modules: ModuleConfiguration[];
}

export interface DefaultConfiguration {
  fluree: FlureeConfiguration
}
