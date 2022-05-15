import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';
import generator from './enum-type';
import { moduleGenerator } from '../module';
import { EnumTypeGeneratorSchema } from './schema';

describe('enum type generator', () => {
  let tree: Tree;
  const options: EnumTypeGeneratorSchema = {
    name: 'wallet',
    module: 'test-app',
  };

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
    await moduleGenerator(tree, {
      name: 'test-app',
      compiler: 'tsc',
    });
  });

  it('should run successfully', async () => {
    await generator(tree, options);
  });
});
