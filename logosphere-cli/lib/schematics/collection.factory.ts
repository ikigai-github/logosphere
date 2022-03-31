import { Runner, RunnerFactory } from '@nestjs/cli/lib/runners';
import { SchematicRunner } from '@nestjs/cli/lib/runners/schematic.runner';
import { AbstractCollection } from '@nestjs/cli/lib/schematics/abstract.collection';
import { Collection } from './collection';
import { CustomCollection } from './custom.collection';
import { LogosphereCollection } from './logosphere.collection';

export class CollectionFactory {
  public static create(collection: Collection | string): AbstractCollection {
    switch (collection) {
      case Collection.LOGOSPHERE:
        return new LogosphereCollection(
          RunnerFactory.create(Runner.SCHEMATIC) as SchematicRunner,
        );

      default:
        return new CustomCollection(
          collection,
          RunnerFactory.create(Runner.SCHEMATIC) as SchematicRunner,
        );
    }
  }
}
