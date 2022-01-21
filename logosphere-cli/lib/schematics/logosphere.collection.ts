import { AbstractRunner } from '@nestjs/cli/lib/runners';
import { AbstractCollection } from '@nestjs/cli/lib/schematics/abstract.collection';
import { SchematicOption } from '@nestjs/cli/lib/schematics/schematic.option';

export interface Schematic {
  name: string;
  alias: string;
  description: string;
}

export class LogosphereCollection extends AbstractCollection {
  private static schematics: Schematic[] = [
    {
      name: 'application',
      alias: 'application',
      description: 'Generate a new application workspace',
    },
    {
      name: 'schema',
      alias: 'sch',
      description: 'Generate Logosphere schemas',
    },
    {
      name: 'module',
      alias: 'm',
      description: 'Generate Logosphere module'
    }
  ];

  constructor(runner: AbstractRunner) {
    super('@logosphere/schematics', runner);
  }

  public async execute(name: string, options: SchematicOption[]) {
    const schematic: string = this.validate(name);
    await super.execute(schematic, options);
  }

  public static getSchematics(): Schematic[] {
    return LogosphereCollection.schematics;
  }

  private validate(name: string) {
    const schematic = LogosphereCollection.schematics.find(
      (s) => s.name === name || s.alias === name,
    );

    if (schematic === undefined || schematic === null) {
      throw new Error(
        `Invalid schematic "${name}". Please, ensure that "${name}" exists in this collection.`,
      );
    }
    return schematic.name;
  }
}