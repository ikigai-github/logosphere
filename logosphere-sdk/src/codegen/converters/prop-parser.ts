import { IProperty, DefinitionType } from "./canonical.schema";

export abstract class PropParser {
  protected _name: string;

  protected abstract type(schema: any): string;
  protected abstract isEnabled(schema: any): boolean;
  protected abstract isRequired(schema: any): boolean;
  protected abstract isPK(schema: any): boolean;
  protected abstract isReadonly(schema: any): boolean;
  protected abstract isWriteOnly(schema: any): boolean;
  protected abstract defType(schema: any): DefinitionType;
  protected abstract examples(schema: any): string[];
  protected abstract pattern(schema: any): string;
  protected abstract description(schema: any): string;
  protected abstract minLength(schema: any): number;
  protected abstract maxLength(schema: any): number;
  protected abstract comment(schema: any): string;

  constructor(name: string) {
    this._name = name;
  }

  parse(schema: any): Partial<IProperty> {
    return {
      name: this._name,
      type: this.type(schema),
      isEnabled: this.isEnabled(schema),
      isRequired: this.isRequired(schema),
      isPK: this.isPK(schema),
      isReadOnly: this.isReadonly(schema),
      isWriteOnly: this.isWriteOnly(schema),
      defType: this.defType(schema),
      examples: this.examples(schema),
      pattern: this.pattern(schema),
      description: this.description(schema),
      minLength: this.minLength(schema),
      maxLength: this.maxLength(schema),
      comment: this.comment(schema),
    };
  }
}
