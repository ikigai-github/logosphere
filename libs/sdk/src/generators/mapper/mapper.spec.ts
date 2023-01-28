import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, names, readProjectConfiguration } from '@nrwl/devkit';
import generator from './mapper';
import { moduleGenerator } from '../module';
import { MapperGeneratorSchema } from './schema';
import { definitions } from '../../test/fixtures/code-first/schemas/monolith/canonical/art-marketplace.canonical.schema.json';
import { DEFAULT_LIB_CODEGEN_PREFIX } from '../../common';

describe('mapper generator', () => {
  let tree: Tree;
  const options: MapperGeneratorSchema = {
    name: 'wallet',
    module: 'testLib',
    type: 'dto',
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
    expect(tree.exists(`${libName}/src/mappers/fluree/index.ts`)).toBeTruthy();
    expect(tree.exists(`${libName}/src/mappers/dto/index.ts`)).toBeTruthy();
    expect(
      tree.exists(`${libName}/src/mappers/dto/listing.dto.map.ts`)
    ).toBeTruthy();
    expect(
      tree.exists(`${libName}/src/mappers/dto/tests/listing.dto.map.spec.ts`)
    ).toBeTruthy();
  });
});
