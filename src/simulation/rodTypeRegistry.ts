import RodType, { RodTypeInfo } from './rodType';

export type RodTypeInput = RodTypeInfo | string | number;

export default class RodTypeRegistry {
  /** Default type cache */
  static _default?: RodTypeRegistry;

  /** Get default rod registry */
  static get defaultRegistry() {
    if (!RodTypeRegistry._default) {
      RodTypeRegistry._default = new RodTypeRegistry([...RodType.defaultRodTypes]);
    }
    return RodTypeRegistry._default;
  }

  _types: RodType[];

  constructor(types?: RodType[]) {
    this._types = types ?? [...RodTypeRegistry.defaultRegistry.types];
  }

  get types(): readonly RodType[] {
    return this._types;
  }

  /**
   * Get the rod type data by name.
   * @param id the id of rod type
   * @returns the rod type with matched id
   */
  get(id: number): RodType | null;
  /**
   * Get the rod type data by name.
   * @param fullname the fullname name of rod type
   * @returns the rod type with matched name
   */
  get(fullname: string): RodType | null;
  get(arg: string | number): RodType | null;
  get(arg: string | number): RodType | null {
    let result: RodType | undefined;
    if (typeof arg === 'string') {
      result = this._types.find((x) => x.fullname === arg);
    } else {
      result = this._types.find((x) => x.id === arg);
    }
    return result ?? null;
  }

  /**
   * Construct a new rod type into this registry.
   * If id exist, existing id will be
   * @param info the rod type info
   */
  set(info: RodTypeInfo) {
    let type = this.get(info.id);
    if (!type) {
      type = this.get(info.fullname);
    }
    if (type) {
      type.update(info);
      return type;
    } else {
      type = new RodType(info);
      this._types.push(type);
      return type;
    }
  }

  /**
   * Parse type input.
   * * If the type is known, update if possible, then returns.
   * * If the type is unknown, init if possible, otherwise throws.
   * @param input the type info input
   * @returns the type class
   * @throws if fullname or id is unknown and init info is not provided.
   */
  parse(input: RodTypeInput): RodType {
    if (typeof input === 'object') {
      return this.set(input);
    } else {
      const result = this.get(input);
      if (!result) {
        if (typeof input === 'string') {
          throw new Error(`Unknown rod type with fullname "${input}"`);
        } else {
          throw new Error(`Unknown rod type with id "${input}"`);
        }
      }
      return result;
    }
  }
}
