import React from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskItem } from './TaskItem';
import { Search, ListTodo, Sparkles } from 'lucide-react';
import { TaskCategory } from '../types';

const CATEGORIES: ('all' | TaskCategory)[] = ['all', 'Work', 'Personal', 'Fitness', 'Learning', 'Errands'];

export const TaskList: React.FC = () => {
  const {
    tasks,
    selectedDate,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    clearCompletedForDate,
  } = useTasks();

  // Tasks for the selected day
  const dateTasks = tasks.filter((t) => t.date === selectedDate);

  // Apply filters
  const filteredTasks = dateTasks.filter((task) => {
    // Status filter
    if (filterStatus === 'pending' && task.completed) return false;
    if (filterStatus === 'completed' && !task.completed) return false;

    // Category filter
    if (filterCategory !== 'all' && task.category !== filterCategory) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    return true;
  });

  const completedCount = dateTasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm space-y-3 transition-colors">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          {/* Search input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Tabs (All, Pending, Completed) */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 w-full sm:w-auto justify-center">
            {(['all', 'pending', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-colors ${
                  filterStatus === status
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-slate-400 font-medium text-[11px] shrink-0 mr-1">Tags:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-0.5 rounded-full font-medium shrink-0 transition-all ${
                filterCategory === cat
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'all' ? 'All Tags' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task List Header / Summary */}
      <div className="flex items-center justify-between px-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span>
          Showing {filteredTasks.length} of {dateTasks.length} task{dateTasks.length === 1 ? '' : 's'}
        </span>
        {completedCount > 0 && (
          <button
            onClick={() => clearCompletedForDate(selectedDate)}
            className="text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 hover:underline"
          >
            Clear completed ({completedCount})
          </button>
        )}
      </div>

      {/* Tasks List */}
      <div className="space-y-2.5">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => <TaskItem key={task.id} task={task} />)
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center">
              {searchQuery || filterCategory !== 'all' || filterStatus !== 'all' ? (
                <ListTodo className="w-6 h-6" />
              ) : (
                <Sparkles className="w-6 h-6" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {searchQuery || filterCategory !== 'all' || filterStatus !== 'all'
                  ? 'No matching tasks found'
                  : 'No tasks scheduled for this day'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                {searchQuery || filterCategory !== 'all' || filterStatus !== 'all'
                  ? 'Try clearing your search query or selecting a different filter.'
                  : 'Stay organized and keep your streak burning bright by adding your daily goals above!'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
