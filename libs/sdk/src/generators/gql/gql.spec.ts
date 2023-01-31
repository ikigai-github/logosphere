import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, names, readProjectConfiguration } from '@nrwl/devkit';

import generator from './gql';
import { moduleGenerator } from '../module';
import { GqlGeneratorSchema } from './schema';
import { DefinitionType } from '../../schema';
import { DEFAULT_LIB_CODEGEN_PREFIX } from '../../common';

describe('gql schema generator', () => {
  let tree: Tree;
  const options: GqlGeneratorSchema = {
    module: 'testLib',
  };

  const fileName = names(options.module).fileName;
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
    const genOptions = {
      ...options,
      sourceSchema: {
        definitions: [
          {
            name: 'artist',
            type: DefinitionType.Entity,
            isNft: false,
            props: [
              {
                name: 'name',
                type: 'string',
                isEnabled: true,
                isRequired: false,
                isIndexed: false,
                isUnique: false,
                isPK: false,
                isReadOnly: false,
                isWriteOnly: false,
                examples: ['Taylor Swift', 'Lil Nas X', 'Dua Lipa'],
                defType: DefinitionType.Scalar,
              },
            ],
          },
        ],
      },
    };
    await generator(tree, genOptions);
    tree.listChanges().map((fc) => console.log(fc.path));
    expect(
      tree.exists(`${libName}/src/gql/${fileName}.schema.graphql`)
    ).toBeTruthy();
  });
});
