import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';
import generator from './dto';
import { applicationGenerator } from '../application';
import { DtoGeneratorSchema } from './schema';

describe('dto generator', () => {
  let tree: Tree;
  const options: DtoGeneratorSchema = { name: 'wallet', module: 'user', source: '' };

  beforeEach( async () => {
    tree = createTreeWithEmptyWorkspace();
    await applicationGenerator(tree, { name: 'test-app' })
  });

  it('should run successfully', async () => {
    await generator(tree, options);
    expect(tree.exists('apps')).toBeTruthy();
  })
});
