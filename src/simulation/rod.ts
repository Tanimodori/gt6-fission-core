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

  _computeSelfAdjacentRods() {
    if (this.cell.type === '2x2') {
      const possiblePos: Position[] = [
        { x: 1 - this.x, y: this.y },
        { x: this.x, y: 1 - this.y },
      ];
      const _tryPushAdjacentRod = (pos: Position) => {
        const found = this.cell.findRod(pos);
        found && this._adjacentRods?.push(found);
      };
      possiblePos.forEach(_tryPushAdjacentRod);
    }
  }
  _computeOtherAdjacentRods(cached = false) {
    const adjacentCells = this.cell.getAdjacentCells(cached);
    for (const adjCell of adjacentCells) {
      // 1. Ensure this rod is on the edge
      const posDiff = { x: adjCell.x - this.x, y: adjCell.y - this.y };
      const thisEdgeRods = this.cell.getEgdeRods(posDiff);
      if (thisEdgeRods.indexOf(this) === -1) {
        continue;
      }
      // 2. Get edge rods of that rod
      const thatEdgeRods = adjCell.getEgdeRods({ x: -posDiff.x, y: -posDiff.y });
      // 3. Get the max common side length
      const maxLength = Math.max(thisEdgeRods.length, thatEdgeRods.length);
      // 4. iterate and add
      for (let i = 0; i < maxLength; ++i) {
        const thisEdgeRod = thisEdgeRods[i % thisEdgeRods.length];
        const thatEdgeRod = thatEdgeRods[i % thatEdgeRods.length];
        if (thisEdgeRod === this && thatEdgeRod) {
          this._adjacentRods?.push(thatEdgeRod);
        }
      }
    }
  }
  _computeAdjacentRods(cached = false) {
    this._adjacentRods = [];
    this._computeSelfAdjacentRods();
    this._computeOtherAdjacentRods(cached);
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

  /**
   * Clear adjacent rods cache
   */
  clearAdjacentRodsCache() {
    this._adjacentRods = [];
  }
}
