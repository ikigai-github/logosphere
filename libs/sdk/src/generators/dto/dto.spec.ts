import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, names, readProjectConfiguration } from '@nrwl/devkit';
import generator from './dto';
import { DEFAULT_LIB_CODEGEN_PREFIX } from '../../common';
import { moduleGenerator } from '../module';
import { definitions } from '../../test/fixtures/code-first/schemas/monolith/canonical/art-marketplace.canonical.schema.json';
import { DtoGeneratorSchema } from './schema';

describe('dto generator', () => {
  let tree: Tree;
  const options: DtoGeneratorSchema = {
    name: 'wallet',
    module: 'testLib',
    definition: definitions[0],
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
    expect(tree.exists(`${libName}/src/dto/index.ts`)).toBeTruthy();
    expect(tree.exists(`${libName}/src/dto/listing.dto.ts`)).toBeTruthy();
    expect(tree.exists(`${libName}/src/dto/keys.dto.ts`)).toBeTruthy();
    expect(tree.exists(`${libName}/src/dto/user-auth.dto.ts`)).toBeTruthy();
  });
});
