import React, { useState } from 'react';
import { AgeGroup, ReadingTask } from './types';
import { SAMPLE_TEXTS } from './data/sampleTexts';
import { SKILL_CATEGORIES } from './data/methodologies';
import { Navbar } from './components/Navbar';
import { InputPanel } from './components/InputPanel';
import { TaskList } from './components/TaskList';
import { PrintModal } from './components/PrintModal';
import { MethodologyGuideModal } from './components/MethodologyGuideModal';
import { AlertCircle, CheckCircle2, Sparkles, BookOpen, Info } from 'lucide-react';
import { generateLocalTasks } from './utils/localTaskGenerator';

export default function App() {
  const [text, setText] = useState<string>(SAMPLE_TEXTS[0].text);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('7–8 років (2 клас)');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    SKILL_CATEGORIES.map((s) => s.label)
  );

  const [tasks, setTasks] = useState<ReadingTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [isStaticMode, setIsStaticMode] = useState<boolean>(false);

  // Modals
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  const handleGenerate = async (variant?: number) => {
    if (!text.trim()) {
      setError('Будь ласка, вставте текст для створення завдань.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          ageGroup,
          skills: selectedSkills,
          variant,
        }),
      });

      if (!response.ok) {
        // If endpoint is not found (e.g. running as static site on GitHub Pages)
        if (response.status === 404) {
          const fallbackTasks = generateLocalTasks(text, ageGroup, selectedSkills, variant || 1);
          setTasks(fallbackTasks);
          setIsStaticMode(true);
          return;
        }
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Помилка сервера (${response.status})`);
      }

      const data = await response.json();

      const generatedTasks: ReadingTask[] = (data.tasks || []).map(
        (t: any, index: number) => ({
          id: `task-${Date.now()}-${index}`,
          technique: t.technique || 'Вправа',
          title: t.title || `Завдання ${index + 1}`,
          skillCategory: t.skillCategory || 'Розуміння змісту',
          instruction: t.instruction || 'Виконай завдання за текстом.',
          taskContent: t.taskContent || '',
          teacherAnswer: t.teacherAnswer || '',
        })
      );

      setTasks(generatedTasks);
      setIsStaticMode(false);
    } catch (err: any) {
      console.warn('API unavailable or failed, using local methodology generator:', err);
      // Fallback for static hosts (GitHub Pages) or offline mode
      const fallbackTasks = generateLocalTasks(text, ageGroup, selectedSkills, variant || 1);
      setTasks(fallbackTasks);
      setIsStaticMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = (updatedTask: ReadingTask) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleAddTask = () => {
    const newTask: ReadingTask = {
      id: `task-${Date.now()}`,
      technique: 'Власне завдання',
      title: `Завдання ${tasks.length + 1}`,
      skillCategory: 'Робота з текстом',
      instruction: 'Вкажіть інструкцію для дитини...',
      taskContent: 'Введіть зміст вправи...',
      teacherAnswer: 'Вкажіть правильну відповідь для вчителя...',
      isEditing: true,
    };
    setTasks([...tasks, newTask]);
  };

  const handleCopyAll = () => {
    if (tasks.length === 0) return;

    const formattedContent = `ЛАБОРАТОРІЯ ЧИТАННЯ — ДИДАКТИЧНИЙ КОМПЛЕКС
Вікова категорія: ${ageGroup}

==================================================
ОРИГІНАЛЬНИЙ ТЕКСТ:
${text}
==================================================

СФОРМОВАНІ ЗАВДАННЯ:

${tasks
  .map(
    (task, i) => `--------------------------------------------------
${i + 1}. ${task.title} [${task.technique}]
Навичка: ${task.skillCategory}

ІНСТРУКЦІЯ ДЛЯ ДИТИНИ:
${task.instruction}

ЗАВДАННЯ:
${task.taskContent}

ПРАВИЛЬНА ВІДПОВІДЬ ДЛЯ ВЧИТЕЛЯ:
${task.teacherAnswer}
`
  )
  .join('\n')}
`;

    navigator.clipboard.writeText(formattedContent);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  const handleDownloadFile = () => {
    if (tasks.length === 0) return;

    const fileText = `ЛАБОРАТОРІЯ ЧИТАННЯ — НАВЧАЛЬНІ МАТЕРІАЛИ
Вікова група: ${ageGroup}
Дата формування: ${new Date().toLocaleDateString('uk-UA')}

1. ТЕКСТ ДЛЯ ЧИТАННЯ:
--------------------------------------------------
${text}

2. ДИДАКТИЧНІ ВПРАВИ ДЛЯ УЧНІВ:
--------------------------------------------------
${tasks
  .map(
    (task, idx) => `
Завдання ${idx + 1}. ${task.title} (${task.technique})
Інструкція: ${task.instruction}

${task.taskContent}
`
  )
  .join('\n==================================================\n')}

3. ВІДПОВІДІ ТА МЕТОДИЧНІ ВКАЗІВКИ ДЛЯ ВЧИТЕЛЯ:
--------------------------------------------------
${tasks
  .map(
    (task, idx) => `
Завдання ${idx + 1} (${task.technique}):
${task.teacherAnswer}
`
  )
  .join('\n')}`;

    const blob = new Blob([fileText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Завдання_Лабораторія_читання_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans antialiased flex flex-col">
      {/* Top Navbar */}
      <Navbar
        onOpenMethodologyGuide={() => setShowGuideModal(true)}
        onOpenPrintPreview={() => setShowPrintModal(true)}
        hasTasks={tasks.length > 0}
      />

      {/* Main Workspace Container */}
      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error Notification Banner */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-900 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="grow">
              <span className="font-bold">Помилка: </span>
              {error}
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-500 hover:text-rose-700 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Static Mode / Offline Fallback Notice */}
        {isStaticMode && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-amber-900 text-sm">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="grow">
              <span className="font-bold">Автономний методичний режим: </span>
              Завдання створено за дидактичними шаблонами НУШ. На статичному хостингу GitHub Pages серверний бекенд із моделлю Gemini AI недоступний.
            </div>
            <button
              onClick={() => setIsStaticMode(false)}
              className="text-amber-500 hover:text-amber-700 font-bold"
              title="Закрити"
            >
              ×
            </button>
          </div>
        )}

        {/* Input Parameters Section */}
        <InputPanel
          text={text}
          setText={setText}
          ageGroup={ageGroup}
          setAgeGroup={setAgeGroup}
          selectedSkills={selectedSkills}
          setSelectedSkills={setSelectedSkills}
          onGenerate={handleGenerate}
          onCopyAll={handleCopyAll}
          onDownloadFile={handleDownloadFile}
          isLoading={isLoading}
          hasTasks={tasks.length > 0}
          copiedSuccess={copiedSuccess}
        />

        {/* Task Generation Results Output Section */}
        <TaskList
          tasks={tasks}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onAddTask={handleAddTask}
          onCopyAll={handleCopyAll}
          copiedSuccess={copiedSuccess}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 mt-auto">
        <p>
          Лабораторія читання • Інструмент вчителя початкових класів для розвитку читацької грамотності (НУШ)
        </p>
      </footer>

      {/* Methodology Guide Modal */}
      <MethodologyGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />

      {/* Print / Download PDF Modal */}
      <PrintModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        tasks={tasks}
        originalText={text}
        ageGroup={ageGroup}
      />
    </div>
  );
}
