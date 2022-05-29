import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './api';
import { ApiGeneratorSchema } from './schema';

describe('api generator', () => {
  let appTree: Tree;
  const options: ApiGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'codegen-test');
    expect(config).toBeDefined();
  });
});
