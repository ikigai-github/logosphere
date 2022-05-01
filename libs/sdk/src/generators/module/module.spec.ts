import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './module';
import  { NodeLibraryGeneratorSchema }  from './schema';

describe('module generator', () => {
  let appTree: Tree;
  const options: NodeLibraryGeneratorSchema = { 
    name: 'test',
    directory: 'codegen',
    compiler: 'tsc'
  };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'codegen-test');
    expect(config).toBeDefined();
  })
});
