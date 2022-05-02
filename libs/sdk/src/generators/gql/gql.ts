import * as path from 'path';
import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree
} from '@nrwl/devkit';

import { 
  ConverterFactory, 
  SchemaType, 
  canonicalSchemaLoader,
  GqlFederatedSchema
} from '@logosphere/converters';
import { GqlGeneratorSchema } from './schema';
import { DEFAULT_CODEGEN_DIR } from '../../common';

interface NormalizedSchema extends GqlGeneratorSchema {
  projectName: string;
  appsRoot: string;
  appsDirectory: string;
  libsRoot: string;
  libsDirectory: string;
}

function normalizeOptions(tree: Tree, options: GqlGeneratorSchema): NormalizedSchema {
  const name = names(options.module).fileName;
  const projectName = options.module; 
  const workspace = getWorkspaceLayout(tree);
  const libsRoot = `${workspace.libsDir}/${DEFAULT_CODEGEN_DIR}/${options.module}/src`;
  const libsDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : `gql/${name}`;
  const appsRoot = `${workspace.appsDir}/${options.module}/src`;
  const appsDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : `app/${name}`;

  return {
    ...options,
    projectName,
    libsRoot,
    libsDirectory,
    appsRoot,
    appsDirectory
  };
}

function addLibsFiles(tree: Tree, options: NormalizedSchema) {
    const templateOptions = {
      ...options,
      ...names(options.libsDirectory),
      offsetFromRoot: offsetFromRoot(options.libsRoot),
      template: ''
    };
    generateFiles(tree, path.join(__dirname, 'files'), options.libsRoot, templateOptions);
}

function addAppsFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.appsDirectory),
    offsetFromRoot: offsetFromRoot(options.appsRoot),
    template: ''
  };
  generateFiles(tree, path.join(__dirname, 'files'), options.appsRoot, templateOptions);
}

export default async function (tree: Tree, options: GqlGeneratorSchema) {
  const sourceSchema = canonicalSchemaLoader();
  const converter =  ConverterFactory.getConverter(
          SchemaType.Canonical,
          SchemaType.Gql,
        )
  const result: GqlFederatedSchema[]  = converter.convert(sourceSchema);
  result.map(async (fgql: GqlFederatedSchema) => {
    options = {
      ...options,
      source: fgql.schema
    }
    const normalizedOptions = normalizeOptions(tree, options);
    addLibsFiles(tree, normalizedOptions);
    addAppsFiles(tree, normalizedOptions);
    await formatFiles(tree);
  });
}
