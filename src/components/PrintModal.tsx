import React, { useState } from 'react';
import { ReadingTask, AgeGroup } from '../types';
import { X, Printer, CheckSquare, Square, Download, FileText } from 'lucide-react';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: ReadingTask[];
  originalText: string;
  ageGroup: AgeGroup;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  tasks,
  originalText,
  ageGroup,
}) => {
  const [includeText, setIncludeText] = useState(true);
  const [includeStudentHeader, setIncludeStudentHeader] = useState(true);
  const [includeAnswers, setIncludeAnswers] = useState(false);
  const [largeFont, setLargeFont] = useState(ageGroup.includes('6–7') || ageGroup.includes('7–8'));
  const [worksheetTitle, setWorksheetTitle] = useState('Картка з читання та розвитку мовлення');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col my-auto overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold">
              Попередній перегляд перед друком / PDF
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customization Toolbar */}
        <div className="bg-slate-100 p-4 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0 text-xs text-slate-700">
          <label className="flex items-center space-x-2 cursor-pointer bg-white p-2.5 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              checked={includeText}
              onChange={(e) => setIncludeText(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span className="font-medium">Включити оригінальний текст</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer bg-white p-2.5 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              checked={includeStudentHeader}
              onChange={(e) => setIncludeStudentHeader(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span className="font-medium">Шапка дитини (Прізвище, Клас)</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer bg-white p-2.5 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              checked={includeAnswers}
              onChange={(e) => setIncludeAnswers(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span className="font-medium">Додати ключ відповідей вчителя</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer bg-white p-2.5 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              checked={largeFont}
              onChange={(e) => setLargeFont(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500"
            />
            <span className="font-medium">Великий шрифт (1–2 клас)</span>
          </label>
        </div>

        {/* Printable Document Sheet Preview */}
        <div className="p-6 overflow-y-auto bg-slate-200/60 grow">
          <div 
            id="printable-area" 
            className={`bg-white p-8 sm:p-12 shadow-md rounded-xl max-w-3xl mx-auto space-y-6 text-slate-900 border border-slate-200 ${
              largeFont ? 'text-base leading-relaxed' : 'text-sm leading-normal'
            }`}
          >
            {/* Student Header */}
            {includeStudentHeader && (
              <div className="border-b-2 border-slate-900 pb-3 mb-4 flex flex-wrap items-center justify-between text-xs sm:text-sm font-serif">
                <div>Прізвище, ім'я дитини: ___________________________</div>
                <div>Клас: _____ &nbsp;&nbsp;&nbsp; Дата: _________</div>
              </div>
            )}

            {/* Document Title */}
            <div className="text-center space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold font-serif uppercase tracking-wide">
                {worksheetTitle}
              </h1>
              <p className="text-xs text-slate-500 font-sans">
                Лабораторія читання • Вікова категорія: {ageGroup}
              </p>
            </div>

            {/* Original Reading Text */}
            {includeText && originalText && (
              <div className="p-4 bg-amber-50/40 border border-amber-300 rounded-lg space-y-2">
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Текст для читання:
                </div>
                <div className="whitespace-pre-wrap font-serif leading-relaxed text-slate-900">
                  {originalText}
                </div>
              </div>
            )}

            {/* Tasks List for Worksheet */}
            <div className="space-y-6">
              {tasks.map((task, idx) => (
                <div key={task.id} className="space-y-2 border-b border-slate-200 pb-4 last:border-0">
                  <div className="font-bold font-serif text-slate-900 flex items-start space-x-2">
                    <span className="shrink-0">{idx + 1}.</span>
                    <span>{task.title}</span>
                  </div>

                  <div className="pl-5 italic font-sans text-slate-700 bg-slate-50 p-2 rounded border border-slate-200 text-xs sm:text-sm">
                    <strong>Інструкція: </strong>{task.instruction}
                  </div>

                  <div className="pl-5 whitespace-pre-wrap font-serif text-slate-900 pt-1 leading-relaxed">
                    {task.taskContent}
                  </div>
                </div>
              ))}
            </div>

            {/* Teacher Answers Sheet at End */}
            {includeAnswers && (
              <div className="pt-8 border-t-2 border-dashed border-slate-400 space-y-4 page-break-before">
                <div className="text-center font-bold text-lg text-slate-800 uppercase tracking-wide">
                  Ключ відповідей для вчителя
                </div>
                <div className="space-y-3 text-xs sm:text-sm font-mono">
                  {tasks.map((t, i) => (
                    <div key={t.id} className="p-2 bg-slate-50 rounded border border-slate-200">
                      <strong>Завдання {i + 1} ({t.technique}):</strong> {t.teacherAnswer}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
          >
            Закрити
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Друкувати / Зберегти як PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
