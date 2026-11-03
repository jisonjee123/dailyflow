import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Plus, Clock, AlignLeft, Flag, Tag } from 'lucide-react';
import { TaskPriority, TaskCategory } from '../types';

const CATEGORIES: TaskCategory[] = ['Work', 'Personal', 'Fitness', 'Learning', 'Errands'];
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

export const TaskInput: React.FC = () => {
  const { addTask, selectedDate } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState<TaskCategory>('Work');
  const [dueTime, setDueTime] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title,
      description: description.trim() || undefined,
      priority,
      category,
      dueTime: dueTime || undefined,
      date: selectedDate,
    });

    // Reset input
    setTitle('');
    setDescription('');
    setDueTime('');
    setShowDetails(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm transition-colors focus-within:border-orange-500/60 focus-within:ring-2 focus-within:ring-orange-500/20"
    >
      <div className="flex items-center space-x-2">
        <div className="text-orange-500 pl-1">
          <Plus className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`Add a new task for ${selectedDate}...`}
          className="flex-1 bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className={`p-1.5 rounded-lg border text-xs font-medium flex items-center transition-colors ${
            showDetails
              ? 'bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-800'
              : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
          title="Add Details (Notes, Due Time, Category)"
        >
          <AlignLeft className="w-4 h-4 sm:mr-1" />
          <span className="hidden sm:inline">Options</span>
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-4 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-orange-500/20"
        >
          Add Task
        </button>
      </div>

      {/* Expandable Options Drawer */}
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3 animate-in fade-in duration-150">
          {/* Optional Description */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add notes or subtasks..."
            rows={2}
            className="w-full text-xs font-normal bg-slate-50 dark:bg-slate-800/60 rounded-lg p-2 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Category selection */}
            <div className="flex items-center space-x-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-medium">Category:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority selection */}
            <div className="flex items-center space-x-1.5">
              <Flag className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-medium">Priority:</span>
              <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                      priority === p
                        ? p === 'high'
                          ? 'bg-rose-500 text-white shadow-sm'
                          : p === 'medium'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-blue-500 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Time selection */}
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-medium">Time:</span>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-orange-500 text-xs"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

