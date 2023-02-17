import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';
import { DockerComposeGeneratorSchema } from './schema';
import generator from './generator';

describe('docker-compose generator', () => {
  let appTree: Tree;

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(appTree);
    expect(appTree.exists('package.json')).toBeTruthy();
  });
});
