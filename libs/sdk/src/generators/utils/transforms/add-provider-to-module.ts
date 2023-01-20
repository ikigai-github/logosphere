/* eslint-disable no-restricted-imports */
import { FileInfo, API, TransformOptions, Node } from 'jscodeshift';

import { strings as s } from '@angular-devkit/core';

export function addProviderToModule(
  file: FileInfo,
  api: API,
  options: TransformOptions
) {
  const j = api.jscodeshift;
  const root = j(file.source);

  return root
    .find(j.ClassDeclaration, {
      id: {
        type: 'Identifier',
        loc: {
          identifierName: `${s.classify(options.module)}Module`,
        },
      },
    })
    .forEach((cls: Node) => {
      const moduleDecorator = cls.value.decorators.find(
        (decorator: Node) => decorator.expression.callee.name === 'Module'
      );
      const props = moduleDecorator.expression.arguments[0].properties;
      const providers = props.find(
        (prop: Node) => prop.key.loc.identifierName === 'providers'
      ).value;
      if (!providers.elements.find((e: Node) => e.name === options.name)) {
        providers.elements.push(j.template.expression([options.name]));
      }
    })
    .toSource();
}
