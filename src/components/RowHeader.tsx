import { useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { Row } from '../types';
import { DropdownPanel } from './DropdownPanel';

interface RowHeaderProps {
  row: Row;
}

export function RowHeader({ row }: RowHeaderProps) {
  const [expanded, setExpanded] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex flex-col w-full">
      <button
        ref={anchorRef}
        onClick={() => setExpanded(!expanded)}
        className="text-left text-[11px] font-semibold text-gray-700 hover:text-purple-700 py-1 px-2 leading-tight"
      >
        {row.label}
      </button>
      {expanded && (
        <DropdownPanel
          anchor={anchorRef.current}
          onClose={() => setExpanded(false)}
          align="left"
          width={280}
        >
          <div className="text-[10px]">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="font-semibold text-gray-800">{row.label}</p>
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
          </div>
        </DropdownPanel>
      )}
    </div>
  );
}
