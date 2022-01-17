export interface SchemaOptions {
  /**
   * Name of the schema
   */
  name: string;
  /**
   * Logosphere element type name
   */
  type?: string;
  /**
   * Type of the schema to generate
   */
  schemaType: 'gql' | 'gqlFederated' | 'fluree' | 'canonical';
  /**
   * Module to generate schema for
   */
  module: string;
  /**
   * The path to create the schema.
   */
  path?: string;
  /**
   * The source root path
   */
  sourceRoot?: string;
  /**
   * "Specifies if a spec file is generated.
   */
  spec?: boolean;

  /**
   * Flag to indicate if a directory is created
   */
  flat?: boolean;
  /**
   * Generated schema content
   */
  content?: string;

}