import type { PeriodId } from '../types';

interface RowNumberProps {
  period: PeriodId;
}

export function RowNumber({ period }: RowNumberProps) {
  return (
    <div className="h-full bg-white border border-[#d4d0c8] rounded flex items-center justify-center text-[10px] font-semibold text-gray-600 sticky left-0">
      {period}
    </div>
  );
}
