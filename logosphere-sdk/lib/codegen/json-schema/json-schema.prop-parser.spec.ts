import * as f from '../../../test/fixtures/schemas/monolith/json-schema.json';
import { JsonSchemaPropParser } from './json-schema.prop-parser';
import { DefinitionType } from '../canonical.schema';
import { constants as c } from './json-schema.constants';
describe('test JsonSchemaPropParser', () => {
  it('parse scalar', () => {
    const name = 'firstName';
    const propSchema = f.$defs.person.properties.firstName;
    const required = f.$defs.person.required;
    const propParser = new JsonSchemaPropParser(name, required, f.$defs);
    const prop = propParser.parse(propSchema);
    expect(prop.defType).toBe(DefinitionType.Scalar);
    expect(prop.name).toBe(name);
    expect(prop.type).toBe(propSchema.type);
    expect(prop.isEnabled).toBe(true);
    expect(prop.isRequired).toBe(true);
    expect(prop.isPK).toBe(false);
    expect(prop.isReadOnly).toBe(false);
    expect(prop.isWriteOnly).toBe(false);
    expect(prop.examples).toBeDefined();
    expect(prop.examples).toBeInstanceOf(Array);
    expect(prop.examples).toHaveLength(35);
    expect(prop.pattern).toBeUndefined();
    expect(prop.description).toBe('First name of a person');
    expect(prop.minLength).toBe(propSchema.minLength);
    expect(prop.maxLength).toBe(propSchema.maxLength);
    expect(prop.comment).toBeUndefined();
  });

  it('parse scalar array', () => {
    const name = 'tags';
    const propSchema = f.$defs.listing.properties.tags;
    const required = f.$defs.listing.required;
    const propParser = new JsonSchemaPropParser(name, required, f.$defs);
    const prop = propParser.parse(propSchema);
    expect(prop.defType).toBe(DefinitionType.ScalarArray);
    expect(prop.name).toBe(name);
    expect(prop.type).toBe(c.STRING);
    expect(prop.isEnabled).toBe(true);
    expect(prop.isRequired).toBe(false);
    expect(prop.isPK).toBe(false);
    expect(prop.isReadOnly).toBe(false);
    expect(prop.isWriteOnly).toBe(false);
    expect(prop.examples).toBeUndefined();
    expect(prop.pattern).toBeUndefined();
    expect(prop.description).toBeUndefined();
    expect(prop.minLength).toBeUndefined();
    expect(prop.maxLength).toBeUndefined();
    expect(prop.comment).toBeUndefined();
  });

  it('parse definition ref', () => {
    const name = 'artwork';
    const propSchema = f.$defs.listing.properties.artwork;
    const required = f.$defs.listing.required;
    const propParser = new JsonSchemaPropParser(name, required, f.$defs);
    const prop = propParser.parse(propSchema);
    expect(prop.defType).toBe(DefinitionType.Entity);
    expect(prop.name).toBe(name);
    expect(prop.type).toBe(name);
    expect(prop.isEnabled).toBe(true);
    expect(prop.isRequired).toBe(true);
    expect(prop.isPK).toBe(false);
    expect(prop.isReadOnly).toBe(false);
    expect(prop.isWriteOnly).toBe(false);
    expect(prop.examples).toBeUndefined();
    expect(prop.pattern).toBeUndefined();
    expect(prop.description).toBeUndefined();
    expect(prop.minLength).toBeUndefined();
    expect(prop.maxLength).toBeUndefined();
    expect(prop.comment).toBeUndefined();
  });

  it('parse array of def refs', () => {
    const name = 'addresses';
    const propSchema = f.$defs.person.properties.addresses;
    const required = f.$defs.person.required;
    const propParser = new JsonSchemaPropParser(name, required, f.$defs);
    const prop = propParser.parse(propSchema);
    expect(prop.defType).toBe(DefinitionType.EntityArray);
    expect(prop.name).toBe(name);
    expect(prop.type).toBe('address');
    expect(prop.isEnabled).toBe(true);
    expect(prop.isRequired).toBe(false);
    expect(prop.isPK).toBe(false);
    expect(prop.isReadOnly).toBe(false);
    expect(prop.isWriteOnly).toBe(false);
    expect(prop.examples).toBeUndefined();
    expect(prop.pattern).toBeUndefined();
    expect(prop.description).toBeUndefined();
    expect(prop.minLength).toBeUndefined();
    expect(prop.maxLength).toBeUndefined();
    expect(prop.comment).toBeUndefined();
  });

  it('parse enum', () => {
    const name = 'socialMediaType';
    const propSchema = f.$defs.socialMedia.properties.socialMediaType;
    const required = f.$defs.socialMedia.required;
    const propParser = new JsonSchemaPropParser(name, required, f.$defs);
    const prop = propParser.parse(propSchema);
    expect(prop.defType).toBe(DefinitionType.Enum);
    expect(prop.name).toBe(name);
    expect(prop.type).toBe(name);
    expect(prop.isEnabled).toBe(true);
    expect(prop.isRequired).toBe(false);
    expect(prop.isPK).toBe(false);
    expect(prop.isReadOnly).toBe(false);
    expect(prop.isWriteOnly).toBe(false);
    expect(prop.examples).toBeDefined();
    expect(prop.examples).toHaveLength(6);
    expect(prop.pattern).toBeUndefined();
    expect(prop.description).toBeUndefined();
    expect(prop.minLength).toBeUndefined();
    expect(prop.maxLength).toBeUndefined();
    expect(prop.comment).toBeUndefined();
  });

  it('parse enum array', () => {
    const name = 'socialMediaTypes';
    const propSchema = f.$defs.user.properties.socialMediaTypes;
    const required = f.$defs.user.required;
    const propParser = new JsonSchemaPropParser(name, required, f.$defs);
    const prop = propParser.parse(propSchema);
    expect(prop.defType).toBe(DefinitionType.EnumArray);
    expect(prop.name).toBe(name);
    expect(prop.type).toBe('socialMediaType');
    expect(prop.isEnabled).toBe(true);
    expect(prop.isRequired).toBe(false);
    expect(prop.isPK).toBe(false);
    expect(prop.isReadOnly).toBe(false);
    expect(prop.isWriteOnly).toBe(false);
    expect(prop.examples).toBeDefined();
    expect(prop.examples).toHaveLength(6);
    expect(prop.pattern).toBeUndefined();
    expect(prop.description).toBeUndefined();
    expect(prop.minLength).toBeUndefined();
    expect(prop.maxLength).toBeUndefined();
    expect(prop.comment).toBeUndefined();
  });

  it('parse external definition ref', () => {
    const name = 'author';
    const propSchema = f.$defs.artwork.properties.author;
    const required = f.$defs.artwork.required;
    const propParser = new JsonSchemaPropParser(name, required, f.$defs);
    const prop = propParser.parse(propSchema);
    expect(prop.defType).toBe(DefinitionType.ExternalEntity);
    expect(prop.externalModule).toBe('user');
    expect(prop.name).toBe(name);
    expect(prop.type).toBe('user');
    expect(prop.isEnabled).toBe(true);
    expect(prop.isRequired).toBe(true);
    expect(prop.isPK).toBe(false);
    expect(prop.isReadOnly).toBe(false);
    expect(prop.isWriteOnly).toBe(false);
    expect(prop.examples).toBeUndefined();
    expect(prop.pattern).toBeUndefined();
    expect(prop.description).toBeUndefined();
    expect(prop.minLength).toBeUndefined();
    expect(prop.maxLength).toBeUndefined();
    expect(prop.comment).toBeUndefined();
  });

  it('parse array of external def refs', () => {
    const name = 'imageVariants';
    const propSchema = f.$defs.artwork.properties.imageVariants;
    const required = f.$defs.artwork.required;
    const propParser = new JsonSchemaPropParser(name, required, f.$defs);
    const prop = propParser.parse(propSchema);
    expect(prop.defType).toBe(DefinitionType.ExternalEntityArray);
    expect(prop.externalModule).toBe('minting');
    expect(prop.name).toBe(name);
    expect(prop.type).toBe('imageVariant');
    expect(prop.isEnabled).toBe(true);
    expect(prop.isRequired).toBe(true);
    expect(prop.isPK).toBe(false);
    expect(prop.isReadOnly).toBe(false);
    expect(prop.isWriteOnly).toBe(false);
    expect(prop.examples).toBeUndefined();
    expect(prop.pattern).toBeUndefined();
    expect(prop.description).toBeUndefined();
    expect(prop.minLength).toBeUndefined();
    expect(prop.maxLength).toBeUndefined();
    expect(prop.comment).toBeUndefined();
  });
});
