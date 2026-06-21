import { useState, useMemo, useEffect } from 'react';
import { ElementCell } from './ElementCell';
import { ColumnHeader } from './ColumnHeader';
import { RowHeader } from './RowHeader';
import { HoverPreview } from './HoverPreview';
import { tableData } from '../data/tableData';
import type { Cell, ViewMode, PeriodId } from '../types';

const PERIODS_IN_ORDER: PeriodId[] = [1, 2, 3, 4, 5, 6, 7, '6a', '7a'];

interface PeriodicTableProps {
  mode: ViewMode;
  onCellSelect?: (cell: Cell) => void;
}

export function PeriodicTable({ mode, onCellSelect }: PeriodicTableProps) {
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [hoveredCell, setHoveredCell] = useState<Cell | null>(null);

  const cellsByKey = useMemo(() => {
    const map = new Map<string, Cell>();
    tableData.cells.forEach((cell) => {
      map.set(`${cell.period}-${cell.column}`, cell);
    });
    return map;
  }, []);

  useEffect(() => {
    if (selectedCell && onCellSelect) {
      onCellSelect(selectedCell);
    }
  }, [selectedCell, onCellSelect]);

  function handleCellClick(period: PeriodId, column: number) {
    const cell = cellsByKey.get(`${period}-${column}`);
    if (cell) setSelectedCell(cell);
  }

  return (
    <>
      <HoverPreview cell={hoveredCell} />
      <div className="overflow-x-auto pb-4 -mx-4 px-4">
        <div className="grid gap-1 xl:gap-1.5 2xl:gap-2 periodic-grid">
          {/* Top-left corner */}
          <div
            className="sticky left-0 z-10 bg-[#f8f7f4] relative text-[10px] font-medium leading-tight text-gray-600"
            style={{
              background: 'linear-gradient(to top right, transparent 49%, #d4d0c8 49%, #d4d0c8 51%, transparent 51%)',
            }}
          >
            <div className="absolute top-1.5 right-2 text-right">
              <span className="block">Колонка таблицы</span>
              <span className="block">Тема</span>
            </div>
            <div className="absolute bottom-1.5 left-2">
              <span className="block">Ряд таблицы</span>
              <span className="block">Миазм</span>
            </div>
          </div>

          {/* Column headers */}
          {tableData.columns.map((col) => (
            <div key={`col-${col.id}`} className="z-10 relative">
              <ColumnHeader column={col} />
            </div>
          ))}

          {/* Rows */}
          {PERIODS_IN_ORDER.map((period, rowIndex) => {
            const row = tableData.rows.find((r) => r.id === period)!;
            return (
              <>
                {/* Row header */}
                <div
                  key={`row-${period}`}
                  className="sticky left-0 z-10 bg-[#f8f7f4] flex items-start"
                  style={{ gridRow: rowIndex + 2, gridColumn: 1 }}
                >
                  <RowHeader row={row} />
                </div>

                {/* Cells */}
                {tableData.columns.map((col) => {
                  const cell = cellsByKey.get(`${period}-${col.id}`);
                  return (
                    <div
                      key={`cell-${period}-${col.id}`}
                      className="aspect-[70/78] min-w-0 min-h-0"
                      style={{
                        gridRow: rowIndex + 2,
                        gridColumn: col.id + 1,
                      }}
                    >
                      {cell ? (
                        <ElementCell
                          cell={cell}
                          mode={mode}
                          onClick={() => handleCellClick(period, col.id)}
                          onMouseEnter={() => setHoveredCell(cell)}
                          onMouseLeave={() => setHoveredCell(null)}
                        />
                      ) : (
                        <div className="h-full w-full rounded" />
                      )}
                    </div>
                  );
                })}
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}
