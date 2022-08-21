import { describe, it, expect } from 'vitest';

import { DefaultRodTypes } from 'src/simulation/rodTypes';
import { CellEdge, findCellEdges, findRodEdges, initCells, posToString, RodEdge } from 'src/simulation/simulator';
import { Cell, CellInput, Position, Rod } from 'src/types';

const U235 = DefaultRodTypes.Uranium235;

describe('simulator init function', () => {
  /**
   * Check if the cell contains double U235
   * @param cell cell to be checked
   * @param extra extra properties to be set on rod
   */
  const DoubleU235Check = (cell: Cell, extras: Partial<Rod>[] = []) => {
    const rodExpected: Rod = {
      x: 0,
      y: 0,
      type: U235,
      duability: U235.duability,
      cell,
    };
    expect(cell.rods[0]).toMatchObject({ ...rodExpected, ...extras[0] });
    expect(cell.rods[1]).toMatchObject({ ...rodExpected, x: 1, ...extras[1] });
  };

  const basicCell = { x: 0, y: 0, fluid: 'Water', type: '2x2' as const };

  it('should accept rods input as string', () => {
    const cellIn: CellInput = { ...basicCell, rods: [U235.fullname, U235.fullname] };
    const cellOut = initCells([cellIn])[0];
    DoubleU235Check(cellOut);
  });

  it('should accept rods input as { type }', () => {
    const cellIn: CellInput = { ...basicCell, rods: [{ type: U235.fullname }, { type: U235.fullname }] };
    const cellOut = initCells([cellIn])[0];
    DoubleU235Check(cellOut);
  });

  it('should accept rods input as { type, x, y } and { type, duability }', () => {
    const rods = [
      { type: U235.fullname, duability: 0 },
      { type: U235.fullname, x: 1, y: 1 },
    ];
    const cellIn: CellInput = { ...basicCell, rods };
    const cellOut = initCells([cellIn])[0];
    DoubleU235Check(cellOut, [{ duability: 0 }, { y: 1 }]);
  });
});

describe('simulator posToString function', () => {
  it('should accept multiple pos', () => {
    const pos = { x: 1, y: 2 };
    expect(posToString(pos, pos)).toBe('1,2,1,2');
  });
});

describe('simulator findCellEdges and findRodEdges function', () => {
  const basicRod = {
    x: 0,
    y: 0,
    type: U235,
    duability: U235.duability,
  };
  const basicCell = { x: 1, y: 1, rods: [], fluid: 'Water', type: '1x1' as const };
  const cells: Cell[] = [
    { ...basicCell, type: '2x2' },
    { ...basicCell, x: 0 },
    { ...basicCell, x: 2 },
    { ...basicCell, y: 0 },
    { ...basicCell, y: 2 },
    { ...basicCell, x: 3, y: 2 },
  ];
  // init rods
  cells.forEach((cell) => {
    if (cell.type === '1x1') {
      cell.rods = [{ ...basicRod, cell }];
    } else {
      cell.rods = [
        { ...basicRod, cell },
        { ...basicRod, cell, x: 1 },
        { ...basicRod, cell, y: 1 },
        { ...basicRod, cell, x: 1, y: 1 },
      ];
    }
  });

  it('should find edges correctly', () => {
    // expected result
    const cellEdgesExpected: CellEdge[] = [
      [cells[1], cells[0]],
      [cells[0], cells[2]],
      [cells[3], cells[0]],
      [cells[0], cells[4]],
    ];
    const rodEdgesExpected: RodEdge[] = [
      // same cells
      [cells[0].rods[0], cells[0].rods[1]],
      [cells[0].rods[2], cells[0].rods[3]],
      [cells[0].rods[0], cells[0].rods[2]],
      [cells[0].rods[1], cells[0].rods[3]],
      // adjacent cells
      // left
      [cells[1].rods[0], cells[0].rods[0]],
      [cells[1].rods[0], cells[0].rods[2]],
      // right
      [cells[0].rods[1], cells[2].rods[0]],
      [cells[0].rods[3], cells[2].rods[0]],
      // up
      [cells[3].rods[0], cells[0].rods[0]],
      [cells[3].rods[0], cells[0].rods[1]],
      // down
      [cells[0].rods[2], cells[4].rods[0]],
      [cells[0].rods[3], cells[4].rods[0]],
    ];
    // run
    const cellEdges = findCellEdges(cells);
    const rodEdges = findRodEdges(cells, cellEdges);
    // sort
    const sortPos = (a: Position, b: Position) => {
      if (a.x !== b.x) {
        return a.x - b.x;
      } else {
        return a.y - b.y;
      }
    };
    const sortCellEdge = (a: CellEdge, b: CellEdge) => {
      return sortPos(a[0], b[0]) || sortPos(a[1], b[1]);
    };
    const sortRodEdge = (a: RodEdge, b: RodEdge) => {
      return (
        sortPos(a[0], b[0]) || sortPos(a[0].cell, b[0].cell) || sortPos(a[1], b[1]) || sortPos(a[1].cell, b[1].cell)
      );
    };
    // check
    expect(cellEdges.sort(sortCellEdge)).toStrictEqual(cellEdgesExpected.sort(sortCellEdge));
    expect(rodEdges.sort(sortRodEdge)).toStrictEqual(rodEdgesExpected.sort(sortRodEdge));
  });
});
