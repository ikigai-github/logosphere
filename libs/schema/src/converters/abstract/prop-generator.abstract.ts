/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefinitionType, Property } from '../canonical/canonical.schema';
export abstract class PropGenerator {
  protected abstract generateScalar(prop: Property): any;
  protected abstract generateEnum(prop: Property): any;
  protected abstract generateEntity(prop: Property): any;
  protected abstract generateExternalEntity(prop: Property): any;
  protected abstract generateScalarArray(prop: Property): any;
  protected abstract generateEnumArray(prop: Property): any;
  protected abstract generateEntityArray(prop: Property): any;
  protected abstract generateExternalEntityArray(prop: Property): any;
  generate(prop: Property): any {
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
