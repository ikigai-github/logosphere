import { SHA256Identifier } from './sha256-identifier';
describe('SHA256 identifier', () => {
  it('should generate new SHA256 identifier', () => {
    const identifier = new SHA256Identifier({ name: 'test' });
    expect(identifier).toBeDefined();
    expect(identifier.toString()).toHaveLength(64);
  });

  it('should create new identifier from string', () => {
    const id =
      '6552ccc4b9025ba2917dcf5aa997d082d3e8d088b4bf00694b8cfb03e176e364';
    const identifier = new SHA256Identifier(id);
    expect(identifier).toBeDefined();
    expect(identifier.toString()).toBe(id);
  });

  it('objects with same props should have different identifiers', () => {
    const identifier1 = new SHA256Identifier({ name: 'test' });
    const identifier2 = new SHA256Identifier({ name: 'test' });
    expect(identifier1.equals(identifier2)).toBeFalsy();
  });
});
