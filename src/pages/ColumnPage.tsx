import { useParams, Navigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getColumn } from '../data/tableData';

export function ColumnPage() {
  const { id } = useParams<{ id: string }>();
  const columnId = id ? parseInt(id, 10) : NaN;
  const column = !isNaN(columnId) ? getColumn(columnId) : undefined;

  if (!column) {
    return <Navigate to="/" replace />;
  }

  // Добавляй сюда пути к картинкам для каждой колонки.
  // Файлы должны лежать в папке public/.
  const COLUMN_IMAGES: Record<number, string> = {
    1: '/1.png',
    2: '/2.png',
    3: '/3.png',
    4: '/4.png',
    5: '/5.png',
    6: '/6.png',
    7: '/7.png',
    8: '/8.png',
    9: '/9.png',
    10: '/10.jpg',
    11: '/11.png',
    12: '/12.png',
    13: '/13.png',
    14: '/14.png',
    15: '/15.png',
    16: '/16.jpg',
    17: '/17.png',
    18: '/18.jpg',
  };

  const imageSrc = COLUMN_IMAGES[column.id] || null;

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-purple-700 hover:underline mb-4"
      >
        <ArrowLeft size={16} /> Назад к таблице
      </Link>

      <div className="bg-white rounded-xl shadow border border-[#d4d0c8] p-6">
        {column.topTitle && (
          <p className="text-sm text-gray-500">{column.topTitle}</p>
        )}
        <h1 className="text-2xl font-bold text-gray-900">{column.title}</h1>
        <p className="text-gray-600 mt-1">{column.subtitle}</p>

        {imageSrc && (
          <img
            src={imageSrc}
            alt={column.title}
            className="mt-4 w-full max-h-80 object-contain rounded-lg border border-[#d4d0c8]"
          />
        )}

        {column.description && (
          <p className="mt-4 text-sm text-gray-700">{column.description}</p>
        )}
      </div>
    </div>
  );
}
