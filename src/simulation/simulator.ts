import { Config, CellInput, Rod, Cell, Position, CellType } from 'src/types';
import RodType from './rodType';

/**
 * Get the rod type data by name.
 * @param fullname the fullname name of rod type
 * @param types a list of available rod types if provided
 * @returns the rod type with matched name
 */
export function getRodType(fullname: string, types?: RodType[]) {
  types = types ?? RodType.getDefaults();
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
        type = rodIn.type;
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

/** Return pos string like `x1,y1,x2,y2,...` as id */
export function posToString(...positions: Position[]) {
  return positions.map((pos) => `${pos.x},${pos.y}`).join(',');
}

/** Edge of two cells */
export type CellEdge = [Cell, Cell];
/** Edge of two rods */
export type RodEdge = [Rod, Rod];

/**
 * Find edges of cells
 * @param cells cells input
 */
export function findCellEdges(cells: Cell[]): CellEdge[] {
  // cellMap
  const cellMap: Map<string, Cell> = new Map();
  cells.forEach((cell) => cellMap.set(posToString(cell), cell));
  // compute result
  const result: CellEdge[] = [];
  cells.forEach((cell) => {
    // search only right and down side
    // to avoid redundant edges
    const dArr = [
      [1, 0],
      [0, 1],
    ];
    for (const [dx, dy] of dArr) {
      const adjCell = cellMap.get(posToString({ x: cell.x + dx, y: cell.y + dy }));
      if (adjCell) {
        result.push([cell, adjCell]);
      }
    }
  });
  return result;
}

/**
 * Get the cell boundary rod positions
 * @param cellType type of cell
 * @param posDiff the adjacent cell position different to this cell
 */
export function getCellBoundaryRodPos(cellType: CellType, posDiff: Position): Position[] {
  if (cellType === '1x1') {
    return [{ x: 0, y: 0 }];
  } else if (posDiff.x === -1 && posDiff.y === 0) {
    // left
    return [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
    ];
  } else if (posDiff.x === 1 && posDiff.y === 0) {
    // right
    return [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ];
  } else if (posDiff.x === 0 && posDiff.y === -1) {
    // up
    return [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ];
  } else if (posDiff.x === 0 && posDiff.y === 1) {
    // down
    return [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ];
  } else {
    throw new Error(`Position diff (${posDiff.x},${posDiff.y}) is not valid`);
  }
}

/**
 * Find edges of rods
 * @param cells cells input
 * @param cellEdges cell edges input
 */
export function findRodEdges(cells: Cell[], cellEdges: CellEdge[]): RodEdge[] {
  // rodMap
  const rodMap: Map<string, Rod> = new Map();
  const rods = cells.flatMap((x) => x.rods);
  rods.forEach((x) => rodMap.set(posToString(x.cell, x), x));
  // compute result
  const result: RodEdge[] = [];
  /** Try to add edge from (cellA,rodA) to (cellB,rodB) if both rods exist */
  const tryAddEdge = (cellAPos: Position, rodAPos: Position, cellBPos: Position, rodBPos: Position) => {
    const currentRod = [rodMap.get(posToString(cellAPos, rodAPos)), rodMap.get(posToString(cellBPos, rodBPos))];
    if (currentRod[0] && currentRod[1]) {
      result.push([currentRod[0], currentRod[1]]);
    }
  };
  // rod edges within same cells
  cells.forEach((cell) => {
    const rodPos: Position[] = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ];
    const possibleEdges: Array<[Position, Position]> = [
      [rodPos[0], rodPos[1]],
      [rodPos[2], rodPos[3]],
      [rodPos[0], rodPos[2]],
      [rodPos[1], rodPos[3]],
    ];
    possibleEdges.forEach((possibleEdge) => {
      tryAddEdge(cell, possibleEdge[0], cell, possibleEdge[1]);
    });
  });
  // rod edges between adjacent cells
  cellEdges.forEach((cellEdge) => {
    const posDiff = { x: cellEdge[1].x - cellEdge[0].x, y: cellEdge[1].y - cellEdge[0].y };
    const boundaryRodPos = [
      getCellBoundaryRodPos(cellEdge[0].type, posDiff),
      getCellBoundaryRodPos(cellEdge[1].type, { x: -posDiff.x, y: -posDiff.y }),
    ];
    const lengths = [boundaryRodPos[0].length, boundaryRodPos[1].length];
    const maxLength = Math.max(...lengths);
    for (let i = 0; i < maxLength; ++i) {
      const currentRodPos = [boundaryRodPos[0][i % lengths[0]], boundaryRodPos[1][i % lengths[1]]];
      tryAddEdge(cellEdge[0], currentRodPos[0], cellEdge[1], currentRodPos[1]);
    }
  });
  return result;
}

/**
 * Run the simulation.
 * @param config simulation configuration
 */
export function simulate(config: Config) {
  // Sanitize cells & rods input
  const cells = initCells(config.cells);
  const cellEdges = findCellEdges(cells);
  const rodEdges = findRodEdges(cells, cellEdges);
}
