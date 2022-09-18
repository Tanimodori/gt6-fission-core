import RodType from 'src/simulation/rodType';

/** Position data */
export interface Position {
  /** X position inside parent */
  x: number;
  /** Y position inside parent */
  y: number;
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

/** Cell type */
export type CellType = '1x1' | '2x2';

/** Cell data */
export interface Cell extends Position {
  /** type of this cell */
  type: CellType;
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
