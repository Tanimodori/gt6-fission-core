import { describe, it, expect } from 'vitest';

import { DefaultRodTypes } from 'src/simulation/rodTypes';
import { CellEdge, findCellEdges, initCells, posToString } from 'src/simulation/simulator';
import { Cell, CellInput, Rod } from 'src/types';

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

describe('simulator findCellEdges function', () => {
  it('should find edges correctly', () => {
    const basicCell = { x: 1, y: 1, rods: [], fluid: 'Water', type: '2x2' as const };
    const cells: Cell[] = [
      { ...basicCell },
      { ...basicCell, x: 0 },
      { ...basicCell, x: 2 },
      { ...basicCell, y: 0 },
      { ...basicCell, y: 2 },
      { ...basicCell, x: 3, y: 2 },
    ];
    const edgesExpected: CellEdge[] = [
      [cells[1], cells[0]],
      [cells[0], cells[2]],
      [cells[3], cells[0]],
      [cells[0], cells[4]],
    ];
    const edges = findCellEdges(cells);
    const sortFn = (a: CellEdge, b: CellEdge) => {
      if (a[0].x !== b[0].x) {
        return a[0].x - b[0].x;
      } else if (a[0].y !== b[0].y) {
        return a[0].y - b[0].y;
      } else if (a[1].x !== b[1].x) {
        return a[1].x - b[1].x;
      } else {
        return a[1].y - b[1].y;
      }
    };
    expect(edges.sort(sortFn)).toStrictEqual(edgesExpected.sort(sortFn));
  });
});
