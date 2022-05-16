import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';
import generator from './repository';
import { moduleGenerator } from '../module';
import { RepositoryGeneratorSchema } from './schema';

describe('dto generator', () => {
  let tree: Tree;
  const options: RepositoryGeneratorSchema = {
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
