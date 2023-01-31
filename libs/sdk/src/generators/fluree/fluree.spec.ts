import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, names, readProjectConfiguration } from '@nrwl/devkit';

import generator from './fluree';
import { moduleGenerator } from '../module';
import { FlureeGeneratorSchema } from './schema';
import { DEFAULT_LIB_CODEGEN_PREFIX } from '../../common';

describe('fluree-schema generator', () => {
  let tree: Tree;
  const options: FlureeGeneratorSchema = {
    module: 'testLib',
    flureeLedger: false,
  };

  const fileName = names(options.module).fileName;
  const libName = `${
    names(options.module).fileName
  }-${DEFAULT_LIB_CODEGEN_PREFIX}`;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
    await moduleGenerator(tree, {
      name: options.module,
      compiler: 'tsc',
    });
  });

  it('should run successfully', async () => {
    await generator(tree, options);
    const config = readProjectConfiguration(tree, libName);
    expect(config).toBeDefined();
    expect(config.root).toBe(libName);
  });

  it('should generate files', async () => {
    await generator(tree, options);
    expect(
      tree.exists(`${libName}/src/fluree/${fileName}-fluree-schema.json`)
    ).toBeTruthy();
    expect(
      tree.exists(
        `${libName}/src/fluree/${fileName}-fluree-schema-transact.json`
      )
    ).toBeTruthy();
  });
});
