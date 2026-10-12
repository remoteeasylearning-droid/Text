import React, { useState } from 'react';
import { AgeGroup } from '../types';
import { SAMPLE_TEXTS } from '../data/sampleTexts';
import { SKILL_CATEGORIES } from '../data/methodologies';
import { 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Download, 
  BookOpen, 
  Check, 
  CheckSquare, 
  Square,
  Eraser,
  FileText,
  Users
} from 'lucide-react';

interface InputPanelProps {
  text: string;
  setText: (text: string) => void;
  ageGroup: AgeGroup;
  setAgeGroup: (age: AgeGroup) => void;
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
  onGenerate: (variant?: number) => void;
  onCopyAll: () => void;
  onDownloadFile: () => void;
  isLoading: boolean;
  hasTasks: boolean;
  copiedSuccess: boolean;
}

const AGE_GROUPS: AgeGroup[] = [
  '6–7 років (1 клас)',
  '7–8 років (2 клас)',
  '8–9 років (3 клас)',
  '9–10 років (4 клас)'
];

export const InputPanel: React.FC<InputPanelProps> = ({
  text,
  setText,
  ageGroup,
  setAgeGroup,
  selectedSkills,
  setSelectedSkills,
  onGenerate,
  onCopyAll,
  onDownloadFile,
  isLoading,
  hasTasks,
  copiedSuccess,
}) => {
  const [showSamples, setShowSamples] = useState(false);
  const [variantCounter, setVariantCounter] = useState(1);

  const toggleSkill = (label: string) => {
    if (selectedSkills.includes(label)) {
      setSelectedSkills(selectedSkills.filter(s => s !== label));
    } else {
      setSelectedSkills([...selectedSkills, label]);
    }
  };

  const selectAllSkills = () => {
    setSelectedSkills(SKILL_CATEGORIES.map(s => s.label));
  };

  const clearAllSkills = () => {
    setSelectedSkills([]);
  };

  const handleSelectSample = (sampleText: string) => {
    setText(sampleText);
    setShowSamples(false);
  };

  const handleGenerateVariant = () => {
    const newVariant = variantCounter + 1;
    setVariantCounter(newVariant);
    onGenerate(newVariant);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
      {/* Step 1: Text Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-slate-800 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">1</span>
            <span>Текст для опрацювання</span>
          </label>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowSamples(!showSamples)}
              className="inline-flex items-center space-x-1 text-xs font-medium text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-md border border-amber-200 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>{showSamples ? 'Сховати зразки' : 'Зразки текстів'}</span>
            </button>

            {text && (
              <button
                type="button"
                onClick={() => setText('')}
                className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-2 py-1 rounded-md transition-colors"
                title="Очистити текст"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Очистити</span>
              </button>
            )}
          </div>
        </div>

        {/* Sample Texts Dropdown Panel */}
        {showSamples && (
          <div className="mb-3 p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2">
            <p className="text-xs font-medium text-amber-900">
              Оберіть навчальний текст для швидкої перевірки або демонстрації:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_TEXTS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample.text)}
                  className="text-left p-2.5 bg-white hover:bg-amber-100/70 border border-amber-200 rounded-lg transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-amber-900">
                      {sample.title}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200/60 text-amber-800 font-medium">
                      {sample.ageRecommendation}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {sample.text}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Вставте сюди будь-який навчальний текст, казку, оповідання або уривок з підручника..."
            rows={6}
            className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all leading-relaxed"
          />
          <div className="absolute bottom-2.5 right-3 text-[11px] font-medium text-slate-400 pointer-events-none">
            {text.length} символів | ~{text.trim() ? text.trim().split(/\s+/).length : 0} слів
          </div>
        </div>
      </div>

      {/* Step 2: Age Group Selection */}
      <div>
        <label className="text-sm font-semibold text-slate-800 flex items-center space-x-2 mb-2.5">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">2</span>
          <span>Вік дітей / Клас</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {AGE_GROUPS.map((age) => {
            const isSelected = ageGroup === age;
            return (
              <button
                key={age}
                type="button"
                onClick={() => setAgeGroup(age)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center flex items-center justify-center space-x-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs ring-2 ring-amber-300'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <Users className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span>{age}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Goals / Skills Selection */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-sm font-semibold text-slate-800 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">3</span>
            <span>Мета — оберіть читацькі навички</span>
          </label>
          <div className="flex items-center space-x-2 text-xs">
            <button
              type="button"
              onClick={selectAllSkills}
              className="text-amber-700 hover:underline font-medium"
            >
              Обрати всі
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={clearAllSkills}
              className="text-slate-500 hover:underline"
            >
              Очистити
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {SKILL_CATEGORIES.map((skill) => {
            const isChecked = selectedSkills.includes(skill.label);
            return (
              <button
                key={skill.id}
                type="button"
                onClick={() => toggleSkill(skill.label)}
                className={`p-3 rounded-xl border text-left transition-all flex items-start space-x-2.5 ${
                  isChecked
                    ? 'bg-amber-50/80 border-amber-400 ring-1 ring-amber-400 shadow-2xs'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-amber-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div>
                  <div className={`text-xs font-semibold ${isChecked ? 'text-amber-950' : 'text-slate-800'}`}>
                    {skill.label}
                  </div>
                  <div className="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-2">
                    {skill.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        {/* Primary Generate Button */}
        <button
          type="button"
          onClick={() => onGenerate()}
          disabled={isLoading || !text.trim()}
          className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-amber-200 hover:shadow-lg transition-all transform active:scale-98"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Генеруємо вправи...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-white" />
              <span>Створити завдання</span>
            </>
          )}
        </button>

        {/* Secondary Buttons (Always visible when tasks exist) */}
        <div className="flex items-center flex-wrap gap-2">
          {hasTasks && (
            <>
              <button
                type="button"
                onClick={handleGenerateVariant}
                disabled={isLoading || !text.trim()}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors disabled:opacity-50"
                title="Згенерувати новий варіант вправ для цього ж тексту"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Інший варіант</span>
              </button>

              <button
                type="button"
                onClick={onCopyAll}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                title="Скопіювати всі завдання у буфер обміну"
              >
                {copiedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Скопійовано!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>Скопіювати</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onDownloadFile}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
                title="Завантажити завдання у файл .txt / .doc"
              >
                <Download className="w-3.5 h-3.5 text-amber-700" />
                <span>Завантажити файл</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
