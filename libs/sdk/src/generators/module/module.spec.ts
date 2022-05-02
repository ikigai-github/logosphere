import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './module';
import  { NodeLibraryGeneratorSchema }  from './schema';

describe('module generator', () => {
  let tree: Tree;
  const options: NodeLibraryGeneratorSchema = { 
    name: 'test',
    directory: 'codegen',
    compiler: 'tsc'
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(tree, options);
    const config = readProjectConfiguration(tree, 'codegen-test');
    expect(config).toBeDefined();
  });

  it('should generate files', async () => {
    await generator(tree, options);
    expect(tree.exists(`libs/${options.directory}/${options.name}/package.json`)).toBeTruthy();
    expect(tree.exists(`libs/${options.directory}/${options.name}/src/${options.name}.config.json`)).toBeTruthy();
    expect(tree.exists(`libs/${options.directory}/${options.name}/src/${options.name}.model.ts`)).toBeTruthy();
    expect(tree.exists(`libs/${options.directory}/${options.name}/src/${options.name}.test-data.json`)).toBeTruthy();
  });

});
