export interface RodType {
  id: number;
  fullname: string;
  basename: string;
  superscript: string;
  color: string;
  duability: number;
  emissionSelf: number;
  emissionOthers: number;
}

export interface Rod {
  x: number;
  y: number;
  cell: Cell;
  type: string;
  duability: number;
}

export interface Cell {
  x: number;
  y: number;
  rods: Rod[];
  fluid: string;
}

export type RodInputObjectRaw = Pick<Rod, 'type'> | Pick<Rod, 'type' | 'x' | 'y'>;
export type RodInputObject = RodInputObjectRaw | (RodInputObjectRaw & Pick<Rod, 'duability'>);
export type RodInput = string | RodInputObject;
export type CellInput = Exclude<Cell, 'rods'> & { rods: Array<RodInput> };
export interface Config {
  cells: CellInput[];
}
