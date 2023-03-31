import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, names, readProjectConfiguration } from '@nrwl/devkit';
import generator from './resolver';
import { moduleGenerator } from '../module';
import { ResolverGeneratorSchema } from './schema';
import { DEFAULT_LIB_CODEGEN_PREFIX } from '../../common';
import { definitions } from '../../test/fixtures/code-first/schemas/monolith/canonical/art-marketplace.canonical.schema.json';

describe('resolver generator', () => {
  let tree: Tree;
  const options: ResolverGeneratorSchema = {
    name: 'wallet',
    module: 'testLib',
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
    //tree.listChanges().map(fc => console.log(fc.path))
  });

  it('should generate files', async () => {
    await generator(tree, options);
    expect(tree.exists(`${libName}/src/resolvers/index.ts`)).toBeTruthy();
    expect(
      tree.exists(`${libName}/src/resolvers/listing.resolver.ts`)
    ).toBeTruthy();
  });
});
