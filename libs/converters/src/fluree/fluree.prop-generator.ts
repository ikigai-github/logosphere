import { Property } from '../canonical';
import { PropGenerator } from '../abstract';
import { FlureePredicate } from './fluree.schema';
import { constants as c, types as t } from './fluree.constants';
import { strings as s } from '@angular-devkit/core';

export class FlureePropGenerator extends PropGenerator {
  private _typeMap = {
    number: t.BIGINT,
    integer: t.BIGINT,
  };

  #scalar(prop: Partial<Property>): string {
    if (prop.description && prop.description.indexOf(c.TIME) > -1)
      return t.INSTANT;
    else return this._typeMap[prop.type] ? this._typeMap[prop.type] : prop.type;
  }

  #common(prop: Partial<Property>) {
    return {
      _id: c.PREDICATE,
      name: `${this.collection}/${prop.name}`,
      doc: prop.description,
      index: prop.isIndexed || false,
      unique: prop.isUnique || false,
    };
  }

  #externalDoc(prop: Partial<Property>) {
    return `${prop.description ? prop.description + ', ' : ''}identifier of ${
      prop.type
    }`;
  }

  constructor(private readonly collection: string) {
    super();
  }

  protected generateScalar(prop: Partial<Property>): FlureePredicate {
    return {
      ...this.#common(prop),
      type: this.#scalar(prop),
    };
  }
  protected generateEnum(prop: Partial<Property>): FlureePredicate {
    return {
      ...this.#common(prop),
      type: t.TAG,
      restrictTag: true,
    };
  }
  protected generateEntity(prop: Partial<Property>): FlureePredicate {
    return {
      ...this.#common(prop),
      type: c.REF,
      restrictCollection: prop.type,
    };
  }
  protected generateExternalEntity(prop: Partial<Property>): FlureePredicate {
    return {
      ...this.#common(prop),
      type: t.STRING,
      doc: this.#externalDoc(prop),
    };
  }
  protected generateScalarArray(prop: Partial<Property>): FlureePredicate {
    return {
      ...this.#common(prop),
      type: this.#scalar(prop),
      multi: true,
    };
  }
  protected generateEnumArray(prop: Partial<Property>): FlureePredicate {
    return {
      ...this.#common(prop),
      type: t.TAG,
      restrictTag: true,
      multi: true,
    };
  }
  protected generateEntityArray(prop: Partial<Property>): FlureePredicate {
    return {
      ...this.#common(prop),
      type: c.REF,
      restrictCollection: prop.type,
      multi: true,
    };
  }
  protected generateExternalEntityArray(
    prop: Partial<Property>
  ): FlureePredicate {
    return {
      ...this.#common(prop),
      type: t.STRING,
      doc: this.#externalDoc(prop),
      multi: true,
    };
  }

  generate(prop: Partial<Property>): FlureePredicate {
    return super.generate(prop) as FlureePredicate;
  }
}
