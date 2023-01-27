import { Tree, getProjects } from '@nrwl/devkit';
import { DEFAULT_COMPILER, DEFAULT_CODEGEN_DIR } from '../../common';
import { ApiGeneratorSchema } from './schema';

import { applicationGenerator } from '../application';
import { canonicalSchemaGenerator } from '../canonical';
import { dtoGenerator } from '../dto';
import { entityGenerator } from '../entity';
import { enumTypeGenerator } from '../enum-type';
import { flureeGenerator } from '../fluree';
import { gqlGenerator } from '../gql';
import { mapperGenerator } from '../mapper';
import { repositoryGenerator } from '../repository';
import { resolverGenerator } from '../resolver';
import { apiE2eTestGenerator } from '../api-e2e';

export async function apiGenerator(tree: Tree, options: ApiGeneratorSchema) {
  const module = options.module;

  if (!getProjects(tree).has(module)) {
    await applicationGenerator(tree, {
      name: module,
    });
  }

  await canonicalSchemaGenerator(tree, { module });
  await dtoGenerator(tree, { module });
  await entityGenerator(tree, { module });
  await enumTypeGenerator(tree, { module });
  await flureeGenerator(tree, {
    module,
    flureeLedger: options.flureeLedger || false,
  });
  await gqlGenerator(tree, { module });
  // await mapperGenerator(tree, {
  //   module,
  //   type: 'dto',
  // });
  // await mapperGenerator(tree, {
  //   module,
  //   type: 'fluree',
  // });
  // await repositoryGenerator(tree, {
  //   module,
  //   type: 'interfaces',
  // });
  // await repositoryGenerator(tree, {
  //   module,
  //   type: 'fluree',
  // });
  // await resolverGenerator(tree, { module });
  // await apiE2eTestGenerator(tree, { module });
}

export default apiGenerator;
