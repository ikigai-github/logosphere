import { Property } from '../canonical';
import { PropGenerator } from '../abstract';
import {
  FlureePredicate,
  flureeSystem as f,
  flureeTypes as ft,
  flureePredicates as fp,
} from '@logosphere/fluree';

export class FlureePropGenerator extends PropGenerator {
  private _typeMap = {
    number: ft.BIGINT,
    integer: ft.BIGINT,
  };

  #scalar(prop: Partial<Property>): string {
    if (prop.description && prop.description.indexOf(fp.TIME) > -1)
      return ft.INSTANT;
    else return this._typeMap[prop.type] ? this._typeMap[prop.type] : prop.type;
  }

  #common(prop: Partial<Property>) {
    return {
      _id: f.PREDICATE,
      name: prop.name,
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
      type: ft.TAG,
      restrictTag: true,
    };
  }
  protected generateEntity(prop: Partial<Property>): FlureePredicate {
    return {
      ...this.#common(prop),
      type: ft.REF,
      restrictCollection: prop.type,
    };
  }
  protected generateExternalEntity(prop: Partial<Property>): FlureePredicate {
    return {
      ...this.#common(prop),
      type: ft.STRING,
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
      type: ft.TAG,
      restrictTag: true,
      multi: true,
    };
  }
  protected generateEntityArray(prop: Partial<Property>): FlureePredicate {
    return {
      ...this.#common(prop),
      type: ft.REF,
      restrictCollection: prop.type,
      multi: true,
    };
  }
  protected generateExternalEntityArray(
    prop: Partial<Property>
  ): FlureePredicate {
    return {
      ...this.#common(prop),
      type: ft.STRING,
      doc: this.#externalDoc(prop),
      multi: true,
    };
  }

  generate(prop: Partial<Property>): FlureePredicate {
    return super.generate(prop) as FlureePredicate;
  }
}
