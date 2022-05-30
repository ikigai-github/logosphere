/* eslint-disable no-restricted-imports */
import * as j from 'jscodeshift';

import { strings as s } from '@angular-devkit/core';

export function addProviderToModule(
  file: j.FileInfo,
  api: j.API,
  options: j.TransformOptions
) {
  const root = api.jscodeshift(file.source);

  return root
    .find(j.ClassDeclaration, {
      id: {
        type: 'Identifier',
        loc: {
          identifierName: `${s.classify(options.module)}Module`,
        },
      },
    })
    .forEach((cls: j.Node) => {
      const moduleDecorator = cls.value.decorators.find(
        (decorator: j.Node) => decorator.expression.callee.name === 'Module'
      );
      const props = moduleDecorator.expression.arguments[0].properties;
      const providers = props.find(
        (prop: j.Node) => prop.key.loc.identifierName === 'providers'
      ).value;
      if (!providers.elements.find((e: j.Node) => e.name === options.name)) {
        providers.elements.push(j.template.expression([options.name]));
      }
    })
    .toSource();
}
