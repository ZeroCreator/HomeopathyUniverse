import { useParams, Navigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getCell, getColumn, getRow } from '../data/tableData';
import { getPlantsByCell } from '../data/plantData';
import type { PeriodId } from '../types';

function parsePeriod(period: string): PeriodId | undefined {
  if (period === '6a' || period === '7a') return period;
  const num = parseInt(period, 10);
  if (!isNaN(num) && num >= 1 && num <= 7) return num;
  return undefined;
}

export function ElementPage() {
  const { period, column } = useParams<{ period: string; column: string }>();

  const periodId = period ? parsePeriod(period) : undefined;
  const columnId = column ? parseInt(column, 10) : NaN;

  const cell = periodId && !isNaN(columnId) ? getCell(periodId, columnId) : undefined;
  const columnData = !isNaN(columnId) ? getColumn(columnId) : undefined;
  const rowData = periodId ? getRow(periodId) : undefined;
  const plantList = periodId && !isNaN(columnId) ? getPlantsByCell(periodId, columnId) : [];

  if (!cell) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-purple-700 hover:underline mb-4"
      >
        <ArrowLeft size={16} /> Назад к таблице
      </Link>

      <div className="bg-white rounded-xl shadow border border-[#d4d0c8] p-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {cell.symbol ? `${cell.symbol} — ${cell.name}` : 'Описание ячейки'}
        </h1>
        <p className="text-gray-600 mt-2">
          {rowData?.title}{rowData?.subtitle ? ` / ${rowData.subtitle}` : ''} · Колонка {cell.column}: {columnData?.title}
        </p>

        <div className="flex gap-4 text-sm text-gray-500 mt-2">
          {cell.atomicNumber && <p>Атомный номер: {cell.atomicNumber}</p>}
          {cell.atomicMass && <p>Атомная масса: {cell.atomicMass}</p>}
        </div>

        <div className="mt-6">
          <h2 className="font-semibold text-gray-900 mb-2">Описание</h2>
          {cell.text.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-700">
              {cell.text.map((line, i) => (
                <li key={i} className="pl-3 border-l-2 border-purple-200">{line}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Нет данных</p>
          )}
        </div>

        {(cell.plants.length > 0 || plantList.length > 0) && (
          <div className="mt-6">
            <h2 className="font-semibold text-gray-900 mb-2">Растения</h2>
            <ul className="space-y-1 text-sm text-gray-700">
              {cell.plants.map((p, i) => (
                <li key={`existing-${i}`}>{p}</li>
              ))}
              {plantList.map((p, i) => (
                <li key={`plant-${i}`} className="pl-3 border-l-2 border-green-200">{p}</li>
              ))}
            </ul>
          </div>
        )}

        {cell.animals.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold text-gray-900 mb-2">Животные</h2>
            <ul className="space-y-1 text-sm text-gray-700">
              {cell.animals.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
