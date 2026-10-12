import React, { useState } from 'react';
import { METHODOLOGY_LIBRARY } from '../data/methodologies';
import { X, BookMarked, Search, CheckCircle2, Sparkles } from 'lucide-react';

interface MethodologyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyGuideModal: React.FC<MethodologyGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredMethodologies = METHODOLOGY_LIBRARY.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col my-auto overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500 rounded-lg text-slate-950">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                Бібліотека методичних прийомів читання
              </h2>
              <p className="text-xs text-slate-400">
                Сучасні інтерактивні форми вправ для початкової школи (НУШ)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Пошук методики за назвою чи метою (наприклад: Плутанина, Критичне мислення)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Methodology Grid */}
        <div className="p-6 overflow-y-auto grow space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMethodologies.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-amber-300 transition-all space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-slate-900">
                      {item.name}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-900 border border-amber-200">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-2">
                    {item.description}
                  </p>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700">
                    <span className="font-semibold text-amber-900">Мета: </span>
                    {item.purpose}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] italic text-slate-500">
                  <span className="font-semibold text-slate-700 not-italic">Приклад: </span>
                  {item.childExample}
                </div>
              </div>
            ))}
          </div>

          {filteredMethodologies.length === 0 && (
            <div className="text-center py-10 text-slate-500 text-xs">
              За вашим запитом не знайдено методичних прийомів.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 shrink-0">
          Усі вправи автоматично адаптуються під текст та вікові особливості дитини під час генерації.
        </div>
      </div>
    </div>
  );
};
