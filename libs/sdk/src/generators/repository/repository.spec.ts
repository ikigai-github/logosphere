import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, names, readProjectConfiguration } from '@nrwl/devkit';
import generator from './repository';
import { moduleGenerator } from '../module';
import { RepositoryGeneratorSchema } from './schema';
import { definitions } from '../../test/fixtures/code-first/schemas/monolith/canonical/art-marketplace.canonical.schema.json';
import { DEFAULT_LIB_CODEGEN_PREFIX } from '../../common';

describe('repository generator', () => {
  let tree: Tree;
  const options: RepositoryGeneratorSchema = {
    name: 'wallet',
    module: 'testLib',
    type: 'fluree',
    definition: definitions[0],
    index: definitions,
  };

  const libName = `${
    names(options.module).fileName
  }-${DEFAULT_LIB_CODEGEN_PREFIX}`;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
    await moduleGenerator(tree, {
      name: options.module,
      compiler: 'tsc',
    });
  });

  it('should run successfully', async () => {
    await generator(tree, options);
    const config = readProjectConfiguration(tree, libName);
    expect(config).toBeDefined();
    expect(config.root).toBe(libName);
  });

  it('should generate files', async () => {
    await generator(tree, options);
    expect(
      tree.exists(`${libName}/src/repositories/fluree/index.ts`)
    ).toBeTruthy();
    expect(
      tree.exists(`${libName}/src/repositories/interfaces/index.ts`)
    ).toBeTruthy();
    expect(
      tree.exists(`${libName}/src/repositories/fluree/listing.fluree.repo.ts`)
    ).toBeTruthy();
    expect(
      tree.exists(`${libName}/src/repositories/fluree/user-auth.fluree.repo.ts`)
    ).toBeTruthy();
  });
});
