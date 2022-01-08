import { DefinitionType } from '../canonical.schema';
import { PropParser } from '../prop-parser.abstract';
import { constants as c } from './json-schema.constants';
import { hasKey } from '../converters/util';

/***
 * Converts JSON Schema to Canonical Schema
 */
export class JsonSchemaPropParser extends PropParser {
  
  private _required: string[];
  private _defSchema: any;

  constructor(name: string, required: string[], defSchema: any) {
    super(name);
    this._required = required;
    this._defSchema = defSchema;
  }

  #extractKey = <U>(propSchema: any, fn: (propSchema: any) => U) => {
    return (): U => {
      if (
        this.defType(propSchema) === DefinitionType.ScalarArray ||
        this.defType(propSchema) === DefinitionType.DefArray ||
        this.defType(propSchema) === DefinitionType.LinkedDefArray ||
        this.defType(propSchema) === DefinitionType.EnumArray
      ) {
        return fn(propSchema[c.ITEMS]) as U;
      } else {
        return fn(propSchema) as U;
      }
    };
  };

  #stripRef = (ref: string) => {
    return ref.split('/').pop();
  };

  #isEnum = (propSchema: any) => {
    return (
      hasKey(propSchema, c.REF, c.STRING) &&
      hasKey(
        this._defSchema,
        this.#stripRef(propSchema[c.REF] as string),
        c.OBJECT
      ) &&
      hasKey(
        this._defSchema[this.#stripRef(propSchema[c.REF] as string)],
        c.ENUM,
        c.OBJECT
      )
    );
  };

  #isArray = (propSchema: any) => {
    return (
      hasKey(propSchema, c.TYPE, c.STRING) &&
      propSchema[c.TYPE] === c.ARRAY &&
      hasKey(propSchema, c.ITEMS, c.OBJECT)
    );
  };

  #isDefinition = (propSchema: any) => {
    return (
      hasKey(propSchema, c.REF, c.STRING) &&
      !this.#isEnum(propSchema) &&
      !this.#isLinked(propSchema)
    );
  };

  #isLinked = (propSchema: any) => {
    return (
       hasKey(propSchema, c.REF, c.STRING) && 
       (propSchema[c.REF] as string).includes(c.JSON_EXTENSION)) ||
       // we put circular reference in default to avoid 
       // circular references bloating issue in Hackolade
       (hasKey(propSchema, c.DEFAULT, c.STRING) && 
       (propSchema[c.DEFAULT] as string).includes(c.JSON_EXTENSION))
  };
 
  #getLinkedModule = (value: string) => {
    return value.split('#')[0].split('/').pop().replace(c.LINKED_FILE_EXTENSION, '');
  }

  #getLinkedType = (value: string) => {
    return value.split('#').pop();
  }
  

  protected defType(propSchema: any): DefinitionType {
    if (this.#isEnum(propSchema)) {
      return DefinitionType.Enum;
    } else if (this.#isLinked(propSchema)) {
      return DefinitionType.LinkedDef;
    } else if (this.#isDefinition(propSchema)) {
      return DefinitionType.Definition;
    } else if (this.#isArray(propSchema) && this.#isEnum(propSchema[c.ITEMS])) {
      return DefinitionType.EnumArray;
    } else if (
      this.#isArray(propSchema) &&
      this.#isLinked(propSchema[c.ITEMS])
    ) {
      return DefinitionType.LinkedDefArray;
    } else if (
      this.#isArray(propSchema) &&
      this.#isDefinition(propSchema[c.ITEMS])
    ) {
      return DefinitionType.DefArray;
    } else if (this.#isArray(propSchema)) {
      return DefinitionType.ScalarArray;
    } else {
      return DefinitionType.Scalar;
    }
  }

  protected type(propSchema: any): string {
    return this.#extractKey(propSchema, (propSchema: any) => {
      if (
        this.defType(propSchema) === DefinitionType.Definition ||
        this.defType(propSchema) === DefinitionType.Enum
      ) {
        return this.#stripRef(propSchema[c.REF]);
      } else if (this.defType(propSchema) === DefinitionType.LinkedDef) {
        return hasKey(propSchema, c.REF, c.STRING) ? this.#stripRef(propSchema[c.REF] as string) 
          : hasKey(propSchema, c.DEFAULT, c.STRING) ? this.#getLinkedType(propSchema[c.DEFAULT] as string) : undefined;
      } else if (hasKey(propSchema, c.TYPE, c.STRING)) {
        return propSchema[c.TYPE] as string;
      } else {
        return c.ANY;
      }
    })();
  }

  protected isEnabled(propSchema: any): boolean {
    return this.#extractKey(propSchema, (propSchema: any) => {
      return propSchema[c.IS_ACTIVATED];
    })();
  }

  protected isRequired(propSchema: any): boolean {
    propSchema;
    if (this._required) {
      return this._required.indexOf(this._name) > -1;
    } else {
      return false;
    }
  }

  protected isPK(propSchema: any): boolean {
    return this.#extractKey(propSchema, (propSchema: any) => {
      return propSchema[c.PRIMARY_KEY] || false;
    })();
  }
  protected isReadonly(propSchema: any): boolean {
    return this.#extractKey(propSchema, (propSchema: any) => {
      return propSchema[c.READ_ONLY] || false;
    })();
  }
  protected isWriteOnly(propSchema: any): boolean {
    return this.#extractKey(propSchema, (propSchema: any) => {
      return propSchema[c.WRITE_ONLY] || false;
    })();
  }
  protected examples(propSchema: any): string[] {
    return this.#extractKey(propSchema, (propSchema: any) => {
      if (this.defType(propSchema) === DefinitionType.Enum) {
        return this._defSchema[this.#stripRef(propSchema[c.REF])][c.ENUM];
      } else {
        return propSchema[c.EXAMPLES];
      }
    })();
  }
  protected pattern(propSchema: any): string {
    return this.#extractKey(propSchema, (propSchema: any) => {
      return propSchema[c.PATTERN];
    })();
  }
  protected description(propSchema: any): string {
    return this.#extractKey(propSchema, (propSchema: any) => {
      return propSchema[c.DESCRIPTION];
    })();
  }
  protected minLength(propSchema: any): number {
    return this.#extractKey(propSchema, (propSchema: any) => {
      return propSchema[c.MIN_LENGTH];
    })();
  }
  protected maxLength(propSchema: any): number {
    return this.#extractKey(propSchema, (propSchema: any) => {
      return propSchema[c.MAX_LENGTH];
    })();
  }
  protected comment(propSchema: any): string {
    return this.#extractKey(propSchema, (propSchema: any) => {
      return propSchema[c.COMMENT];
    })();
  }

  protected linkedModule(propSchema: any): string {
    return this.#extractKey(propSchema, (propSchema: any) => {
      if (hasKey(propSchema, c.REF, c.STRING) && 
        (propSchema[c.REF] as string).indexOf(c.JSON_EXTENSION) > -1) {
        return this.#getLinkedModule(propSchema[c.REF] as string);
      } else if (hasKey(propSchema, c.DEFAULT, c.STRING) && 
        (propSchema[c.DEFAULT] as string).indexOf(c.JSON_EXTENSION)) {
        return this.#getLinkedModule(propSchema[c.DEFAULT] as string);
      } else {
        return undefined;
      }
    })();
    
  }

}
