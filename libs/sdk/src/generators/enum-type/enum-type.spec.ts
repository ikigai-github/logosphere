import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, names, readProjectConfiguration } from '@nrwl/devkit';
import generator from './enum-type';
import { DEFAULT_LIB_CODEGEN_PREFIX } from '../../common';
import { moduleGenerator } from '../module';
import { EnumTypeGeneratorSchema } from './schema';

describe('enum type generator', () => {
  let tree: Tree;
  const options: EnumTypeGeneratorSchema = {
    name: 'wallet',
    module: 'testLib',
    definition: {
      name: 'Genre',
      type: 'Enum',
      props: [
        {
          name: 'Pop',
          type: 'string',
        },
        {
          name: 'Rock',
          type: 'string',
        },
        {
          name: 'HipHop',
          type: 'string',
        },
        {
          name: 'RnB',
          type: 'string',
        },
        {
          name: 'Country',
          type: 'string',
        },
        {
          name: 'KPop',
          type: 'string',
        },
        {
          name: 'JPop',
          type: 'string',
        },
        {
          name: 'World',
          type: 'string',
        },
      ],
    },
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
    expect(tree.exists(`${libName}/src/enum-types/index.ts`)).toBeTruthy();
    expect(tree.exists(`${libName}/src/enum-types/genre.type.ts`)).toBeTruthy();
  });
});
