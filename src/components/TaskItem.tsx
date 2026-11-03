import React, { useState } from 'react';
import { Task, TaskPriority, TaskCategory } from '../types';
import { useTasks } from '../context/TaskContext';
import { PriorityBadge } from './PriorityBadge';
import { CategoryBadge } from './CategoryBadge';
import { Check, Trash2, Edit3, Clock, ChevronDown, ChevronUp, Save, X } from 'lucide-react';

const CATEGORIES: TaskCategory[] = ['Work', 'Personal', 'Fitness', 'Learning', 'Errands'];
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTask, editTask, deleteTask } = useTasks();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority);
  const [editCategory, setEditCategory] = useState<TaskCategory>(task.category);
  const [editDueTime, setEditDueTime] = useState(task.dueTime || '');
  const [showNotes, setShowNotes] = useState(false);

  const handleSave = () => {
    if (!editTitle.trim()) return;
    editTask(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      priority: editPriority,
      category: editCategory,
      dueTime: editDueTime || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority);
    setEditCategory(task.category);
    setEditDueTime(task.dueTime || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-slate-900 border-2 border-orange-400 dark:border-orange-500 rounded-xl p-4 shadow-md space-y-3">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full text-sm font-semibold bg-slate-50 dark:bg-slate-800 rounded-lg p-2 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500"
          placeholder="Task title..."
          autoFocus
        />

        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          rows={2}
          className="w-full text-xs bg-slate-50 dark:bg-slate-800 rounded-lg p-2 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500"
          placeholder="Add notes or subtasks..."
        />

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-slate-800 dark:text-slate-200"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-slate-800 dark:text-slate-200"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                Priority: {p.toUpperCase()}
              </option>
            ))}
          </select>

          <input
            type="time"
            value={editDueTime}
            onChange={(e) => setEditDueTime(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-slate-800 dark:text-slate-200 text-xs"
          />

          <div className="flex-1" />

          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-lg bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
          >
            <Save className="w-3.5 h-3.5 mr-1" />
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative rounded-xl border transition-all duration-200 p-3 sm:p-4 ${
        task.completed
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-80'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <button
          type="button"
          onClick={() => toggleTask(task.id)}
          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all duration-200 ${
            task.completed
              ? 'bg-emerald-500 border-emerald-600 text-white scale-105 shadow-sm shadow-emerald-500/20'
              : 'border-slate-300 dark:border-slate-600 hover:border-orange-500 dark:hover:border-orange-400 bg-white dark:bg-slate-800'
          }`}
          title={task.completed ? 'Mark pending' : 'Mark completed'}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3
              onClick={() => toggleTask(task.id)}
              className={`text-sm sm:text-base font-semibold cursor-pointer select-none transition-colors ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-800 dark:text-slate-100 hover:text-orange-600 dark:hover:text-orange-400'
              }`}
            >
              {task.title}
            </h3>

            {/* Actions: Edit & Delete */}
            <div className="opacity-0 group-hover:opacity-100 sm:transition-opacity flex items-center space-x-1 shrink-0">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Edit task"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Badges: Category, Priority, Due Time, Description preview */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <CategoryBadge category={task.category} size="sm" />
            <PriorityBadge priority={task.priority} />

            {task.dueTime && (
              <span className="inline-flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                <Clock className="w-3 h-3 mr-1 text-slate-400" />
                {task.dueTime}
              </span>
            )}

            {task.description && (
              <button
                type="button"
                onClick={() => setShowNotes(!showNotes)}
                className="inline-flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 ml-1"
              >
                {showNotes ? (
                  <>
                    <ChevronUp className="w-3 h-3 mr-0.5" /> Hide Notes
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 mr-0.5" /> Notes
                  </>
                )}
              </button>
            )}
          </div>

          {/* Expanded Notes */}
          {showNotes && task.description && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-800/40 p-2.5 rounded-lg whitespace-pre-wrap">
              {task.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

