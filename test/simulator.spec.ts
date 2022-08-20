import { describe, it, expect } from 'vitest';

import { DefaultRodTypes } from 'src/simulation/rodTypes';
import { initCells } from 'src/simulation/simulator';
import { CellInput, Rod } from 'src/types';

const U235 = DefaultRodTypes.Uranium235;

describe('Simulator init function', () => {
  it('Should accept string as rods', () => {
    const cellIn: CellInput = { x: 0, y: 0, fluid: 'Water', rods: [U235.fullname, U235.fullname] };
    const cellOut = initCells([cellIn])[0];
    const rodExpected: Rod = {
      x: 0,
      y: 0,
      type: U235,
      duability: U235.duability,
      cell: cellOut,
    };
    expect(cellOut.rods[0]).toMatchObject(rodExpected);
    expect(cellOut.rods[1]).toMatchObject({ ...rodExpected, x: 1 });
  });
});
