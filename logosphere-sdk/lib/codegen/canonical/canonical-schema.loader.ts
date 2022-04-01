import * as fs from 'fs';
import * as path from 'path';
import { FileSystemReader } from '../../readers';
import { CanonicalSchema, Definition } from './canonical.schema';
import {
  Configuration,
  ModuleConfiguration,
  ConfigurationLoader,
  LOGOSPHERE_CONFIG_FILE,
} from '../../configuration';


const getAllFiles = function(dirPath: string, arrayOfFiles?: string[]) {
  const files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(`${dirPath}/${file}`)
    }
  })

  return arrayOfFiles
}

export const canonicalSchemaLoader = (
  sourceDir?: string
): CanonicalSchema => {
  const joinedSchema: CanonicalSchema = {
    definitions: []
  };
  const dir = sourceDir ? sourceDir : `${process.cwd()}/src`;
  const schemaFiles = getAllFiles(dir)
    .filter((file) => file.indexOf('canonical.schema.json') > -1 )
  schemaFiles.map((file: string) => {
    const schema: CanonicalSchema = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const module = file.split('/').pop().replace('.canonical.schema.json', '');
    schema.definitions.map((def: Definition ) => {
      def.module = module;
      joinedSchema.definitions.push(def);
    })
  });
  return joinedSchema;
};
