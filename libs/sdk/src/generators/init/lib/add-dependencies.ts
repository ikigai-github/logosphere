import type { GeneratorCallback, Tree } from '@nrwl/devkit';
import { addDependenciesToPackageJson, readJson } from '@nrwl/devkit';
import { satisfies } from 'semver';
import {
  nestJsSchematicsVersion,
  nestJsVersion,
  nestJsApolloVersion,
  nestJsGraphQLVersion,
  nxVersion,
  reflectMetadataVersion,
  expressVersion,
  rxjsVersion,
} from '../../../utils/versions';

export function addDependencies(tree: Tree): GeneratorCallback {
  return addDependenciesToPackageJson(
    tree,
    {
      '@emurgo/cardano-serialization-lib-nodejs': '8.0.0',
      '@fluree/flureenjs': '1.0.4',
      '@fluree/crypto-base': '0.1.6',
      '@fluree/crypto-utils': '1.10.0',
      '@logosphere/cardano': '0.5.3',
      '@logosphere/ipfs': '0.1.1',
      '@logosphere/fluree': '0.5.3',
      '@logosphere/sdk': '0.6.7',
      '@nestjs/apollo': nestJsApolloVersion,
      '@nestjs/common': nestJsVersion,
      '@nestjs/config': '2.0.0',
      '@nestjs/core': nestJsVersion,
      '@nestjs/graphql': nestJsGraphQLVersion,
      '@nestjs/platform-express': nestJsVersion,
      '@pinata/sdk': '1.1.25',
      'apollo-server-core': '3.11.1',
      'apollo-server-express': '3.11.1',
      'aws-sdk': '2.1131.0',
      axios: '0.26.1',
      'cardano-wallet-js': '1.2.3',
      'class-transformer': '0.2.0',
      'class-validator': '0.13.2',
      express: expressVersion,
      'fs-extra': '10.1.0',
      graphql: '16.5.0',
      'js-sha3': '0.8.0',
      lodash: '4.17.21',
      randomstring: '1.2.2',
      'reflect-metadata': reflectMetadataVersion,
      rxjs: '7.8.0',
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
      '@nestjs/schematics': nestJsSchematicsVersion,
      '@nestjs/testing': nestJsVersion,
      '@nrwl/devkit': nxVersion,
      '@nrwl/js': nxVersion,
      '@nrwl/nest': nxVersion,
      '@nrwl/workspace': nxVersion,
      '@nx-tools/ci-context': '4.0.2',
      '@nx-tools/nx-docker': '3.0.0',
      '@swc/helpers': '0.4.14',
      'babel-loader': '8.0.2',
      dotenv: '16.0.1',
      handlebars: '4.7.7',
      jscodeshift: '0.13.1',
      'pascal-case': '3.1.2',
      path: '0.12.7',
      webpack: '5.75.0',
    }
  );
}
