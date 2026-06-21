import { useParams, Navigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getColumn } from '../data/tableData';
import { getColumnDetail } from '../data/detailData';
import { getPlantsByColumn } from '../data/plantData';
import { ContentBlocks } from '../components/ContentBlocks';

export function ColumnPage() {
  const { id } = useParams<{ id: string }>();
  const columnId = id ? parseInt(id, 10) : NaN;
  const column = !isNaN(columnId) ? getColumn(columnId) : undefined;
  const detail = getColumnDetail(columnId);
  const plantsByPeriod = getPlantsByColumn(columnId);

  if (!column) {
    return <Navigate to="/" replace />;
  }

  const imageSrc = detail?.image ?? null;
  const hasPlants = Object.keys(plantsByPeriod).length > 0;

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

        {detail?.blocks && detail.blocks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#d4d0c8]">
            <ContentBlocks blocks={detail.blocks} />
          </div>
        )}

        {hasPlants && (
          <div className="mt-6 pt-4 border-t border-[#d4d0c8]">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Растения</h2>
            <div className="space-y-4">
              {Object.entries(plantsByPeriod).map(([period, plants]) => (
                <div key={period}>
                  <h3 className="text-sm font-medium text-purple-800 mb-2">Ряд {period}</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {plants.map((plant, index) => (
                      <li key={index} className="pl-3 border-l-2 border-green-200">{plant}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
