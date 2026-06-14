import { useParams, Navigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getRow } from '../data/tableData';
import type { PeriodId } from '../types';

function parsePeriod(period: string): PeriodId | undefined {
  if (period === '6a' || period === '7a') return period;
  const num = parseInt(period, 10);
  if (!isNaN(num) && num >= 1 && num <= 7) return num;
  return undefined;
}

export function RowPage() {
  const { period } = useParams<{ period: string }>();
  const periodId = period ? parsePeriod(period) : undefined;
  const row = periodId ? getRow(periodId) : undefined;

  if (!row) {
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
        <h1 className={row.subtitle ? "text-2xl font-bold text-gray-900" : "text-2xl font-bold italic text-purple-800"}>{row.title}</h1>
        {row.subtitle && <p className="text-purple-800 italic font-semibold mt-1">{row.subtitle}</p>}
        <p className="text-gray-500 mt-1">Ряд {row.id}</p>

        <div className="mt-4 space-y-2 text-sm text-gray-700">
          {row.creationDay && (
            <p><span className="font-semibold">День творения:</span> {row.creationDay}</p>
          )}
          {row.miasm && (
            <p><span className="font-semibold">Миазм:</span> {row.miasm}</p>
          )}
          {row.description && <p>{row.description}</p>}
        </div>
      </div>
    </div>
  );
}
