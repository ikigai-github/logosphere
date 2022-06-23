import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';

import generator from './fluree';
import { moduleGenerator } from '../module';
import { FlureeGeneratorSchema } from './schema';

describe('fluree-schema generator', () => {
  let tree: Tree;
  const options: FlureeGeneratorSchema = {
    module: 'test-sdk',
    skipLedgerUpdate: true,
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
