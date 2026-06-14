import type { ViewMode } from '../types';

interface FilterToolbarProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const options: { value: ViewMode; label: string }[] = [
  { value: 'all', label: 'Общая' },
  { value: 'elements', label: 'Химические элементы' },
  { value: 'plants', label: 'Растения' },
  { value: 'animals', label: 'Животные' },
];

export function FilterToolbar({ mode, onChange }: FilterToolbarProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            mode === opt.value
              ? 'bg-purple-700 text-white shadow'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-[#d4d0c8]',
          ].join(' ')}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
