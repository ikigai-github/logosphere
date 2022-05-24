import { Definition, DefinitionType } from '@logosphere/converters';
import * as tsFormatter from './ts-formatter';

describe('TypeScript Formatter', () => {
  it('it should return formatter for entity in  DTO', () => {
    const prop = {
      name: 'entityProp',
      type: 'SomeEntity',
      defType: DefinitionType.Entity,
    };

    const f = tsFormatter.dtoProp(prop);
    expect(f.name).toBe('entityProp?');
    expect(f.type).toBe('SomeEntityDto');
  });

  it('it should return formatter for enum in  DTO', () => {
    const prop = {
      name: 'enumProp',
      type: 'SomeEnum',
      defType: DefinitionType.Enum,
    };

    const f = tsFormatter.dtoProp(prop);
    expect(f.name).toBe('enumProp?');
    expect(f.type).toBe('SomeEnum');
  });

  it('should return enum import in DTO', () => {
    const d: Definition = {
      name: 'testDef',
      type: DefinitionType.Entity,
      props: [
        {
          name: 'enumProp',
          type: 'SomeEnum',
          defType: DefinitionType.Enum,
        },
      ],
    };

    const imp = tsFormatter.enumImports(d);

    expect(imp).toBeDefined();
    expect(imp).toHaveLength(1);
    expect(imp[0]).toBe('SomeEnum');
  });

  it('should return entity import in DTO', () => {
    const d: Definition = {
      name: 'testDef',
      type: DefinitionType.Entity,
      props: [
        {
          name: 'entityProp',
          type: 'SomeEntity',
          defType: DefinitionType.Entity,
        },
      ],
    };

    const imp = tsFormatter.dtoImports(d);

    expect(imp).toBeDefined();
    expect(imp).toHaveLength(1);
    expect(imp[0].name).toBe('SomeEntityDto');
    expect(imp[0].file).toBe('./some-entity.dto');
  });

  it('should return empty imports', () => {
    const d: Definition = {
      name: 'testDef',
      type: DefinitionType.Entity,
      props: [
        {
          name: 'scalarProp',
          type: 'string',
          defType: DefinitionType.Scalar,
        },
      ],
    };

    const imp = tsFormatter.dtoImports(d);

    expect(imp).toBeDefined();
    expect(imp).toHaveLength(0);
  });
});
