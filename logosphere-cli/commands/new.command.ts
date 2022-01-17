import { Command, CommanderStatic } from 'commander';
import { Collection } from '../lib/schematics';
import { AbstractCommand } from '@nestjs/cli/commands/abstract.command';
import { Input } from '@nestjs/cli/commands/command.input';

export class NewCommand extends AbstractCommand {
  public load(program: CommanderStatic) {
    program
      .command('new [name]')
      .alias('n')
      .description('Generate Logosphere application.')
      .option('--directory [directory]', 'Specify the destination directory')
      .option(
        '-d, --dry-run',
        'Report actions that would be performed without writing out results.',
      )
      .option('-g, --skip-git', 'Skip git repository initialization.')
      .option('-s, --skip-install', 'Skip package installation.')
      .option(
        '-p, --package-manager [package-manager]',
        'Specify package manager.',
      )
      .option(
        '-l, --language [language]',
        'Programming language to be used (TypeScript or JavaScript).',
      )
      .option(
        '-c, --collection [collectionName]',
        'Schematics collection to use.',
      )
      .option('--strict', 'Enables strict mode in TypeScript.')
      .action(async (name: string, command: Command) => {
        const options: Input[] = [];
        const availableLanguages = ['js', 'ts', 'javascript', 'typescript'];
        options.push({ name: 'directory', value: command.directory });
        options.push({ name: 'dry-run', value: !!command.dryRun });
        options.push({ name: 'skip-git', value: !!command.skipGit });
        options.push({ name: 'skip-install', value: !!command.skipInstall });
        options.push({ name: 'strict', value: !!command.strict });
        options.push({
          name: 'package-manager',
          value: command.packageManager,
        });

        if (!!command.language) {
          const lowercasedLanguage = command.language.toLowerCase();
          const langMatch = availableLanguages.includes(lowercasedLanguage);
          if (!langMatch) {
            throw new Error(
              `Invalid language "${command.language}" selected. Available languages are "typescript" or "javascript"`,
            );
          }
          switch (lowercasedLanguage) {
            case 'javascript':
              command.language = 'js';
              break;
            case 'typescript':
              command.language = 'ts';
              break;
            default:
              command.language = lowercasedLanguage;
              break;
          }
        }
        options.push({
          name: 'language',
          value: !!command.language ? command.language : 'ts',
        });
        options.push({
          name: 'collection',
          value: command.collection || Collection.LOGOSPHERE,
        });

        const inputs: Input[] = [];
        inputs.push({ name: 'name', value: name });

        await this.action.handle(inputs, options);
      });
  }
}