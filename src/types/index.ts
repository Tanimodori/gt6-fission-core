/** Position data */
export interface Position {
  /** X position inside parent */
  x: number;
  /** Y position inside parent */
  y: number;
}

/** Fuel rod type infomation */
export interface RodType {
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
}

/**
 * Rod data
 */
export interface Rod extends Position {
  /** Container cell */
  cell: Cell;
  /** Fullname of the rod type */
  type: RodType;
  /** Current duablility. -1 for infinity. */
  duability: number;
}

/** Cell data */
export interface Cell extends Position {
  /** Rods of this cell */
  rods: Rod[];
  /** Fluid used in this cell */
  fluid: string;
}

export type Maybe<T, U> = T | (T & U);
export type RodInputObject = Maybe<Maybe<{ type: string | RodType }, Position>, Pick<Rod, 'duability'>>;
export type RodInput = string | RodInputObject;
export type CellInput = Omit<Cell, 'rods'> & { rods: Array<RodInput> };

/** Configuration of simulation run */
export interface Config {
  /** Cells in the reactor */
  cells: CellInput[];
}
