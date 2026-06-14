import { useRef, useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Row } from '../types';
import { DropdownPanel } from './DropdownPanel';

interface RowHeaderProps {
  row: Row;
}

export function RowHeader({ row }: RowHeaderProps) {
  const [expanded, setExpanded] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex items-stretch w-full h-full pl-1 pr-0">
      <button
        ref={anchorRef}
        onClick={() => setExpanded(!expanded)}
        className="flex-1 min-w-0 text-left text-[11px] text-gray-700 hover:text-purple-700 leading-tight flex flex-col justify-center"
      >
        {row.subtitle ? (
          <>
            <span className="block font-semibold whitespace-normal break-words leading-tight">{row.title}</span>
            <span className="block font-semibold italic text-purple-800 whitespace-normal break-words leading-tight">{row.subtitle}</span>
          </>
        ) : (
          <span className="block font-semibold italic text-purple-800 whitespace-normal break-words leading-tight">{row.title}</span>
        )}
      </button>
      <div
        className="ml-1 shrink-0 h-full w-6 bg-white border border-[#d4d0c8] rounded flex items-center justify-center text-[11px] text-gray-600 font-bold"
        title={`Ряд ${row.id}`}
      >
        {row.id}
      </div>
      {expanded && (
        <DropdownPanel
          anchor={anchorRef.current}
          onClose={() => setExpanded(false)}
          align="left"
          width={280}
        >
          <div className="text-[10px]">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className={row.subtitle ? "font-semibold text-gray-800" : "font-semibold italic text-purple-800"}>
                {row.title}
                {row.subtitle && <span className="block text-purple-800 italic font-normal">{row.subtitle}</span>}
              </p>
              <button
                onClick={() => setExpanded(false)}
                className="p-0.5 hover:bg-gray-100 rounded shrink-0"
                aria-label="Закрыть"
              >
                <X size={12} />
              </button>
            </div>
            {row.miasm && <p><span className="font-semibold">Миазм:</span> {row.miasm}</p>}
            {row.creationDay && <p><span className="font-semibold">День творения:</span> {row.creationDay}</p>}
            {row.description && <p className="mt-1">{row.description}</p>}
            <Link
              to={`/row/${row.id}`}
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
