import type { Cell, ViewMode, ElementCategory } from '../types';

interface ElementCellProps {
  cell: Cell;
  mode: ViewMode;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const CATEGORY_COLORS: Record<ElementCategory, { bg: string; text: string }> = {
  alkali:     { bg: 'hsl(48deg, 77%, 64%)',  text: '#000' },
  alkaline:   { bg: 'hsl(60deg, 83%, 67%)',  text: '#000' },
  transition: { bg: 'hsl(12deg, 87%, 85%)',  text: '#000' },
  poor:       { bg: 'hsl(192deg, 62%, 80%)', text: '#000' },
  metalloid:  { bg: 'hsl(165deg, 58%, 76%)', text: '#000' },
  nonmetal:   { bg: 'hsl(120deg, 73%, 74%)', text: '#000' },
  noble:      { bg: 'hsl(300deg, 44%, 82%)', text: '#000' },
  lanthanoid: { bg: 'hsl(42deg, 62%, 76%)',  text: '#000' },
  actinoid:   { bg: 'hsl(340deg, 67%, 88%)', text: '#000' },
  nocategory: { bg: 'transparent',            text: '#000' },
};

const ANIMAL_KEYWORDS = [
  'вирус', 'бактери', 'змея', 'змеи', 'змей', 'птиц', 'рыба', 'рыбы', 'акула',
  'медуза', 'губка', 'моллюск', 'червь', 'черви', 'пиявка', 'минога', 'актиния',
  'млекопитающее', 'сумчат', 'грызун', 'собак', 'волк', 'сокол', 'орел', 'орёл',
  'утконос', 'ехидна', 'бегемот', 'свин', 'лошад', 'кошка', 'кошач', 'примат',
  'насеком', 'бабочка', 'жук', 'паук', 'тапир', 'носорог', 'кенартра', 'скат',
  'кит', 'дельфин', 'ленивец', 'лягушка', 'черепаха', 'ящерица',
];

const PLANT_KEYWORDS = [
  'лилииды', 'лилиеподобные', 'магнолииды', 'ароидовидные', 'плауновидные',
  'папоротник', 'саговник', 'бобовопод', 'вересковид', 'плесневые грибы',
  'водоросль', 'хвощ', 'злак', 'злаки', 'мохообразные', 'голосемен', 'мальвовидные',
  'яснотковидные', 'аскомицеты', 'базидиомицеты', 'агарикомицеты', 'кариофиллоподобные',
  'диатомовые',
];

function filterByKeywords(lines: string[], keywords: string[]): string[] {
  return lines.filter((line) =>
    keywords.some((kw) => line.toLowerCase().includes(kw.toLowerCase()))
  );
}

function getCellStyle(category: ElementCategory | null): React.CSSProperties {
  const colors = category ? CATEGORY_COLORS[category] : CATEGORY_COLORS.nocategory;
  return {
    backgroundColor: colors.bg,
    color: colors.text,
  };
}

export function ElementCell({ cell, mode, onClick, onMouseEnter, onMouseLeave }: ElementCellProps) {
  const isEmpty =
    !cell.symbol &&
    cell.properties.length === 0 &&
    cell.text.length === 0 &&
    cell.plants.length === 0 &&
    cell.animals.length === 0;

  if (isEmpty) {
    return <div className="h-full rounded" />;
  }

  const baseClasses = [
    'relative rounded p-1.5 text-[10px] leading-tight cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-md overflow-hidden h-full flex flex-col border border-black/5',
  ].join(' ');

  const titleText = cell.properties.join('\n');

  let content: React.ReactNode;

  if (mode === 'elements') {
    content = (
      <div className="flex flex-col h-full justify-between">
        {cell.symbol ? (
          <>
            <div className="flex justify-between items-start">
              <span className="text-[9px] opacity-80 leading-none">{cell.atomicNumber ?? ''}</span>
              <span className="text-[8px] opacity-80 leading-none">{cell.atomicMass ?? ''}</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <span className="text-lg font-bold leading-none">{cell.symbol}</span>
              <span className="font-medium leading-none truncate w-full mt-0.5">{cell.name}</span>
            </div>
          </>
        ) : cell.properties.length > 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-bold leading-none">{cell.properties[0]}</span>
            {cell.properties[1] && (
              <span className="text-[9px] font-bold leading-tight mt-0.5">{cell.properties[1]}</span>
            )}
          </div>
        ) : (
          <span className="opacity-60 m-auto">—</span>
        )}
      </div>
    );
  } else if (mode === 'plants') {
    const items = cell.plants.length > 0 ? cell.plants : filterByKeywords(cell.text, PLANT_KEYWORDS);
    content = (
      <div className="h-full flex flex-col">
        {cell.symbol && <span className="font-bold text-xs leading-none mb-1">{cell.symbol}</span>}
        {items.length > 0 ? (
          <ul className="space-y-0.5 opacity-95">
            {items.slice(0, 5).map((item, i) => (
              <li key={i} className="truncate">{item}</li>
            ))}
          </ul>
        ) : (
          <span className="opacity-70 mt-auto">—</span>
        )}

      </div>
    );
  } else if (mode === 'animals') {
    const items = cell.animals.length > 0 ? cell.animals : filterByKeywords(cell.text, ANIMAL_KEYWORDS);
    content = (
      <div className="h-full flex flex-col">
        {cell.symbol && <span className="font-bold text-xs leading-none mb-1">{cell.symbol}</span>}
        {items.length > 0 ? (
          <ul className="space-y-0.5 opacity-95">
            {items.slice(0, 5).map((item, i) => (
              <li key={i} className="truncate">{item}</li>
            ))}
          </ul>
        ) : (
          <span className="opacity-70 mt-auto">—</span>
        )}

      </div>
    );
  } else {
    content = (
      <div className="flex flex-col h-full min-h-0">
        {cell.symbol ? (
          <>
            <div className="flex items-baseline justify-between mb-0.5 min-w-0">
              <span className="text-[9px] opacity-80 leading-none">{cell.atomicNumber ?? ''}</span>
              <span className="font-bold text-xs leading-none">{cell.symbol}</span>
            </div>
            <span className="font-medium text-[10px] leading-none truncate mb-1">{cell.name}</span>
            <ul className="space-y-0.5 text-[9px] opacity-95">
              {cell.properties.slice(0, 2).map((prop, i) => (
                <li key={i} className="truncate">{prop}</li>
              ))}
            </ul>
          </>
        ) : (
          <ul className="space-y-0.5 text-[9px] opacity-95">
            {cell.properties.slice(0, 5).map((prop, i) => (
              <li
                key={i}
                className={i > 0 && (cell.category === 'lanthanoid' || cell.category === 'actinoid') ? 'font-bold truncate' : 'truncate'}
              >
                {prop}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div
      className={baseClasses}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="button"
      tabIndex={0}
      title={titleText}
      style={getCellStyle(cell.category)}
    >
      {content}
    </div>
  );
}
