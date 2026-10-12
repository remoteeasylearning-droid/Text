import React from 'react';
import { BookOpen, Sparkles, HelpCircle, Printer, BookMarked } from 'lucide-react';

interface NavbarProps {
  onOpenMethodologyGuide: () => void;
  onOpenPrintPreview: () => void;
  hasTasks: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMethodologyGuide,
  onOpenPrintPreview,
  hasTasks,
}) => {
  return (
    <header className="bg-white border-b border-amber-100 shadow-xs sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-200">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-800 tracking-tight font-sans">
                Лабораторія читання
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                1–4 класи
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Генератор дидактичних матеріалів та завдань з читання для вчителів
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenMethodologyGuide}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            title="Бібліотека методичних прийомів"
          >
            <BookMarked className="w-4 h-4 text-amber-600" />
            <span className="hidden md:inline">Методики</span>
          </button>

          {hasTasks && (
            <button
              onClick={onOpenPrintPreview}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4 text-amber-700" />
              <span className="font-medium">Друк / PDF</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
