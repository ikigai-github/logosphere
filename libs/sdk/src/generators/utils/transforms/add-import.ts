/* eslint-disable no-restricted-imports */
import {
  FileInfo,
  API,
  TransformOptions,
  ImportDeclaration,
} from 'jscodeshift';

export function addImport(file: FileInfo, api: API, options: TransformOptions) {
  const j = api.jscodeshift;
  const root = j(file.source);
  return root
    .find(j.ImportDeclaration, {
      source: {
        value: options.importFile,
      },
    })
    .forEach((imp: ImportDeclaration) => {
      if (j(imp).find(j.Identifier, { name: options.name }).length === 0) {
        j(imp).replaceWith(
          j.importDeclaration(
            [
              ...imp.node.specifiers,
              j.importSpecifier(j.identifier(options.name)),
            ],
            imp.node.source
          )
        );
      }
    })
    .toSource();
}
