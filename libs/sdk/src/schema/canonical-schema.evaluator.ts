import { join } from 'path';
import { getMetadataStorage } from '../decorators';
import { FunctionDeclarationStructure, Project, SourceFile } from 'ts-morph';
import { CanonicalSchema } from '../converters';

export function openProject(tsConfigFilePath: string) {
  const project = new Project({
    tsConfigFilePath,
    compilerOptions: { sourceMap: false, declaration: false },
  });

  project.resolveSourceFileDependencies();

  return project;
}

export function combineEntityFiles(project: Project) {
  const fileMap = {};

  getEntityFiles(project).forEach((file) => addFile(file, fileMap));

  const files = Object.values(fileMap) as SourceFile[];

  // Fixme: Maybe just make a new empty project
  const sourceName = `combined${Math.floor(Math.random() * 10000)}`;
  const combineFile = project.createSourceFile(`${sourceName}.ts`, '');

  // Copy everything but the imports from each file into the combined file
  files.forEach((file) => {
    const types = file.getTypeAliases().map((type) => type.getStructure());
    const interfaces = file.getInterfaces().map((type) => type.getStructure());
    const classes = file.getClasses().map((clazz) => clazz.getStructure());
    const enums = file
      .getEnums()
      .map((enumeration) => enumeration.getStructure());
    const functions = file
      .getFunctions()
      .map((func) => func.getStructure() as FunctionDeclarationStructure);

    combineFile.addTypeAliases(types);
    combineFile.addInterfaces(interfaces);
    combineFile.addClasses(classes);
    combineFile.addEnums(enums);
    combineFile.addFunctions(functions);
  });

  // Emit the combined file as javascript
  const combinedJs = combineFile
    .getEmitOutput()
    .getOutputFiles()
    .find((file) => file.getFilePath().endsWith(`${sourceName}.js`))
    .getText();

  project.removeSourceFile(combineFile);

  return combinedJs;
}

/**
 * Finds the Entity decorator function and then finds all files that reference it.
 * @param project The project to search for entity files
 * @returns a list of files in a project that have entity declarations
 */
function getEntityFiles(project: Project) {
  const sources = project.getSourceFiles();
  return (
    project
      .getSourceFiles()
      .find(
        (file) =>
          file.getBaseNameWithoutExtension() === 'entity' &&
          file.getFunction('Entity')?.getReturnType()?.getText() ===
            'ClassDecorator'
      )
      ?.getFunction('Entity')
      .findReferences()
      .map((reference) => reference.getDefinition().getSourceFile()) ?? []
  );
}

/**
 * Adds a source file to a file lookup map and then adds any files it imports or exports
 * @param file The file to be added
 * @param files The file map to add the file to
 */
function addFile(file: SourceFile, files: object = {}) {
  const path = file.getFilePath();
  if (files[path] === undefined && !file.isFromExternalLibrary()) {
    files[path] = file;
    file
      .getImportDeclarations()
      .map((imp) => imp.getModuleSpecifierSourceFile())
      .filter((impSource) => !!impSource)
      .forEach((impSource) => addFile(impSource, files));

    file
      .getExportDeclarations()
      .map((exp) => exp.getModuleSpecifierSourceFile())
      .filter((expSource) => !!expSource)
      .forEach((expSource) => addFile(expSource, files));
  }
}

/**
 * Given a project finds all classes decorated with the Logosphere entity decorator
 * @param project The project to fetch entity classes for
 * @returns a list of all entity classes found in the project
 */
function getEntityClasses(project: Project) {
  return getEntityFiles(project).flatMap((file) =>
    file.getClasses().filter((clazz) => clazz.getDecorator('Entity') !== null)
  );
}

export function canonicalSchemaLoader(tsConfigPath: string): CanonicalSchema {
  const project = openProject(tsConfigPath);
  const combinedJs = combineEntityFiles(project);

  eval(combinedJs);

  return getMetadataStorage().buildSchema();
}
