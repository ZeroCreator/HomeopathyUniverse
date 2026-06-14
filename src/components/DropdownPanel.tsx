import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface DropdownPanelProps {
  anchor: HTMLElement | null;
  children: React.ReactNode;
  onClose: () => void;
  align?: 'left' | 'center';
  width?: number;
}

export function DropdownPanel({
  anchor,
  children,
  onClose,
  align = 'left',
  width = 256,
}: DropdownPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    let left = rect.left;
    if (align === 'center') {
      left = rect.left + rect.width / 2 - width / 2;
    }
    let top = rect.bottom + 4;

    // Keep inside viewport horizontally
    const margin = 8;
    if (left + width > window.innerWidth - margin) {
      left = window.innerWidth - width - margin;
    }
    if (left < margin) {
      left = margin;
    }

    setPosition({ top, left });
  }, [anchor, align, width]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!panelRef.current || !anchor) return;
      if (
        !panelRef.current.contains(e.target as Node) &&
        !anchor.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKey);
    };
  }, [anchor, onClose]);

  if (!position) return null;

  return createPortal(
    <div
      ref={panelRef}
      className="fixed z-[100] bg-white border border-[#d4d0c8] rounded-md shadow-xl p-3 text-gray-600"
      style={{ top: position.top, left: position.left, width }}
    >
      {children}
    </div>,
    document.body
  );
}
