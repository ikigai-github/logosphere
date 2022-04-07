import FlureeSchema from './fluree';
import {
  ENUM,
  TYPE,
  STRING,
  IDENTIFIER,
  NUMBER,
  INTEGER,
  DEFS,
  REF,
  PROPERTIES,
  BOOLEAN,
  ARRAY,
  ITEMS,
  MIN_ITEMS,
  MAX_ITEMS,
  COMMENT,
  CONVERT_PRICE,
  ONE_ADA,
  MAX_LENGTH,
} from '../../common/const';
import { FlureeQuery, Predicates } from '../../services/fluree';
import { sha3_256 } from 'js-sha3';
import path from 'path';

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

  #enum(model: any, property: string) {
    return this.fluree.modelSchema[
      model[PROPERTIES][property][REF].replace(DEFS, '')
    ];
  }

  #isEnum(model: any, property: string) {
    return (
      REF in model[PROPERTIES][property] && ENUM in this.#enum(model, property)
    );
  }

  #shuffle(value: string) {
    return value
      .split('')
      .sort(function () {
        return 0.5 - Math.random();
      })
      .join('');
  }

  #value(property: string, entity: any, options?: any) {
    let value =
      options && options[property]
        ? options[property]
        : this.fluree.extractValue(entity[TYPE], entity);

    //adust unique strings
    if (
      entity[TYPE] === STRING &&
      COMMENT in entity &&
      JSON.parse(entity[COMMENT]).unique === true
    ) {
      if (MAX_LENGTH in entity && value.length === entity[MAX_LENGTH])
        value = this.#shuffle(value);
      else {
        value = `${value}${(Math.random() + 1)
          .toString(36)
          .substring((entity[MAX_LENGTH] || 100) - entity.length)}`;
      }
    }

    //multiply by 10000000 if it's a price
    if (
      entity[TYPE] === NUMBER &&
      COMMENT in entity &&
      JSON.parse(entity[COMMENT]).conversion === CONVERT_PRICE
    ) {
      value = value * ONE_ADA;
    }

    return value;
  }

  /**
   * Generate n number of test data entries in DB
   * @param entity
   * @param numOfRecords
   */
  async generate(entity: string, numOfRecords: number, options?: any) {
    if (!Object.keys(this.fluree.modelSchema).includes(entity)) {
      console.log(`Entity ${entity} does not exist in schema`);
      return;
    }

    const model = this.fluree.modelSchema[entity];
    const testData: any[] = [];
    await this.initTestData(model).then(async () => {
      for (let i = 0; i < numOfRecords; i++) {
        const datum: any = {};
        Object.keys(model[PROPERTIES]).forEach((property) => {
          if (property !== IDENTIFIER) {
            if (this.#isEnum(model, property)) {
              datum[property] = this.#value(
                property,
                this.#enum(model, property),
                options
              );
            } else if (REF in model[PROPERTIES][property]) {
              const ref = model[PROPERTIES][property][REF].replace(DEFS, '');
              const value =
                options !== undefined && property in options
                  ? options[property]
                  : this.getRandomValue(ref);
              datum[property] = [`${ref}/${IDENTIFIER}`, value];
            } else {
              const type = model[PROPERTIES][property][TYPE];
              if (type === STRING) {
                datum[property] = this.#value(
                  property,
                  model[PROPERTIES][property],
                  options
                );
              } else if (type === NUMBER || type === INTEGER) {
                datum[property] = this.#value(
                  property,
                  model[PROPERTIES][property],
                  options
                );
              } else if (type === BOOLEAN) {
                const value =
                  options !== undefined && property in options
                    ? options[property]
                    : i % 2 == 0
                    ? true
                    : false;
                datum[property] = value;
              } else if (
                type === ARRAY &&
                REF in model[PROPERTIES][property][ITEMS]
              ) {
                const ref = model[PROPERTIES][property][ITEMS][REF].replace(
                  DEFS,
                  ''
                );
                const isUnique =
                  model[PROPERTIES][property][COMMENT] &&
                  JSON.parse(model[PROPERTIES][property][COMMENT]).unique ===
                    true
                    ? true
                    : false;
                const refItems: any[] = [];
                const n = model[PROPERTIES][property][MAX_ITEMS]
                  ? model[PROPERTIES][property][MAX_ITEMS]
                  : model[PROPERTIES][property][MIN_ITEMS]
                  ? model[PROPERTIES][property][MIN_ITEMS]
                  : 0;

                if (n !== 0) {
                  for (let j = 0; j < n; j++) {
                    const value =
                      options !== undefined && property in options
                        ? options[property]
                        : this.getRandomValue(ref, isUnique);
                    if (isUnique && value) {
                      refItems.push(value);
                    } else if (value) {
                      refItems.push([`${ref}/${IDENTIFIER}`, value]);
                    }
                  }
                } else {
                  const value =
                    options !== undefined && property in options
                      ? options[property]
                      : this.getRandomValue(ref, isUnique);
                  if (isUnique && value) {
                    refItems.push(value);
                  } else if (value) {
                    refItems.push([`${ref}/${IDENTIFIER}`, value]);
                  }
                }

                datum[property] = refItems;
              }
            }
          }
        });

        datum[IDENTIFIER] = sha3_256(
          JSON.stringify(datum).concat(Math.random().toString(36))
        );
        datum[Predicates._ID] = `${entity}$${datum[IDENTIFIER]}`;
        testData.push(datum);
      }
      // this.fluree.fileUtil.write(
      //   path.resolve(__dirname + `/testData_${entity}.json`),
      //   testData
      // );
      await this.fluree.dao.transact(
        this.endpoint,
        this.db,
        testData
      );
    });
  }

  async initTestData(model: any) {
    const dependencies: string[] = [];
    Object.keys(model[PROPERTIES]).forEach((entry) => {
      if (REF in model[PROPERTIES][entry] && !this.#isEnum(model, entry)) {
        const ref = model[PROPERTIES][entry][REF].replace(DEFS, '');
        dependencies.push(ref);
      } else if (
        model[PROPERTIES][entry][TYPE] === ARRAY &&
        REF in model[PROPERTIES][entry][ITEMS]
      ) {
        const ref = model[PROPERTIES][entry][ITEMS][REF].replace(DEFS, '');
        if (
          COMMENT in this.fluree.modelSchema[ref] &&
          JSON.parse(this.fluree.modelSchema[ref][COMMENT]).persist === true
        ) {
          dependencies.push(ref);
        }
      }
    });

    for await (const dependency of dependencies) {
      this.dbData[dependency] = await this.getRecordIdentifiers(dependency);
    }
  }

  async getRecordIdentifiers(collection: string) {
    const query: FlureeQuery = {
      select: [Predicates.IDENTIFIER],
      from: collection,
    };

    return await this.fluree.dao.query(
      this.endpoint,
      this.db,
      query
    );
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
