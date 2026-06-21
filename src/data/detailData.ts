import rawData from './detailData.json';
import type { DetailData, ColumnDetail, RowDetail, PeriodId } from '../types';

export const detailData = rawData as DetailData;

export const getColumnDetail = (id: number): ColumnDetail | undefined => {
  return detailData.columns[String(id)];
};

export const getRowDetail = (period: PeriodId): RowDetail | undefined => {
  return detailData.rows[String(period)];
};
