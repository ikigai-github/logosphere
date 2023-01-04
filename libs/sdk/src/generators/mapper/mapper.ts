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

import { Definition, DefinitionType } from '@logosphere/schema';

import { canonicalSchemaLoader } from '@logosphere/model';

import { tsFormatter } from '../utils';
import { MapperGeneratorSchema } from './schema';
import { DEFAULT_CODEGEN_DIR, DEFAULT_FIXTURE_DEPTH } from '../../common';
import { addImport, addProviderToModule } from '../utils/transforms';

interface NormalizedSchema extends MapperGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  moduleFile: string;
}

function normalizeOptions(
  tree: Tree,
  options: MapperGeneratorSchema
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
    fixtureDepth: options.fixtureDepth || DEFAULT_FIXTURE_DEPTH,
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
      path.join(__dirname, `files/mappers/${options.type}`),
      `${options.projectRoot}/mappers/${options.type}`,
      defOptions
    );

    // update module
    const input = tree.read(options.moduleFile).toString();
    const transformOptions = {
      module: options.module,
      name: `${strings.classify(def.name)}${strings.classify(options.type)}Map`,
      importFile: `./mappers/${strings.dasherize(options.type)}`,
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
  });
}

export async function mapperGenerator(
  tree: Tree,
  options: MapperGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}

export default mapperGenerator;
