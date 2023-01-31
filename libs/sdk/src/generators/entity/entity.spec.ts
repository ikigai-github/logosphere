import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, names, readProjectConfiguration } from '@nrwl/devkit';
import generator from './entity';
import { moduleGenerator } from '../module';
import { EntityGeneratorSchema } from './schema';
import { definitions } from '../../test/fixtures/code-first/schemas/monolith/canonical/art-marketplace.canonical.schema.json';
import { DEFAULT_LIB_CODEGEN_PREFIX } from '../../common';

describe('Entities generator', () => {
  let tree: Tree;
  const options: EntityGeneratorSchema = {
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
    //console.log(tree.listChanges().map(fc => console.log(fc.path)));
  });

  it('should generate files', async () => {
    await generator(tree, options);
    expect(tree.exists(`${libName}/src/entities/index.ts`)).toBeTruthy();
    expect(
      tree.exists(`${libName}/src/entities/listing.entity.ts`)
    ).toBeTruthy();
    expect(
      tree.exists(`${libName}/src/entities/tests/listing.entity.spec.ts`)
    ).toBeTruthy();
  });
});
