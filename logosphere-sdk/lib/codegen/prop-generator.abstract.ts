import { DefinitionType, Property } from './canonical.schema';
export abstract class PropGenerator {
  protected abstract generateScalar(prop: Partial<Property>): string;
  protected abstract generateEnum(prop: Partial<Property>): string;
  protected abstract generateEntity(prop: Partial<Property>): string;
  protected abstract generateExternalEntity(prop: Partial<Property>): string;
  protected abstract generateScalarArray(prop: Partial<Property>): string;
  protected abstract generateEnumArray(prop: Partial<Property>): string;
  protected abstract generateEntityArray(prop: Partial<Property>): string;
  protected abstract generateExternalEntityArray(prop: Partial<Property>): string;
  generate(prop: Partial<Property>): string {
    switch (prop.defType) {
      case DefinitionType.Scalar:
        return this.generateScalar(prop);
      case DefinitionType.Enum:
        return this.generateEnum(prop);
      case DefinitionType.Entity:
        return this.generateEntity(prop);
      case DefinitionType.ExternalEntity:
          return this.generateExternalEntity(prop);
      case DefinitionType.ScalarArray:
        return this.generateScalarArray(prop);
      case DefinitionType.EnumArray:
        return this.generateEnumArray(prop);
      case DefinitionType.EntityArray:
        return this.generateEntityArray(prop);
      case DefinitionType.ExternalEntityArray:
        return this.generateExternalEntityArray(prop);
      default:
        throw Error(`Property generator for the definition type ${prop.defType} is not implemented`)
    }
  }
}
