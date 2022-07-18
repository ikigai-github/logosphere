import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';
import generator from './unreal';
import { moduleGenerator } from '../module';
import { UnrealEngineGeneratorSchema } from './schema';

describe('enum type generator', () => {
  let tree: Tree;
  const options: UnrealEngineGeneratorSchema = {
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
