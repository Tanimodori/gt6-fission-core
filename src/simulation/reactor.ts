import { Position } from 'src/types';
import Cell, { CellInput } from './cell';
import RodTypeRegistry from './rodTypeRegistry';

/** Configuration of reactor */
export interface ReactorInput {
  /** Cells in the reactor */
  cells: CellInput[];
}

/** Reactor class */
export class Reactor {
  registry: RodTypeRegistry;
  cells: Cell[];

  /**
   * Construct new reactor.
   * @param input reactor config
   */
  constructor(input: ReactorInput) {
    this.registry = new RodTypeRegistry();
    this.cells = input.cells.map((x) => new Cell(x, this));
  }

  /**
   * Get next available position to add a cell
   * @returns next position to add a cell
   */
  getNextPos(): Position {
    if (this.cells.length === 0) {
      return { x: 0, y: 0 };
    } else {
      const { x, y } = this.cells[this.cells.length - 1];
      return { x: x + 1, y };
    }
  }
}
