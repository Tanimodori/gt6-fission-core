import { Maybe, Position } from 'src/types';
import Cell from './cell';
import RodType from './rodType';
import { RodTypeInput } from './rodTypeRegistry';

/** Fuel rod init config */
export type RodInput = string | number | Maybe<{ type: RodTypeInput; duability?: number }, Position>;

/** Fuel rod class */
export default class Rod {
  /** Container cell */
  cell: Cell;
  /** Fullname of the rod type */
  type: RodType;
  /** X position inside parent */
  x!: number;
  /** Y position inside parent */
  y!: number;
  /** Initial Duability */
  initialDuability?: number;

  /**
   * Construct new rod.
   * @param input the input
   * @param registry rod type registry
   */
  constructor(input: RodInput, cell: Cell) {
    this.cell = cell;
    let type: RodTypeInput;
    if (typeof input === 'object') {
      // object type
      type = input.type;
      // pos
      if ('x' in input && 'y' in input) {
        this.x = input.x;
        this.y = input.y;
      } else {
        const { x, y } = cell.getNextPos();
        this.x = x;
        this.y = y;
      }
      if ('duability' in input) {
        this.initialDuability = input.duability;
      }
    } else {
      // pure type
      type = input;
    }
    // type
    this.type = cell.reactor.registry.parse(type);
  }

  _adjacentRods?: Rod[];
  _computeAdjacentRods(cached = false) {
    this._adjacentRods = [];
    const adjacentCells = this.cell.getAdjacentCells(cached);
    for (const adjCell of adjacentCells) {
      // 1. setup current pos
      const allPos = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ];
      const currentPos: Position[] = this.cell.type === '1x1' ? allPos : [{ x: this.x, y: this.y }];
      // 2. compute diff
      const posDiff = { x: adjCell.x - this.x, y: adjCell.y - this.y };
      // 3. advance diff & filter pos
      let filteredPos: Position[] = [];
      currentPos.forEach((pos) => {
        pos.x += posDiff.x;
        pos.y += posDiff.y;
        if (pos.x < 0 || pos.x >= 2) {
          pos.x = (pos.x + 2) % 2;
          filteredPos.push(pos);
        } else if (pos.y < 0 || pos.y >= 2) {
          pos.y = (pos.y + 2) % 2;
          filteredPos.push(pos);
        }
      });
      // 4. shim pos
      if (adjCell.type === '1x1' && filteredPos.length > 0) {
        filteredPos = [{ x: 0, y: 0 }];
      }
      // 5. push results
      filteredPos.forEach((pos) => {
        const found = adjCell.findRod(pos);
        if (found) {
          this._adjacentRods?.push(found);
        }
      });
    }
  }
  /**
   * Get adjacent rods.
   * @param cached use last result or not
   * @returns adjacent rods
   */
  getAdjacentRods(cached = false): Rod[] {
    // precheck
    if (!this.cell.isPosValid(this)) {
      return [];
    }
    if (cached && this._adjacentRods) {
      return this._adjacentRods;
    } else {
      this._computeAdjacentRods(cached);
      return this._adjacentRods as Rod[];
    }
  }
}
