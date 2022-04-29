import * as fs from 'fs-extra';
import * as path from 'path';
import { FileSystemReader } from '@logosphere/readers';
import { CanonicalSchema, Definition } from './canonical.schema';
import {
  Configuration,
  ModuleConfiguration,
  ConfigurationLoader,
  LOGOSPHERE_CONFIG_FILE,
} from '@logosphere/configuration';
import { getMetadataStorage } from '@logosphere/decorators';


const getAllFiles = function(dirPath: string, arrayOfFiles?: string[]) {
  const files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles?.push(`${dirPath}/${file}`)
    }
  })

  return arrayOfFiles
}

export const canonicalSchemaLoader = (
  sourceDir?: string
): CanonicalSchema => {
  const dir = sourceDir ? sourceDir : `${process.cwd()}/dist`;
  const entityFiles = getAllFiles(dir).filter((file) => file.endsWith('entity.js'));
  entityFiles.map((file: string) => {
    eval(fs.readFileSync(file, 'utf-8'));
  });

  return getMetadataStorage().buildSchema();
};
