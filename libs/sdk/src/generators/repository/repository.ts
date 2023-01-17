/* eslint-disable no-restricted-imports */
import * as path from 'path';
import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';

import { strings } from '@angular-devkit/core';
import { applyTransform } from 'jscodeshift/src/testUtils';

import {
  Definition,
  DefinitionType,
  canonicalSchemaLoader,
} from '../../schema';

import { tsFormatter } from '../utils';
import { RepositoryGeneratorSchema } from './schema';
import { DEFAULT_CODEGEN_DIR } from '../../common';
import { addImport, addProviderToModule } from '../utils/transforms';

interface NormalizedSchema extends RepositoryGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  moduleFile: string;
}

function normalizeOptions(
  tree: Tree,
  options: RepositoryGeneratorSchema
): NormalizedSchema {
  const module = names(options.module).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${module}`
    : module;
  const projectName = options.module;
  const projectRoot = `${
    getWorkspaceLayout(tree).libsDir
  }/${DEFAULT_CODEGEN_DIR}/${options.module}/src`;
  const moduleFile = path.join(projectRoot, `${options.module}.module.ts`);

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    moduleFile,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const sourceSchema = canonicalSchemaLoader(options.module);
  const definitions = sourceSchema.definitions.filter(
    (def: Definition) => def.type === DefinitionType.Entity
  );

  const templateOptions = {
    ...options,
    ...strings,
    ...tsFormatter,
    ...names(options.projectDirectory),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
    index: definitions,
  };

  definitions.map(async (def: Definition) => {
    const defOptions = {
      ...templateOptions,
      name: names(def.name).fileName,
      definition: def,
    };
    generateFiles(
      tree,
      path.join(__dirname, `files/repositories/${options.type}`),
      `${options.projectRoot}/repositories/${options.type}`,
      defOptions
    );

    // update module
    if (options.type != 'interfaces') {
      const input = tree.read(options.moduleFile).toString();
      const transformOptions = {
        module: options.module,
        name: `${strings.classify(def.name)}${strings.classify(
          options.type
        )}Repository`,
        importFile: `./repositories/${strings.dasherize(options.type)}`,
      };
      let output = applyTransform(
        { default: addImport, parser: 'ts' },
        transformOptions,
        { source: input, path: options.moduleFile }
      );

      output = applyTransform(
        { default: addProviderToModule, parser: 'ts' },
        transformOptions,
        { source: output, path: options.moduleFile }
      );

      tree.write(options.moduleFile, output, {});
    }
  });
}

export async function repositoryGenerator(
  tree: Tree,
  options: RepositoryGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}

export default repositoryGenerator;
