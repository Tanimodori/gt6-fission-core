import { Position } from 'src/types';
import { Reactor } from './reactor';
import Rod, { RodInput } from './rod';

/** Cell type */
export type CellType = '1x1' | '2x2';

/** Cell init config */
export interface CellInput extends Partial<Position> {
  /** type of this cell */
  type?: CellType;
  /** Rods of this cell */
  rods?: Array<RodInput>;
  /** Fluid used in this cell */
  fluid?: string;
}

/** Cell class */
export default class Cell {
  /** Reactor parent */
  reactor: Reactor;
  /** type of this cell */
  type: CellType = '2x2';
  /** Rods of this cell */
  rods: Rod[] = [];
  /** Fluid used in this cell */
  fluid?: string;
  /** X position inside parent */
  x!: number;
  /** Y position inside parent */
  y!: number;

  /**
   * Construct new cell.
   * @param input cell config
   * @param reactor reactor parent
   */
  constructor(input: CellInput, reactor: Reactor) {
    this.reactor = reactor;
    if (input.type) {
      this.type = input.type;
    }
    if (input.fluid) {
      this.fluid = input.fluid;
    }
  }

  /**
   * Returns side length of cell.
   *
   * * For `2x2` cells, returns `2`.
   * * For `1x1` cells, returns `1`.
   */
  get sideLength(): number {
    return this.type === '2x2' ? 2 : 1;
  }

  /**
   * Get next available position to add a rod
   * @returns next position to add a rod
   */
  getNextPos(): Position {
    if (this.rods.length === 0) {
      return { x: 0, y: 0 };
    } else {
      let { x, y } = this.rods[this.rods.length - 1];
      ++y;
      if (y >= this.sideLength) {
        ++x;
        y = 0;
      }
      return { x, y };
    }
  }
}