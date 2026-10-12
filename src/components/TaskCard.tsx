import React, { useState } from 'react';
import { ReadingTask } from '../types';
import { 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  HelpCircle, 
  Lightbulb,
  Award
} from 'lucide-react';

interface TaskCardProps {
  task: ReadingTask;
  index: number;
  onUpdateTask: (updatedTask: ReadingTask) => void;
  onDeleteTask: (taskId: string) => void;
  showTeacherAnswersGlobal: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  onUpdateTask,
  onDeleteTask,
  showTeacherAnswersGlobal,
}) => {
  const [copied, setCopied] = useState(false);
  const [showAnswer, setShowAnswer] = useState(showTeacherAnswersGlobal);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState(task.title);
  const [editTechnique, setEditTechnique] = useState(task.technique);
  const [editInstruction, setEditInstruction] = useState(task.instruction);
  const [editContent, setEditContent] = useState(task.taskContent);
  const [editAnswer, setEditAnswer] = useState(task.teacherAnswer);

  const handleCopy = () => {
    const textToCopy = `${task.title} (${task.technique})
Навичка: ${task.skillCategory}

Інструкція для дитини:
${task.instruction}

Завдання:
${task.taskContent}

Правильна відповідь для вчителя:
${task.teacherAnswer}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    onUpdateTask({
      ...task,
      title: editTitle,
      technique: editTechnique,
      instruction: editInstruction,
      taskContent: editContent,
      teacherAnswer: editAnswer,
    });
    setIsEditing(false);
  };

  const isAnswerVisible = showAnswer || showTeacherAnswersGlobal;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-sm transition-all overflow-hidden">
      {/* Task Header Bar */}
      <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
            {index + 1}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
            {task.technique}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-200 text-slate-700">
            {task.skillCategory}
          </span>
        </div>

        {/* Task Card Controls */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
            title="Скопіювати завдання"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setShowAnswer(!showAnswer)}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
            title={isAnswerVisible ? 'Сховати відповідь' : 'Показати відповідь'}
          >
            {isAnswerVisible ? <EyeOff className="w-4 h-4 text-amber-700" /> : <Eye className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            title="Редагувати завдання"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onDeleteTask(task.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Видалити завдання"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editing Mode Form */}
      {isEditing ? (
        <div className="p-4 sm:p-5 space-y-4 bg-amber-50/30">
          <div>
            <label className="text-xs font-semibold text-slate-700">Заголовок завдання:</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Інструкція для дитини:</label>
            <textarea
              value={editInstruction}
              onChange={(e) => setEditInstruction(e.target.value)}
              rows={2}
              className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Зміст завдання:</label>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-sm font-sans"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Відповідь для вчителя:</label>
            <textarea
              value={editAnswer}
              onChange={(e) => setEditAnswer(e.target.value)}
              rows={2}
              className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-xs font-sans text-amber-950"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg"
            >
              Cкасувати
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Зберегти</span>
            </button>
          </div>
        </div>
      ) : (
        /* Normal Card View */
        <div className="p-4 sm:p-5 space-y-3">
          <h3 className="text-base font-bold text-slate-900 leading-snug">
            {task.title}
          </h3>

          {/* Child Instruction Box */}
          <div className="p-3 bg-amber-50/70 border-l-4 border-amber-500 rounded-r-xl flex items-start space-x-2.5">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm font-medium text-amber-950 leading-relaxed">
              <span className="font-bold">Інструкція для дитини: </span>
              {task.instruction}
            </div>
          </div>

          {/* Main Task Exercise Content */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm whitespace-pre-wrap leading-relaxed font-sans font-normal">
            {task.taskContent}
          </div>

          {/* Teacher Answer Key */}
          {isAnswerVisible && (
            <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
              <div className="font-bold text-emerald-900 flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>Правильна відповідь / Ключ для вчителя:</span>
              </div>
              <div className="whitespace-pre-wrap leading-relaxed pl-5 font-mono text-[11px] sm:text-xs">
                {task.teacherAnswer}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
