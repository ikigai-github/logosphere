export interface SchemaOptions {
  /**
   * Type of the schema to generate
   */
  schemaType: 'gql' | 'fluree' | 'canonical';
  /**
   * Module to generate schema for
   */
  module: string;
  /**
   * Directory with input JSON schema 
   */
  inputDirectory?: string;
  /**
   * Schema file in Hackolade internal format
   */
  hackoladeSchemaFile?: string;
  /**
   * Schema file in JSON Schema standard format
   */
  jsonSchemaFile: string;
   /**
   * Directory with output target schema 
   */
  outputDirectory?: string;
}