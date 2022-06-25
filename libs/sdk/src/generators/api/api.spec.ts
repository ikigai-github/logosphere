import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './api';
import { ApiGeneratorSchema } from './schema';

describe('api generator', () => {
  let appTree: Tree;
  const options: ApiGeneratorSchema = {
    module: 'test',
    flureeLedger: false,
  };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
  });
});
