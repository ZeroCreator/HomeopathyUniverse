import rawData from './plantData.json';
import type { PeriodId } from '../types';

export interface PlantData {
  cells: Record<string, string[]>;
  rows: Record<string, string[]>;
  unmapped: [string, string, number, number][];
}

export const plantData = rawData as PlantData;

export const getPlantsByCell = (period: PeriodId, column: number): string[] => {
  if (typeof period !== 'number') return [];
  return plantData.cells[`${period}-${column}`] ?? [];
};

export const getPlantsByColumn = (column: number): Record<string, string[]> => {
  const result: Record<string, string[]> = {};
  for (let period = 1; period <= 7; period++) {
    const plants = getPlantsByCell(period, column);
    if (plants.length > 0) {
      result[String(period)] = plants;
    }
  }
  return result;
};

export const getPlantsByPeriod = (period: PeriodId): string[] => {
  if (typeof period !== 'number') return [];
  const result: string[] = [];
  for (let column = 1; column <= 18; column++) {
    result.push(...(plantData.cells[`${period}-${column}`] ?? []));
  }
  result.push(...(plantData.rows[String(period)] ?? []));
  return result;
};
