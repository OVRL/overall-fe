export type CellValue = number | string;

export interface Player {
  id: string;
  name: string;
  [key: string]: CellValue; // Dynamic properties based on columns
}

export type ColumnType = "data" | "formula";

export interface ColumnConfig {
  id: string;
  name: string;
  type: ColumnType;
  expression?: string; // For formula columns
  isSystem?: boolean; // For built-in columns like 'name'
}

export interface AppState {
  players: Player[];
  columns: ColumnConfig[];
}
