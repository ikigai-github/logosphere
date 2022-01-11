import { Property } from '../canonical.schema';
import { PropGenerator } from '../abstract/prop-generator.abstract';
export class FlureePropGenerator extends PropGenerator {
  protected generateScalar(prop: Partial<Property>): string {
    throw new Error('Method not implemented.');
  }
  protected generateEnum(prop: Partial<Property>): string {
    throw new Error('Method not implemented.');
  }
  protected generateEntity(prop: Partial<Property>): string {
    throw new Error('Method not implemented.');
  }
  protected generateExternalEntity(prop: Partial<Property>): string {
    throw new Error('Method not implemented.');
  }
  protected generateScalarArray(prop: Partial<Property>): string {
    throw new Error('Method not implemented.');
  }
  protected generateEnumArray(prop: Partial<Property>): string {
    throw new Error('Method not implemented.');
  }
  protected generateEntityArray(prop: Partial<Property>): string {
    throw new Error('Method not implemented.');
  }
  protected generateExternalEntityArray(prop: Partial<Property>): string {
    throw new Error('Method not implemented.');
  }
}
