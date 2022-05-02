import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';
import generator from './dto';
import { moduleGenerator }  from '../module';
import { DtoGeneratorSchema } from './schema';

describe('dto generator', () => {
  let tree: Tree;
  const options: DtoGeneratorSchema = { name: 'wallet', module: 'test-app' };

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
