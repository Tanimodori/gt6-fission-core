import { defaultRodTypeInfos } from './defaults';

export * from './defaults';

/** Fuel rod type infomation */
export interface RodTypeInfo {
  /** In-game item id */
  id: number;
  /**
   * Full name used in translation key
   * @example Uranium235
   */
  fullname: string;
  /**
   * Abbreviation of base material/element name,
   * use with superscript
   * @example U
   */
  basename: string;
  /**
   * Superscript of base material/element name,
   * use with basename
   * @example 235
   */
  superscript: string;
  /**
   * Color of rod in the form of `#\d{6}`
   */
  color: string;
  /**
   * Maxinum duablility. -1 for infinity.
   */
  duability: number;
  /**
   * Emssion to self per second.
   */
  emissionSelf: number;
  /**
   * Emission to adjacent rods per second
   */
  emissionOthers: number;
  /**
   * Factor to divide on emission.
   */
  factor: number;
}

/** Fuel rod type class */
export default class RodType {
  /** In-game item id. */
  id!: number;
  /**
   * Full name used in translation key
   * @example Uranium235.
   */
  fullname!: string;
  /**
   * Abbreviation of base material/element name,
   * use with superscript.
   * @example U
   */
  basename!: string;
  /**
   * Superscript of base material/element name,
   * use with basename.
   * @example 235
   */
  superscript!: string;
  /**
   * Color of rod in the form of `#\d{6}`.
   */
  color!: string;
  /**
   * Maxinum duablility. -1 for infinity.
   */
  duability!: number;
  /**
   * Emssion to self per second.
   */
  emissionSelf!: number;
  /**
   * Emission to adjacent rods per second.
   */
  emissionOthers!: number;
  /**
   * Factor to divide on emission.
   */
  factor!: number;

  static _defaults?: RodType[];
  static get defaultRodTypes() {
    if (!RodType._defaults) {
      RodType._defaults = defaultRodTypeInfos.map((x) => new RodType(x));
    }
    return RodType._defaults;
  }

  /**
   * Construct a new rod type
   * @param info the rod type info
   */
  constructor(info: RodTypeInfo) {
    this.update(info);
  }

  /**
   * Update rod type info
   * @param info the rod type info
   */
  update(info: Partial<RodTypeInfo>) {
    const keys = [
      'id',
      'fullname',
      'basename',
      'superscript',
      'color',
      'duability',
      'emissionSelf',
      'emissionOthers',
      'factor',
    ] as const;
    for (const field of keys) {
      if (field in info) {
        (this[field] as unknown) = info[field];
      }
    }
  }

  /**
   * Port of GregTech 6 `divup` function
   * for computing `Math.ceiling(a/b)`
   * @param a the number to be divided
   * @param b the number to divide
   * @returns the division
   */
  static divup(a: number, b: number) {
    const r = a % b;
    return (a - r) / b + (r ? 1 : 0);
  }

  /**
   * Compute emission to all adjacent rods.
   * @param nReceived the total received neutrons on last second, include self-emission
   * @returns the total emission to all adjacent rods
   */
  getEmissionOthers(nReceived: number) {
    if (nReceived < this.emissionSelf) {
      throw new Error(`nReceived is lower than emissionSelf.`);
    }
    return RodType.divup(nReceived - this.emissionSelf, this.factor) + this.emissionOthers;
  }
}
