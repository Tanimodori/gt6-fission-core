import { Config, CellInput, Rod, RodType } from 'src/types';

function getRodType(type: string, types?: RodType[]) {
  // TODO
  return -1;
}

function getDefaultPos(index: number) {
  if (index < 0 || index >= 4) {
    throw new Error(`Default pos of rod[${index}]is out of range [0,3]`);
  }
  const x = index % 2;
  const y = index - 2 * x;
  return { x, y };
}

function initRods(cells: CellInput[]) {
  const rods: Rod[] = [];
  for (const cell of cells) {
    for (let i = 0; i < cell.rods.length; ++i) {
      const rodInput = cell.rods[i];
      const { x, y } = 'x' in rodInput ? rodInput : getDefaultPos(i);
      const type = typeof rodInput === 'string' ? rodInput : rodInput.type;
      const duability = getRodType(type);
      rods.push({ x, y, type, duability, cell });
    }
  }
  return rods;
}

export function simulate(config: Config) {
  const rods = initRods(config.cells);
}
