/* eslint-disable @typescript-eslint/no-unused-vars */
import { PropMetadata } from './Prop.metadata';
import { PropOptions } from './Prop.options';
import { LazyObjectType, PropDecoratorType } from './Prop.types';

export function Prop(): PropDecoratorType;
export function Prop(options?: PropOptions): PropDecoratorType;
export function Prop(
  lazyType?: LazyObjectType,
  options?: PropOptions
): PropDecoratorType;

export function Prop(
  lazyType?: LazyObjectType | PropOptions,
  maybeOptions?: PropOptions
) {
  return function (target) {
    // TODO: Create and store the metadata
  };
}
