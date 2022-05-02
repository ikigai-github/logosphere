import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';

import generator from './gql';
import { moduleGenerator } from '../module';
import { GqlGeneratorSchema } from './schema';

describe('fluree-schema generator', () => {
  let tree: Tree;
  const options: GqlGeneratorSchema = { module: 'test-sdk' };

  beforeEach( async () => {
    tree = createTreeWithEmptyWorkspace();
    await moduleGenerator(tree, { 
      name: 'test-app',
      compiler: 'tsc'
    })
  });

  it('should run successfully', async () => {
    await generator(tree, options);
  })
});
