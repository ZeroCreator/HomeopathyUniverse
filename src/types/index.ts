export type PeriodId = number | '6a' | '7a';

export type ElementCategory =
  | 'alkali'
  | 'alkaline'
  | 'transition'
  | 'poor'
  | 'metalloid'
  | 'nonmetal'
  | 'noble'
  | 'lanthanoid'
  | 'actinoid'
  | 'nocategory';

export interface Column {
  id: number;
  topTitle?: string;
  title: string;
  subtitle: string;
  description?: string;
}

export interface Row {
  id: PeriodId;
  label: string;
  miasm: string;
  creationDay: string;
  description?: string;
}

export interface Cell {
  period: PeriodId;
  column: number;
  atomicNumber: number | null;
  symbol: string | null;
  name: string | null;
  atomicMass: string | null;
  category: ElementCategory | null;
  text: string[];
  properties: string[];
  plants: string[];
  animals: string[];
  icons?: string[];
}

export interface TableData {
  columns: Column[];
  rows: Row[];
  cells: Cell[];
}

export type ViewMode = 'all' | 'elements' | 'plants' | 'animals';
