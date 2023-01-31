import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, names, readProjectConfiguration } from '@nrwl/devkit';

import generator from './canonical';
import { moduleGenerator } from '../module';
import { CanonicalGeneratorSchema } from './schema';
import { DEFAULT_LIB_CODEGEN_PREFIX } from '../../common';

describe('canonical schema generator', () => {
  let tree: Tree;
  const options: CanonicalGeneratorSchema = { module: 'testLib' };

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
    await moduleGenerator(tree, {
      name: options.module,
      compiler: 'tsc',
    });
  });

  it('should run successfully', async () => {
    await generator(tree, options);
    const libName = `${
      names(options.module).fileName
    }-${DEFAULT_LIB_CODEGEN_PREFIX}`;
    const config = readProjectConfiguration(tree, libName);
    expect(config).toBeDefined();
    expect(config.root).toBe(libName);
  });

  it('should generate files', async () => {
    await generator(tree, options);
    const fileName = names(options.module).fileName;
    const libName = `${fileName}-${DEFAULT_LIB_CODEGEN_PREFIX}`;
    expect(
      tree.exists(`${libName}/src/canonical/${fileName}-canonical-schema.json`)
    ).toBeTruthy();
  });
});
