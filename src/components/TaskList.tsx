import React, { useState } from 'react';
import { ReadingTask } from '../types';
import { TaskCard } from './TaskCard';
import { 
  Eye, 
  EyeOff, 
  Copy, 
  Plus, 
  Sparkles, 
  BookOpen, 
  FileCheck,
  Check
} from 'lucide-react';

interface TaskListProps {
  tasks: ReadingTask[];
  onUpdateTask: (updatedTask: ReadingTask) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: () => void;
  onCopyAll: () => void;
  copiedSuccess: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onUpdateTask,
  onDeleteTask,
  onAddTask,
  onCopyAll,
  copiedSuccess,
}) => {
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-2xs">
          <BookOpen className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">
          Завдання ще не сформовано
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Вставте навчальний текст у форму вище або оберіть готовий зразок, оберіть вік дитини та навички, а потім натисніть 
          <span className="font-semibold text-amber-700"> «Створити завдання»</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Controls for Task List */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <FileCheck className="w-5 h-5 text-amber-600" />
          <h2 className="text-sm font-bold text-slate-800">
            Згенерований дидактичний комплекс ({tasks.length} {tasks.length === 1 ? 'вправа' : tasks.length < 5 ? 'вправи' : 'вправ'})
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowAllAnswers(!showAllAnswers)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-900 bg-white hover:bg-amber-100 border border-amber-300 transition-colors shadow-2xs"
          >
            {showAllAnswers ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-amber-700" />
                <span>Сховати всі відповіді</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-amber-700" />
                <span>Показати всі відповіді вчителя</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onCopyAll}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-colors shadow-2xs"
          >
            {copiedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Скопійовано!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Скопіювати все</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onAddTask}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 transition-colors"
            title="Додати нове власність завдання вручну"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Додати вправу</span>
          </button>
        </div>
      </div>

      {/* Task Cards Stack */}
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            showTeacherAnswersGlobal={showAllAnswers}
          />
        ))}
      </div>
    </div>
  );
};
