import * as fs from 'fs-extra';
import TestDataGenerator from './data-generator';
import FlureeSchema from './fluree';
import {
  ModuleConfiguration,
  loadModuleConfiguration,
} from '@logosphere/schema';

interface TestDbConfig {
  collection: string;
  count: number;
  options?: any;
}

export async function createTestDb(module: string) {
  const testDbConfig: TestDbConfig[] = JSON.parse(
    fs.readFileSync(`${process.cwd()}/src/${module}.test-data.json`, 'utf-8')
  );

  const moduleConfig: ModuleConfiguration = loadModuleConfiguration(module);

  const fluree = new FlureeSchema(moduleConfig);
  await fluree.init(true).then(async () => {
    await fluree.initialize(true).then(async () => {
      const testDataGenerator = new TestDataGenerator(
        fluree,
        moduleConfig.fluree.ledgerUrl,
        `${moduleConfig.fluree.network}/${moduleConfig.fluree.db}`
      );

      // create sequence of functions
      const functions = testDbConfig.map((config: TestDbConfig) => {
        return function () {
          return testDataGenerator.generate(
            config.collection,
            config.count,
            config.options
          );
        };
      });

      // execute functions in sequence
      functions.reduce((promiseChain, currentFunction) => {
        return promiseChain.then(currentFunction);
      }, Promise.resolve());
      console.log(`[${new Date().toISOString()}]`, 'Data inserted');
    });
  });
}
