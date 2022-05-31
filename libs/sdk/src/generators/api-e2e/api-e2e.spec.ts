import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './api-e2e';
import { ApiE2eGeneratorSchema } from './schema';

describe('api-e2e generator', () => {
  let appTree: Tree;
  const options: ApiE2eGeneratorSchema = { module: 'test' };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test-e2e');
    expect(config).toBeDefined();
  });
});
