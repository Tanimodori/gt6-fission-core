export interface Rod {
  id: number;
  fullname: string;
  basename: string;
  superscript: string;
  color: string;
  duability: number;
  emissionSelf: number;
  emissionOthers: number;
}

export interface Cell {
  x: number;
  y: number;
  rodCount: number;
  rods: string[];
  fluid: string;
}

export interface Layout {
  layout: Cell[];
}
