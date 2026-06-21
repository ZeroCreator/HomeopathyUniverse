import type { ContentBlock } from '../types';

interface ContentBlocksProps {
  blocks: ContentBlock[];
}

export function ContentBlocks({ blocks }: ContentBlocksProps) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        switch (block.type) {
          case 'heading':
            return (
              <h2
                key={key}
                className="text-lg font-semibold text-gray-900 mt-6 first:mt-0"
              >
                {block.content}
              </h2>
            );

          case 'text':
            return (
              <p key={key} className="text-sm text-gray-700 leading-relaxed">
                {block.content}
              </p>
            );

          case 'image':
            return (
              <figure key={key} className="mt-4">
                <img
                  src={block.src}
                  alt={block.alt || block.caption || 'Иллюстрация'}
                  className="w-full max-h-80 object-contain rounded-lg border border-[#d4d0c8]"
                />
                {block.caption && (
                  <figcaption className="mt-2 text-xs text-center text-gray-500">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case 'list':
            return (
              <ul key={key} className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
