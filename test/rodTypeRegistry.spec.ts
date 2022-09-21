import RodType from 'src/simulation/rodType';
import RodTypeRegistry from 'src/simulation/rodTypeRegistry';
import { describe, it, expect } from 'vitest';

describe('RodTypeRegistry.defaultRegistry', () => {
  it('Should return valid registry', () => {
    expect(RodTypeRegistry.defaultRegistry).toBeInstanceOf(RodTypeRegistry);
    expect(RodTypeRegistry.defaultRegistry.types.length).toBeGreaterThan(0);
  });

  it('Should return same registry', () => {
    expect(RodTypeRegistry.defaultRegistry).toBe(RodTypeRegistry.defaultRegistry);
  });
});

describe('RodTypeRegistry.get', () => {
  it('Can query rod types', () => {
    const registry = RodTypeRegistry.defaultRegistry;
    const rodType = registry.types[0];
    expect(registry.get(rodType.fullname)).toBe(rodType);
    expect(registry.get(rodType.id)).toBe(rodType);
  });

  it('Returns null if not found', () => {
    const registry = RodTypeRegistry.defaultRegistry;
    expect(registry.get('NotExistRodType')).toBe(null);
    expect(registry.get(-1)).toBe(null);
  });
});
