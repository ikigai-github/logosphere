import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, names, readProjectConfiguration } from '@nrwl/devkit';

import generator from './auth-module';
import { NodeLibraryGeneratorSchema } from './schema';
import { DEFAULT_LIB_CODEGEN_PREFIX } from '../../common';

describe('module generator', () => {
  let tree: Tree;
  const options: NodeLibraryGeneratorSchema = {
    name: 'testLib',
    compiler: 'tsc',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(tree, options);
    const config = readProjectConfiguration(
      tree,
      `test-lib-${DEFAULT_LIB_CODEGEN_PREFIX}`
    );
    expect(config).toBeDefined();
  });

  it('should generate files', async () => {
    await generator(tree, options);
    const fileName = names(options.name).fileName;
    const libName = `${fileName}-${DEFAULT_LIB_CODEGEN_PREFIX}`;
    expect(tree.exists(`${libName}/package.json`)).toBeTruthy();
    expect(tree.exists(`${libName}/src/${fileName}.config.json`)).toBeTruthy();
    expect(tree.exists(`${libName}/src/${fileName}.model.ts`)).toBeTruthy();
    expect(tree.exists(`${libName}/src/${fileName}.module.ts`)).toBeTruthy();
    expect(
      tree.exists(`${libName}/src/${fileName}.test-data.json`)
    ).toBeTruthy();
    expect(tree.exists(`${libName}/src/dto/index.ts`)).toBeTruthy();
    expect(tree.exists(`${libName}/src/entities/index.ts`)).toBeTruthy();
    expect(tree.exists(`${libName}/src/enum-types/index.ts`)).toBeTruthy();
    expect(tree.exists(`${libName}/src/mappers/dto/index.ts`)).toBeTruthy();
    expect(tree.exists(`${libName}/src/mappers/fluree/index.ts`)).toBeTruthy();
    expect(
      tree.exists(`${libName}/src/repositories/interfaces/index.ts`)
    ).toBeTruthy();
    expect(
      tree.exists(`${libName}/src/repositories/fluree/index.ts`)
    ).toBeTruthy();
    expect(tree.exists(`${libName}/src/resolvers/index.ts`)).toBeTruthy();
    expect(
      tree.exists(`${libName}/src/lib/codegen-${options.name}.ts`)
    ).toBeFalsy();
    expect(
      tree.exists(`${libName}/src/lib/codegen-${options.name}.spec.ts`)
    ).toBeFalsy();
  });
});
