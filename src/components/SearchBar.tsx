import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { tableData } from '../data/tableData';
import type { Cell } from '../types';

interface SearchBarProps {
  onSelect: (cell: Cell) => void;
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return tableData.cells.filter((cell) => {
      if (!cell.symbol) return false;
      return (
        cell.symbol.toLowerCase().includes(q) ||
        (cell.name?.toLowerCase().includes(q) ?? false) ||
        cell.properties.some((p) => p.toLowerCase().includes(q)) ||
          cell.text.some((t) => t.toLowerCase().includes(q))
      );
    }).slice(0, 10);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSelect(cell: Cell) {
    onSelect(cell);
    setQuery('');
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative max-w-md mx-auto mb-4">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Поиск по элементу или свойству..."
          className="w-full pl-9 pr-8 py-2 rounded-lg border border-[#d4d0c8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setOpen(false);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>
      {open && results.length > 0 && (
        <ul className="absolute z-40 w-full mt-1 bg-white border border-[#d4d0c8] rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {results.map((cell) => (
            <li key={`${cell.period}-${cell.column}`}>
              <button
                onClick={() => handleSelect(cell)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-purple-50"
              >
                <span className="font-semibold">{cell.symbol}</span>
                {cell.name && <span className="text-gray-600"> — {cell.name}</span>}
                <span className="text-gray-400 text-xs ml-2">ряд {cell.period}, колонка {cell.column}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
