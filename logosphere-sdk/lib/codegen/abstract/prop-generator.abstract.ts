import { DefinitionType, Property } from '../canonical.schema';
export abstract class PropGenerator {
  protected abstract generateScalar(prop: Partial<Property>): any;
  protected abstract generateEnum(prop: Partial<Property>): any;
  protected abstract generateEntity(prop: Partial<Property>): any;
  protected abstract generateExternalEntity(prop: Partial<Property>): any;
  protected abstract generateScalarArray(prop: Partial<Property>): any;
  protected abstract generateEnumArray(prop: Partial<Property>): any;
  protected abstract generateEntityArray(prop: Partial<Property>): any;
  protected abstract generateExternalEntityArray(
    prop: Partial<Property>
  ): any;
  generate(prop: Partial<Property>): any {
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
        throw Error(
          `Property generator for the definition type ${prop.defType} is not implemented`
        );
    }
  }
}
