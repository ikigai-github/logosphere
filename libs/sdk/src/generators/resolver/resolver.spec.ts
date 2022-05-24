import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';
import generator from './resolver';
import { moduleGenerator } from '../module';
import { ResolverGeneratorSchema } from './schema';

describe('resolver generator', () => {
  let tree: Tree;
  const options: ResolverGeneratorSchema = {
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
