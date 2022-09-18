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
}
