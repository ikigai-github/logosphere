import { Property } from '../canonical.schema';
import { PropGenerator } from '../abstract';
import { FlureePredicate } from './fluree.schema';
import { constants as c } from './fluree.constants';
export class FlureePropGenerator extends PropGenerator {

  private _typeMap = {
    number: c.BIGINT,
    integer: c.BIGINT,
  };

  #scalar(prop: Partial<Property>): string {
    if (prop.description && 
        prop.description.indexOf(c.TIME) > -1)
      return c.INSTANT 
    else
      return this._typeMap[prop.type] ? this._typeMap[prop.type] : prop.type;
  }

  #isUnique(prop: Partial<Property>) {
    return prop.name === c.IDENTIFIER;
  }

  #common(prop: Partial<Property>) {
    return {
      _id: c.PREDICATE,
      name: `${this.collection}/${prop.name}`,
      doc: prop.description,
      index: true,
      unique: this.#isUnique(prop)
    }
  }

  constructor(private readonly collection: string) {
    super();
  }

  protected generateScalar(prop: Partial<Property>): FlureePredicate {
    return {
      ...this.#common(prop),
      type: this.#scalar(prop),
    }
  }
  protected generateEnum(prop: Partial<Property>): FlureePredicate {
    return {} as FlureePredicate;
  }
  protected generateEntity(prop: Partial<Property>): FlureePredicate {
    return {
      ...this.#common(prop),
      type: c.REF,
      restrictCollection: prop.type
    };
  }
  protected generateExternalEntity(prop: Partial<Property>): FlureePredicate {
    return {
      ...this.#common(prop),
      type: c.STRING,
      doc: `${prop.description} (identifier of ${prop.type})`
    };
  }
  protected generateScalarArray(prop: Partial<Property>): FlureePredicate {
    return {
      ...this.#common(prop),
      type: this.#scalar(prop),
      multi: true
    };
  }
  protected generateEnumArray(prop: Partial<Property>): FlureePredicate {
    return {} as FlureePredicate;
  }
  protected generateEntityArray(prop: Partial<Property>): FlureePredicate {
    return {
      ...this.#common(prop),
      type: c.REF,
      restrictCollection: prop.type,
      multi: true
    };
  }
  protected generateExternalEntityArray(prop: Partial<Property>): FlureePredicate {
    return {
      ...this.#common(prop),
      type: c.STRING,
      doc: `${prop.description} (identifier of ${prop.type})`,
      multi: true
    };
  }

  generate(prop: Partial<Property>): FlureePredicate {

    return super.generate(prop) as FlureePredicate;

  }
}
