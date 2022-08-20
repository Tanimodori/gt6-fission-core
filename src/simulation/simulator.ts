import { Config, CellInput, Rod, RodType, Cell, Position } from 'src/types';
import { DefaultRodTypesArray } from './rodTypes';

/**
 * Get the rod type data by name.
 * @param fullname the fullname name of rod type
 * @param types a list of available rod types if provided
 * @returns the rod type with matched name
 */
export function getRodType(fullname: string, types?: RodType[]) {
  types = types ?? DefaultRodTypesArray;
  const type = types.find((x) => x.fullname === fullname);
  if (!type) {
    throw new Error(`Cannot find rod type with fullname ${fullname}`);
  }
  return type;
}

/**
 * Get the default position of rod by index.
 * Supports cell with up to 2x2 rod size.
 * @param index the index of the rod in its cell
 * @returns the corresponding x and y data
 */
export function getDefaultPos(index: number) {
  if (index < 0 || index >= 4) {
    throw new Error(`Default pos of rod[${index}]is out of range [0,3]`);
  }
  const x = index % 2;
  const y = index > 1 ? 1 : 0;
  return { x, y };
}

/**
 * Sanitize cell data before simulation
 * @param cellsIn input cell data
 * @returns cell data sanitized
 */
export function initCells(cellsIn: CellInput[]) {
  const cellsOut: Cell[] = [];
  for (const cellIn of cellsIn) {
    const cellOut: Cell = { ...cellIn, rods: [] };
    for (let i = 0; i < cellIn.rods.length; ++i) {
      const rodIn = cellIn.rods[i];
      // position
      let pos: Position;
      if (typeof rodIn === 'string') {
        pos = getDefaultPos(i);
      } else {
        pos = 'x' in rodIn ? rodIn : getDefaultPos(i);
      }
      const { x, y } = pos;
      // type
      let type: RodType;
      if (typeof rodIn === 'string') {
        type = getRodType(rodIn);
      } else if (typeof rodIn.type === 'string') {
        type = getRodType(rodIn.type);
      } else {
        type = { ...rodIn.type };
      }
      // duability
      let duability: number;
      if (typeof rodIn === 'string') {
        duability = type.duability;
      } else {
        duability = 'duability' in rodIn ? rodIn.duability : type.duability;
      }
      // output
      const rodOut = { x, y, type, duability, cell: cellOut };
      cellOut.rods.push(rodOut);
    }
    cellsOut.push(cellOut);
  }
  return cellsOut;
}

/**
 * Run the simulation.
 * @param config simulation configuration
 */
export function simulate(config: Config) {
  const cells = initCells(config.cells);
  const rods = cells.flatMap((x) => x.rods);
}
