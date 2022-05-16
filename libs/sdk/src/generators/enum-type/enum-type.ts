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
  Definition,
  SchemaType,
  canonicalSchemaLoader,
  DefinitionType,
} from '@logosphere/converters';
import { EnumTypeGeneratorSchema } from './schema';
import { DEFAULT_CODEGEN_DIR } from '../../common';

interface NormalizedSchema extends EnumTypeGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
}

function normalizeOptions(
  tree: Tree,
  options: EnumTypeGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = options.module; //projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${
    getWorkspaceLayout(tree).libsDir
  }/${DEFAULT_CODEGEN_DIR}/${options.module}/src`;

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.projectDirectory),
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

export default async function (tree: Tree, options: EnumTypeGeneratorSchema) {
  const sourceSchema = canonicalSchemaLoader();
  sourceSchema.definitions
    .filter((def: Definition) => def.type === DefinitionType.Enum)
    .map(async (def: Definition) => {
      options = {
        ...options,
        name: def.name,
        definition: def,
      };
      const normalizedOptions = normalizeOptions(tree, options);
      addFiles(tree, normalizedOptions);
      await formatFiles(tree);
    });
}
