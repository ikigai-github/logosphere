import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';
import generator from './entity';
import { moduleGenerator } from '../module';
import { EntityGeneratorSchema } from './schema';

describe('Entities generator', () => {
  let tree: Tree;
  const options: EntityGeneratorSchema = { name: 'wallet', module: 'test-app' };

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
