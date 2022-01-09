export interface SchemaOptions {
  /**
   * Type of the schema to generate
   */
  schemaType: 'gql' | 'fluree' | 'canonical';
  /**
   * Module to generate schema for
   */
  module: string;
  
}