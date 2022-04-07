import * as fs from 'fs';
import TestDataGenerator from './data-generator';
import FlureeSchema from './fluree';
import { Configuration, ModuleConfiguration, loadConfiguration } from '../../configuration';

interface TestDbConfig {
  collection: string;
  count: number;
  options?: any;
}

export async function createTestDb(module: string) {
  const testDbConfig: TestDbConfig[] = JSON.parse(
    fs.readFileSync(`${__dirname}/test-db.json`, 'utf-8')
  );

  const config: ModuleConfiguration = loadConfiguration().modules.find(
    (m: ModuleConfiguration) => m.name === module
  )

  const fluree = new FlureeSchema(module);
  await fluree.init(true).then(async () => {
    await fluree.initialize(true).then(async () => {
      const testDataGenerator = new TestDataGenerator(fluree, config.fluree.ledgerUrl, `${config.fluree.network}/${config.fluree.db}`);

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
