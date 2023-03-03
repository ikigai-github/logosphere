import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';

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
      force: true,
    });
    expect(appTree.exists('helm')).toBe(true);
    expect(appTree.exists('deploy_helm_local.sh')).toBe(true);
    expect(appTree.exists('helm/Chart.yaml')).toBe(true);
    expect(appTree.exists('helm/values.yaml')).toBe(true);
  });
});
