import { useRef, useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Column } from '../types';
import { DropdownPanel } from './DropdownPanel';

interface ColumnHeaderProps {
  column: Column;
}

export function ColumnHeader({ column }: ColumnHeaderProps) {
  const [expanded, setExpanded] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex flex-col h-full min-h-[80px]">
      <button
        ref={anchorRef}
        onClick={() => setExpanded(!expanded)}
        className="text-[10px] font-semibold text-gray-700 hover:text-purple-700 text-center flex flex-col items-center justify-start gap-0 leading-tight w-full h-full"
      >
        {column.topTitle && (
          <span className="h-6 flex items-center justify-center whitespace-normal break-words w-full overflow-hidden">
            {column.topTitle}
          </span>
        )}
        <span className="h-10 flex items-center justify-center whitespace-normal break-words w-full overflow-hidden">
          {column.title}
        </span>
        <span className="h-5 flex items-center justify-center bg-white border border-[#d4d0c8] rounded px-1 text-[9px] text-gray-600 whitespace-normal break-words w-full overflow-hidden">
          {column.subtitle}
        </span>
      </button>
      {expanded && (
        <DropdownPanel
          anchor={anchorRef.current}
          onClose={() => setExpanded(false)}
          align="center"
          width={240}
        >
          <div className="text-[11px]">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="font-semibold text-gray-800">{column.subtitle}</p>
              <button
                onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
                className="p-0.5 hover:bg-gray-100 rounded shrink-0"
                aria-label="Закрыть"
              >
                <X size={12} />
              </button>
            </div>
            {column.description && <p>{column.description}</p>}
            <Link
              to={`/column/${column.id}`}
              onClick={() => setExpanded(false)}
              className="inline-flex items-center gap-1 mt-2 text-purple-700 hover:underline"
            >
              <ExternalLink size={12} /> Открыть на отдельной странице
            </Link>
          </div>
        </DropdownPanel>
      )}
    </div>
  );
}
