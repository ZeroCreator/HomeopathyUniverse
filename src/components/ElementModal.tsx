import { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Cell } from '../types';
import { getColumn, getRow } from '../data/tableData';

interface ElementModalProps {
  cell: Cell | null;
  onClose: () => void;
}

export function ElementModal({ cell, onClose }: ElementModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!cell) return null;

  const column = getColumn(cell.column);
  const row = getRow(cell.period);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-[#d4d0c8] px-6 py-4 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {cell.symbol ? `${cell.symbol} — ${cell.name}` : 'Описание ячейки'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {row?.label} · Колонка {cell.column}: {column?.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Закрыть"
          >
            <X size={24} />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="flex gap-4 text-sm text-gray-500">
            {cell.atomicNumber && <p>Атомный номер: {cell.atomicNumber}</p>}
            {cell.atomicMass && <p>Атомная масса: {cell.atomicMass}</p>}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Описание</h3>
            {cell.text.length > 0 ? (
              <ul className="space-y-1.5 text-sm text-gray-700">
                {cell.text.map((line, i) => (
                  <li key={i} className="pl-3 border-l-2 border-purple-200">{line}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Нет данных</p>
            )}
          </div>

          {cell.plants.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Растения</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {cell.plants.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {cell.animals.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Животные</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {cell.animals.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2">
            <Link
              to={`/cell/${cell.period}/${cell.column}`}
              onClick={onClose}
              className="inline-flex items-center gap-1 text-sm text-purple-700 hover:underline"
            >
              <ExternalLink size={14} /> Открыть на отдельной странице
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
