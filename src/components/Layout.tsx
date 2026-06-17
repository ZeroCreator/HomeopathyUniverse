import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8f7f4] text-gray-900">
      <header className="bg-white border-b border-[#d4d0c8] sticky top-0 z-30">
        <div className="max-w-[1920px] mx-auto px-4 py-4">
          <div className="flex justify-between items-center gap-4">
            <img
              src="/logo.png"
              alt="Вселенная гомеопатии"
              className="max-h-16 md:max-h-20 w-auto object-contain"
            />
            <h1 className="text-xl md:text-2xl font-semibold text-right italic text-purple-800">
              Ковчег гомеопатии
            </h1>
          </div>
          <p className="text-center text-lg md:text-xl font-bold text-black mt-2">
            Интерактивная периодическая таблица эволюции человека
          </p>
        </div>
      </header>
      <main className="max-w-[1920px] mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="border-t border-[#d4d0c8] bg-white mt-8">
        <div className="max-w-[1920px] mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
          <p>
            spacehom.ru ·{" "}
            <a
              href="mailto:spacehom@mail.ru"
              className="text-purple-700 hover:underline italic"
            >
              spacehom@mail.ru
            </a>
          </p>
          <p>
            Разработка сайта:{" "}
            <a
              href="mailto:shkola.olga@gmail.com"
              className="text-purple-700 hover:underline italic"
            >
              Школа Ольги
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
