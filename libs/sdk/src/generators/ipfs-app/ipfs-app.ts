import type { GeneratorCallback, Tree } from '@nrwl/devkit';
import { convertNxGenerator, formatFiles } from '@nrwl/devkit';
import { applicationGenerator as nodeApplicationGenerator } from '@nrwl/node';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { DEFAULT_LIB_CODEGEN_PREFIX } from '../../common';
import { initGenerator } from '../init/init';
import {
  normalizeOptions,
  toNodeApplicationGeneratorOptions,
  updateTsConfigApp,
  updateTsConfigSpec,
} from '../application/lib';
import { createFiles } from './lib';
import type { ApplicationGeneratorOptions } from './schema';

export async function ipfsApplicationGenerator(
  tree: Tree,
  rawOptions: ApplicationGeneratorOptions
): Promise<GeneratorCallback> {
  const options = normalizeOptions(tree, rawOptions);
  const initTask = await initGenerator(tree, {
    unitTestRunner: options.unitTestRunner,
    skipFormat: true,
  });

  const nodeApplicationTask = await nodeApplicationGenerator(
    tree,
    toNodeApplicationGeneratorOptions(options)
  );

  createFiles(tree, options, DEFAULT_LIB_CODEGEN_PREFIX);
  updateTsConfigApp(tree, options);
  updateTsConfigSpec(tree, options);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(initTask, nodeApplicationTask);
}

export default ipfsApplicationGenerator;

export const ipfsApplicationSchematic = convertNxGenerator(
  ipfsApplicationGenerator
);
