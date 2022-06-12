/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  DefinitionType,
  canonicalConstants as cc,
  canonicalTypes as ct,
} from '../canonical';
import { PropParser } from '../abstract';
import { FlureePredicate } from './fluree.schema';
import { constants as fc, types as ft } from './fluree.constants';
import { strings as s } from '@angular-devkit/core';

/***
 * Converts Fluree predicate to canonical schema prop
 */
export class FlureeSchemaPropParser extends PropParser {
  // TODO: improve type system in canonical schema
  // https://ikigai-technologies.atlassian.net/browse/LOG-190

  #typeMap = {
    [ft.STRING]: ct.STRING,
    [ft.INT]: ct.NUMBER,
    [ft.LONG]: ct.NUMBER,
    [ft.BIGINT]: ct.NUMBER,
    [ft.FLOAT]: ct.NUMBER,
    [ft.DOUBLE]: ct.NUMBER,
    [ft.BIGDEC]: ct.NUMBER,
    [ft.INSTANT]: ct.NUMBER,
    [ft.BOOLEAN]: ct.BOOLEAN,
    [ft.URI]: ct.STRING,
    [ft.UUID]: ct.STRING,
    [ft.BYTES]: ct.STRING,
    [ft.JSON]: ct.ANY,
  };

  constructor(name: string) {
    super(name);
  }

  protected defType(predicate: FlureePredicate): DefinitionType {
    if (predicate.restrictCollection) {
      return predicate.multi
        ? DefinitionType.EntityArray
        : DefinitionType.Entity;
    } else {
      return predicate.multi
        ? DefinitionType.ScalarArray
        : DefinitionType.Scalar;
    }
  }

  protected type(predicate: FlureePredicate): string {
    return predicate.type === fc.REF
      ? s.classify(predicate.restrictCollection)
      : this.#typeMap[predicate.type];
  }

  protected isEnabled(predicate: FlureePredicate): boolean {
    return predicate.deprecated || true;
  }

  protected isRequired(predicate: FlureePredicate): boolean {
    return false;
  }

  protected isPK(predicate: FlureePredicate): boolean {
    return predicate.name === fc.IDENTIFIER;
  }

  protected isReadonly(predicate: FlureePredicate): boolean {
    return false;
  }
  protected isWriteOnly(predicate: FlureePredicate): boolean {
    return false;
  }
  protected examples(predicate: FlureePredicate): string[] {
    return [];
  }
  protected pattern(predicate: FlureePredicate): string {
    return predicate.type === ft.URI ? cc.URL_REGEX : '';
  }
  protected description(predicate: FlureePredicate): string {
    return predicate.doc;
  }
  protected minLength(predicate: FlureePredicate): number {
    return 0;
  }
  protected maxLength(predicate: FlureePredicate): number {
    return 0;
  }
  protected comment(predicate: FlureePredicate): string {
    return predicate.specDoc;
  }

  protected externalModule(predicate: FlureePredicate): string {
    return '';
  }
}
