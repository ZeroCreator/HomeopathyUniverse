import type { Cell } from '../types';

interface HoverPreviewProps {
  cell: Cell | null;
}

export function HoverPreview({ cell }: HoverPreviewProps) {
  if (!cell) return null;

  return (
    <div
      className="fixed top-4 left-4 z-50 hidden lg:block w-80 max-h-[90vh] overflow-y-auto rounded-xl border border-black/10 bg-white/95 p-5 shadow-2xl backdrop-blur-sm transition-all duration-150 pointer-events-none"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-gray-500">
            {cell.atomicNumber ? `Атомный номер: ${cell.atomicNumber}` : 'Периодическая ячейка'}
          </div>
          <div className="mt-1 text-4xl font-bold leading-none">{cell.symbol || '—'}</div>
          <div className="mt-1 text-lg font-semibold">{cell.name || '—'}</div>
        </div>
        {cell.atomicMass && (
          <div className="text-right text-sm text-gray-600">
            <div className="font-medium">{cell.atomicMass}</div>
            <div className="text-xs text-gray-400">атом. масса</div>
          </div>
        )}
      </div>

      {cell.category && (
        <div className="mt-3 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs capitalize text-gray-700">
          {categoryLabel(cell.category)}
        </div>
      )}

      {cell.text.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Описание</h4>
          <ul className="mt-1 space-y-1 text-sm text-gray-800">
            {cell.text.map((line, i) => (
              <li key={i} className="break-words">
                {line}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(cell.plants.length > 0 || cell.animals.length > 0) && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {cell.plants.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-green-600">Растения</h4>
              <ul className="mt-1 space-y-1 text-xs text-gray-700">
                {cell.plants.slice(0, 5).map((item, i) => (
                  <li key={i} className="truncate" title={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {cell.animals.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-600">Животные</h4>
              <ul className="mt-1 space-y-1 text-xs text-gray-700">
                {cell.animals.slice(0, 5).map((item, i) => (
                  <li key={i} className="truncate" title={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    alkali: 'Щелочной металл',
    alkaline: 'Щёлочноземельный металл',
    transition: 'Переходный металл',
    poor: 'Постпереходный металл',
    metalloid: 'Металлоид',
    nonmetal: 'Неметалл',
    noble: 'Благородный газ',
    lanthanoid: 'Лантаноид',
    actinoid: 'Актиноид',
    nocategory: '—',
  };
  return labels[category] || category;
}
