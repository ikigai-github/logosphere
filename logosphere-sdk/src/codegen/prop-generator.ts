import { DefinitionType, IProperty } from './canonical.schema';
export abstract class PropGenerator {
  protected abstract genEnum(prop: Partial<IProperty>): string;
  protected abstract genDefinition(prop: Partial<IProperty>): string;
  protected abstract genScalar(prop: Partial<IProperty>): string;
  protected abstract genScalarArray(prop: Partial<IProperty>): string;
  protected abstract genDefArray(prop: Partial<IProperty>): string;
  protected abstract genEnumArray(prop: Partial<IProperty>): string;
  protected abstract genLinkedDef(prop: Partial<IProperty>): string;
  protected abstract genLinkedDefArray(prop: Partial<IProperty>): string;
  generate(prop: Partial<IProperty>): string {
    switch (prop.defType) {
      case DefinitionType.Enum:
        return this.genEnum(prop);
      case DefinitionType.Definition:
        return this.genDefinition(prop);
      case DefinitionType.Scalar:
        return this.genScalar(prop);
      case DefinitionType.ScalarArray:
        return this.genScalarArray(prop);
      case DefinitionType.DefArray:
        return this.genScalarArray(prop);
      case DefinitionType.EnumArray:
        return this.genEnumArray(prop);
      case DefinitionType.LinkedDef:
        return this.genLinkedDef(prop);
      case DefinitionType.LinkedDefArray:
        return this.genLinkedDefArray(prop);
    }
  }
}
