import { describe, it, expect } from 'vitest';

import { DefaultRodTypes } from 'src/simulation/rodTypes';
import { initCells } from 'src/simulation/simulator';
import { Cell, CellInput, Rod } from 'src/types';

const U235 = DefaultRodTypes.Uranium235;

describe('Simulator init function', () => {
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

  it('Should accept rods input as string', () => {
    const cellIn: CellInput = { ...basicCell, rods: [U235.fullname, U235.fullname] };
    const cellOut = initCells([cellIn])[0];
    DoubleU235Check(cellOut);
  });

  it('Should accept rods input as { type }', () => {
    const cellIn: CellInput = { ...basicCell, rods: [{ type: U235.fullname }, { type: U235.fullname }] };
    const cellOut = initCells([cellIn])[0];
    DoubleU235Check(cellOut);
  });

  it('Should accept rods input as { type, x, y } and { type, duability }', () => {
    const rods = [
      { type: U235.fullname, duability: 0 },
      { type: U235.fullname, x: 1, y: 1 },
    ];
    const cellIn: CellInput = { ...basicCell, rods };
    const cellOut = initCells([cellIn])[0];
    DoubleU235Check(cellOut, [{ duability: 0 }, { y: 1 }]);
  });
});
