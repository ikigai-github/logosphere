import { sha3_256 } from 'js-sha3';

import {
  FlureeQuery,
  flureeSystem as s,
  flureePredicates as fp,
} from '@logosphere/fluree';

import { Definition, DefinitionType, Property } from '../converters';
import FlureeSchema from './fluree';

import { BOOLEAN, IDENTIFIER, INTEGER, NUMBER, STRING } from './const';

/**
 * Generic class that generates test data in the Fluree database.
 *
 * @author : Manik-Jain
 */
export default class TestDataGenerator {
  private readonly fluree: FlureeSchema;
  private dbData: any;
  private endpoint: string;
  private db: string;

  constructor(fluree: FlureeSchema, endpoint: string, db: string) {
    this.endpoint = endpoint;
    this.db = db;
    this.fluree = fluree;
    this.dbData = {};
  }

  #shuffle(value: string) {
    return value
      .split('')
      .sort(function () {
        return 0.5 - Math.random();
      })
      .join('');
  }

  #value(prop: Property, options?: any) {
    let value =
      options && options[prop.name]
        ? options[prop.name]
        : this.fluree.extractValue(prop.type, prop);

    //adust unique strings
    if (prop.type === STRING && prop.isUnique === true) {
      if (prop.maxLength) value = this.#shuffle(value);
      else {
        value = `${value}${(Math.random() + 1)
          .toString(36)
          .substring((prop.maxLength || 100) - value.length)}`;
      }
    }

    return value;
  }

  /**
   * Generate n number of test data entries in DB
   * @param entity
   * @param numOfRecords
   */
  async generate(entity: string, numOfRecords: number, options?: any) {
    const def = this.fluree.modelSchema.definitions.find(
      (def: Definition) => def.name === entity
    );
    if (!def) {
      console.log(`Entity ${entity} does not exist in schema`);
      return;
    }

    const testData: any[] = [];
    await this.initTestData(def).then(async () => {
      for (let i = 0; i < numOfRecords; i++) {
        const datum: any = {};
        def.props.forEach((prop) => {
          if (prop.name !== IDENTIFIER) {
            if (prop.defType === DefinitionType.Enum) {
              // TODO: Enable enum support in test data generator
              //https://ikigai-technologies.atlassian.net/browse/LOG-100
            } else if (prop.defType === DefinitionType.Entity) {
              const value =
                options !== undefined && prop.name in options
                  ? options[prop.name]
                  : this.getRandomValue(prop.type);
              datum[prop.name] = [`${prop.type}/${IDENTIFIER}`, value];
            } else {
              if (prop.type === STRING) {
                datum[prop.name] = this.#value(prop, options);
              } else if (prop.type === NUMBER || prop.type === INTEGER) {
                datum[prop.name] = this.#value(prop, options);
              } else if (prop.type === BOOLEAN) {
                const value =
                  options !== undefined && prop.name in options
                    ? options[prop.name]
                    : i % 2 == 0
                    ? true
                    : false;
                datum[prop.name] = value;
              } else if (prop.defType === DefinitionType.EntityArray) {
                const refItems: any[] = [];
                const n = 5;

                for (let j = 0; j < n; j++) {
                  const value =
                    options !== undefined && prop.name in options
                      ? options[prop.name]
                      : this.getRandomValue(prop.type, prop.isUnique);
                  if (prop.isUnique && value) {
                    refItems.push(value);
                  } else if (value) {
                    refItems.push([`${prop.type}/${IDENTIFIER}`, value]);
                  }
                }
                datum[prop.name] = refItems;
              }
            }
          }
        });

        datum[IDENTIFIER] = sha3_256(
          JSON.stringify(datum).concat(Math.random().toString(36))
        );
        datum[s._ID] = `${entity}$${datum[IDENTIFIER]}`;
        testData.push(datum);
      }
      // this.fluree.fileUtil.write(
      //   path.resolve(__dirname + `/testData_${entity}.json`),
      //   testData
      // );
      await this.fluree.dao.transact(this.endpoint, this.db, testData);
    });
  }

  async initTestData(def: Definition) {
    const dependencies: string[] = [];
    def.props.forEach((prop: Property) => {
      if (
        prop.defType === DefinitionType.Entity ||
        prop.defType === DefinitionType.EntityArray
      ) {
        dependencies.push(prop.type);
      }
    });

    for await (const dependency of dependencies) {
      this.dbData[dependency] = await this.getRecordIdentifiers(dependency);
    }
  }

  async getRecordIdentifiers(collection: string) {
    const query: FlureeQuery = {
      select: [fp.IDENTIFIER],
      from: collection,
    };

    return await this.fluree.dao.query(this.endpoint, this.db, query);
  }

  getRandomValue(entity: string, isUnique?: boolean) {
    if (isUnique) {
      return this.fluree.parse(entity);
    }

    if (Object.keys(this.dbData).includes(entity)) {
      return this.dbData[entity][
        Math.floor(Math.random() * this.dbData[entity].length)
      ][IDENTIFIER];
    }
  }
}
