export interface ModuleConfiguration {
  /**
   * Name of the module
   */
  name: string;
  
  /**
   * Path to JSON schema file with domain definitions
   */
  jsonSchemaFile: string;

  /**
   * Fluree configuration
   */
  fluree: FlureeConfiguration
}

export interface FlureeConfiguration {
  /**
   * Endpoint URL of a ledger server
   */
  ledgerUrl: string;
  /**
   * Endpoint URL of a query server
   */
  queryUrl: string;
  /**
   * Network name
   */
  network: string;
  /**
   * Database (ledger) name
   */
  db: string;
}

export interface Configuration {
  /**
  * For internal use. It will contain the path the config file is loaded from at runtime
  */
  _configPath?: string;

  /**
   * Modules configuration
   */
  modules: ModuleConfiguration[];
}

