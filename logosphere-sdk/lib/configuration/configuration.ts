
export interface ModuleConfiguration {
  name: string;
  hackoladeSchemaFile?: string;
  jsonSchemaFile: string;
}

export interface Configuration {
  modules: ModuleConfiguration[];
}
