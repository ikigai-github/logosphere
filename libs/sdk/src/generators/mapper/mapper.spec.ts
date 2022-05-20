import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';
import generator from './mapper';
import { moduleGenerator } from '../module';
import { MapperGeneratorSchema } from './schema';

describe('dto generator', () => {
  let tree: Tree;
  const options: MapperGeneratorSchema = {
    name: 'wallet',
    module: 'test-app',
    persistence: 'fluree',
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
