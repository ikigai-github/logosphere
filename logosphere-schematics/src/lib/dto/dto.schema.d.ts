import { Path } from '@angular-devkit/core';

export interface DtoOptions {
  /**
   * The name of the class.
   */
  name: string;
  /**
   * The path to create the class.
   */
  path?: string | Path;
  /**
   * Application language.
   */
  language?: string;
  /**
   * The source root path.
   */
  sourceRoot?: string;
  /**
   * Specifies if a spec file is generated.
   */
  spec?: boolean;
  /**
   * Flag to indicate if a directory is created.
   */
  flat?: boolean;
  /**
   * Class name to be used internally.
   */
  className?: string;
  /**
   * Content of the file 
   */
  content?: string;
}