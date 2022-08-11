/* eslint-disable no-restricted-imports */
import j from 'jscodeshift';

export function addImport(
  file: j.FileInfo,
  api: j.API,
  options: j.TransformOptions
) {
  const root = api.jscodeshift(file.source);
  return root
    .find(j.ImportDeclaration, {
      source: {
        value: options.importFile,
      },
    })
    .forEach((imp: j.ImportDeclaration) => {
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
