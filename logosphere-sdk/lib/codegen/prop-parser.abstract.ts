import { Property, DefinitionType } from './canonical.schema';

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
  protected abstract externalModule(schema: any): string;

  constructor(name: string) {
    this._name = name;
  }

  parse(propSchema: any): Partial<Property> {
    return {
      name: this._name,
      type: this.type(propSchema),
      isEnabled: this.isEnabled(propSchema),
      isRequired: this.isRequired(propSchema),
      isPK: this.isPK(propSchema),
      isReadOnly: this.isReadonly(propSchema),
      isWriteOnly: this.isWriteOnly(propSchema),
      defType: this.defType(propSchema),
      examples: this.examples(propSchema),
      pattern: this.pattern(propSchema),
      description: this.description(propSchema),
      minLength: this.minLength(propSchema),
      maxLength: this.maxLength(propSchema),
      comment: this.comment(propSchema),
      externalModule: this.externalModule(propSchema),
    };
  }
}
