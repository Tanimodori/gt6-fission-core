import { Position } from 'src/types';
import Cell, { CellInput, CellType } from './cell';
import { Reactor, ReactorInput } from './reactor';
import Rod from './rod';
import RodType from './rodType';

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
 * @deprecated Use {@link Reactor}
 */
export function initCells(cellsIn: CellInput[]) {
  const reactor = new Reactor({ cells: cellsIn });
  return reactor.cells;
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
export function simulate(config: ReactorInput) {
  // Sanitize cells & rods input
  const reactor = new Reactor(config);
  const cells = reactor.cells;
  const cellEdges = findCellEdges(cells);
  const rodEdges = findRodEdges(cells, cellEdges);
}
