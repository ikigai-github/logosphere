import * as path from 'path';
import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';

import {
  ConverterFactory,
  SchemaType,
  GqlFederatedSchema,
} from '../../converters';

import { canonicalSchemaLoader } from '../../schema';

import { GqlGeneratorSchema } from './schema';
import { DEFAULT_LIB_CODEGEN_PREFIX } from '../../common';

interface NormalizedSchema extends GqlGeneratorSchema {
  fileName: string;
  projectName: string;
  libsRoot: string;
  libsDirectory: string;
}

function normalizeOptions(
  tree: Tree,
  options: GqlGeneratorSchema
): NormalizedSchema {
  const fileName = names(options.module).fileName;
  const projectName = `${
    names(options.module).fileName
  }-${DEFAULT_LIB_CODEGEN_PREFIX}`;
  const libsDirectory = projectName;

  const libsRoot = `${
    getWorkspaceLayout(tree).libsDir
  }/${libsDirectory}/src/gql`;

  return {
    ...options,
    fileName,
    projectName,
    libsRoot,
    libsDirectory,
  };
}

function addLibsFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    //...names(options.libsDirectory),
    offsetFromRoot: offsetFromRoot(options.libsRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.libsRoot,
    templateOptions
  );
}

export async function gqlGenerator(tree: Tree, options: GqlGeneratorSchema) {
  const sourceSchema = options.sourceSchema
    ? options.sourceSchema
    : canonicalSchemaLoader(options.module);
  const converter = ConverterFactory.getConverter(
    SchemaType.Canonical,
    SchemaType.Gql
  );
  const result: GqlFederatedSchema[] = converter.convert(sourceSchema);
  result.map(async (fgql: GqlFederatedSchema) => {
    options = {
      ...options,
      source: fgql.schema,
    };
    const normalizedOptions = normalizeOptions(tree, options);
    addLibsFiles(tree, normalizedOptions);
    await formatFiles(tree);
  });
}

export default gqlGenerator;
