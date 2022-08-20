import { Config, CellInput, Rod, RodType, Cell } from 'src/types';

/**
 * Get the rod type data by name.
 * @param type the type name of rod
 * @param types a list of available rod types if provided
 * @returns the rod type with matched name
 */
function getRodType(type: string, types?: RodType[]) {
  // TODO
  return -1;
}

/**
 * Get the default position of rod by index.
 * Supports cell with up to 2x2 rod size.
 * @param index the index of the rod in its cell
 * @returns the corresponding x and y data
 */
function getDefaultPos(index: number) {
  if (index < 0 || index >= 4) {
    throw new Error(`Default pos of rod[${index}]is out of range [0,3]`);
  }
  const x = index % 2;
  const y = index - 2 * x;
  return { x, y };
}

/**
 * Sanitize cell data before simulation
 * @param cellsIn input cell data
 * @returns cell data sanitized
 */
function initCells(cellsIn: CellInput[]) {
  const cellsOut: Cell[] = [];
  for (const cellIn of cellsIn) {
    const cellOut: Cell = { ...cellIn, rods: [] };
    for (let i = 0; i < cellIn.rods.length; ++i) {
      const rodIn = cellIn.rods[i];
      const { x, y } = 'x' in rodIn ? rodIn : getDefaultPos(i);
      const type = typeof rodIn === 'string' ? rodIn : rodIn.type;
      const duability = getRodType(type);
      const rodOut = { x, y, type, duability, cell: cellOut };
      cellOut.rods.push(rodOut);
    }
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
