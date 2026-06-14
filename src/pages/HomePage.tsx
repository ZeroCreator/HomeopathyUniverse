import { useState } from 'react';
import { FilterToolbar } from '../components/FilterToolbar';
import { PeriodicTable } from '../components/PeriodicTable';
import { SearchBar } from '../components/SearchBar';
import { ElementModal } from '../components/ElementModal';
import type { ViewMode, Cell } from '../types';

export function HomePage() {
  const [mode, setMode] = useState<ViewMode>('all');
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  function handleSearchSelect(cell: Cell) {
    setSelectedCell(cell);
  }

  return (
    <div>
      <SearchBar onSelect={handleSearchSelect} />
      <FilterToolbar mode={mode} onChange={setMode} />
      <PeriodicTable mode={mode} onCellSelect={setSelectedCell} />
      <ElementModal cell={selectedCell} onClose={() => setSelectedCell(null)} />
    </div>
  );
}
