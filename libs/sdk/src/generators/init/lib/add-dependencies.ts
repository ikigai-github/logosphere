import type { GeneratorCallback, Tree } from '@nrwl/devkit';
import { addDependenciesToPackageJson, readJson } from '@nrwl/devkit';
import { satisfies } from 'semver';
import {
  nestJsSchematicsVersion,
  nestJsVersion7,
  nestJsVersion8,
  nestJsApolloVersion,
  nestJsGraphQLVersion,
  nxVersion,
  reflectMetadataVersion,
  rxjsVersion6,
  rxjsVersion7,
} from '../../../utils/versions';

export function addDependencies(tree: Tree): GeneratorCallback {
  // Old nest 7 and rxjs 6 by default
  let NEST_VERSION = nestJsVersion7;
  let RXJS = rxjsVersion6;

  const packageJson = readJson(tree, 'package.json');

  if (packageJson.dependencies['@angular/core']) {
    let rxjs = packageJson.dependencies['rxjs'];

    if (rxjs.startsWith('~') || rxjs.startsWith('^')) {
      rxjs = rxjs.substring(1);
    }

    if (satisfies(rxjs, rxjsVersion7)) {
      NEST_VERSION = nestJsVersion8;
      RXJS = packageJson.dependencies['rxjs'];
    }
  } else {
    NEST_VERSION = nestJsVersion8;
    RXJS = rxjsVersion7;
  }

  return addDependenciesToPackageJson(
    tree,
    {
      '@emurgo/cardano-serialization-lib-nodejs': '8.0.0',
      '@fluree/flureenjs': '1.0.4',
      '@logosphere/cardano': '0.1.1',
      '@logosphere/decorators': '0.2.2',
      '@logosphere/domain': '0.1.1',
      '@logosphere/errors': '0.1.0',
      '@logosphere/fluree': '0.4.3',
      '@logosphere/utils': '0.1.2',
      '@nestjs/apollo': nestJsApolloVersion,
      '@nestjs/common': NEST_VERSION,
      '@nestjs/config': '2.0.0',
      '@nestjs/core': NEST_VERSION,
      '@nestjs/graphql': nestJsGraphQLVersion,
      '@nestjs/platform-fastify': NEST_VERSION,
      '@pinata/sdk': '1.1.25',
      'apollo-server-core': '3.6.7',
      'apollo-server-fastify': '3.6.7',
      'aws-sdk': '2.1131.0',
      axios: '0.26.1',
      'cardano-wallet-js': '1.2.3',
      'class-transformer': '0.2.0',
      'class-validator': '0.13.2',
      fastify: '3.17.0',
      'fs-extra': '10.1.0',
      graphql: '15.7.2',
      'js-sha3': '0.8.0',
      lodash: '4.17.21',
      randomstring: '1.2.2',
      'reflect-metadata': reflectMetadataVersion,
      rxjs: RXJS,
      'safe-stable-stringify': '2.3.1',
      'shallow-equal': '1.2.1',
      'sleep-promise': '9.1.0',
      tslib: '2.4.0',
      'ts-morph': '14.0.0',
      'typescript-string-operations': '1.4.1',
      uuid: '8.3.2',
    },
    {
      '@babel/core': '7.0.0',
      '@babel/preset-env': '7.0.0',
      '@logosphere/configuration': '0.1.0',
      '@logosphere/converters': '0.2.3',
      '@logosphere/readers': '0.1.0',
      '@nestjs/schematics': nestJsSchematicsVersion,
      '@nestjs/testing': NEST_VERSION,
      '@nrwl/devkit': '14.0.2',
      '@nrwl/js': nxVersion,
      '@nrwl/nest': nxVersion,
      '@nrwl/workspace': '14.0.5',
      '@nx-tools/ci-context': '3.0.0-alpha.2',
      '@nx-tools/nx-docker': '3.0.0-alpha.2',
      '@swc/helpers': '0.4.2',
      'babel-loader': '8.0.2',
      dotenv: '16.0.1',
      handlebars: '4.7.7',
      jscodeshift: '0.13.1',
      'pascal-case': '3.1.2',
      path: '0.12.7',
      webpack: '5.0.0',
    }
  );
}
