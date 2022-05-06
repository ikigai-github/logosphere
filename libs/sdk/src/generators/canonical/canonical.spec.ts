import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';

import generator from './canonical';
import { moduleGenerator } from '../module';
import { CanonicalGeneratorSchema } from './schema';

describe('canonical schema generator', () => {
  let tree: Tree;
  const options: CanonicalGeneratorSchema = { module: 'test-sdk' };

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
