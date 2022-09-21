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

  it('Can query rod types', () => {
    const testRodType = RodType.defaultRodTypes[0];
    const registry = RodTypeRegistry.defaultRegistry;
    expect(registry.get(testRodType.fullname)).toBe(testRodType);
  });
});
