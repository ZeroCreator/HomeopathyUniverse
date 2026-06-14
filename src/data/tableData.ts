import rawData from './tableData.json';
import type { TableData, Cell, Column, Row, PeriodId } from '../types';

export const tableData = rawData as TableData;

export const getCell = (period: PeriodId, column: number): Cell | undefined => {
  return tableData.cells.find((c) => c.period === period && c.column === column);
};

export const getColumn = (id: number): Column | undefined => {
  return tableData.columns.find((c) => c.id === id);
};

export const getRow = (id: PeriodId): Row | undefined => {
  return tableData.rows.find((r) => r.id === id);
};

export const getCellsByPeriod = (period: PeriodId): Cell[] => {
  return tableData.cells.filter((c) => c.period === period);
};

export const getCellsByColumn = (column: number): Cell[] => {
  return tableData.cells.filter((c) => c.column === column);
};

export const getCellById = (period: PeriodId, column: number): Cell | undefined => {
  return getCell(period, column);
};
