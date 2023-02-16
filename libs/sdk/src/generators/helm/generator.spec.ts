import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';

describe('helm generator', () => {
  let appTree: Tree;

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(appTree, {
      excludeFluree: false,
      excludeBlockfrost: false,
      excludeWallet: false,
      buildImages: false,
      force: true,
    });
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
  });
});
