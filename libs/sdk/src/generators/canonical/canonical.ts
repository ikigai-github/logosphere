import * as path from 'path';
import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';

import { canonicalSchemaLoader } from '../../schema';
import { CanonicalGeneratorSchema } from './schema';
import { DEFAULT_LIB_CODEGEN_PREFIX } from '../../common';

interface NormalizedSchema extends CanonicalGeneratorSchema {
  fileName: string;
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
}

function normalizeOptions(
  tree: Tree,
  options: CanonicalGeneratorSchema
): NormalizedSchema {
  const fileName = names(options.module).fileName;
  const projectName = `${fileName}-${DEFAULT_LIB_CODEGEN_PREFIX}`;
  const projectDirectory = projectName;

  const projectRoot = `${
    getWorkspaceLayout(tree).libsDir
  }/${projectDirectory}/src/canonical`;

  return {
    ...options,
    fileName,
    projectName,
    projectRoot,
    projectDirectory,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    name: options.module,
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

export async function canonicalSchemaGenerator(
  tree: Tree,
  options: CanonicalGeneratorSchema
) {
  const sourceSchema = canonicalSchemaLoader(options.module);

  const source = JSON.stringify(sourceSchema, null, 2);
  options = {
    ...options,
    source,
  };
  const normalizedOptions = normalizeOptions(tree, options);
  //console.log(JSON.stringify(normalizedOptions, null, 2));
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}

export default canonicalSchemaGenerator;
