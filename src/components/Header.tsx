import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Flame, Moon, Sun, Target, RotateCcw } from 'lucide-react';
import { getLocalDateString, getFullDateFormatted } from '../utils/dateUtils';

export const Header: React.FC = () => {
  const { streakInfo, theme, toggleTheme, dailyGoal, setDailyGoal, resetToDemoData } = useTasks();
  const [showGoalModal, setShowGoalModal] = useState(false);
  const todayFormatted = getFullDateFormatted(getLocalDateString());

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                DailyFlow
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              {todayFormatted}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Streak Counter Chip in Header */}
          <div className="flex items-center bg-gradient-to-r from-orange-500/10 to-amber-500/10 dark:from-orange-500/20 dark:to-amber-500/20 border border-orange-200 dark:border-orange-800/60 rounded-full px-3 py-1 text-orange-600 dark:text-orange-400 font-semibold text-xs sm:text-sm">
            <Flame className={`w-4 h-4 mr-1 text-orange-500 ${streakInfo.currentStreak > 0 ? 'fill-orange-500' : ''}`} />
            <span>{streakInfo.currentStreak} Day{streakInfo.currentStreak === 1 ? '' : 's'} Streak</span>
          </div>

          {/* Daily Goal Button */}
          <button
            onClick={() => setShowGoalModal(!showGoalModal)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
            title="Adjust Daily Goal"
            aria-label="Adjust Daily Goal"
          >
            <Target className="w-5 h-5" />
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Clear all tasks and reset streak? This cannot be undone.')) {
                resetToDemoData();
              }
            }}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Clear All Data"
            aria-label="Clear All Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Daily Goal Quick Modal */}
      {showGoalModal && (
        <div className="absolute right-4 top-16 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center">
              <Target className="w-4 h-4 mr-1.5 text-orange-500" />
              Daily Streak Target
            </h3>
            <button
              onClick={() => setShowGoalModal(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            How many completed tasks are required each day to keep your streak alive?
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 5].map((count) => (
              <button
                key={count}
                onClick={() => {
                  setDailyGoal(count);
                  setShowGoalModal(false);
                }}
                className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                  dailyGoal === count
                    ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-orange-400'
                }`}
              >
                {count} {count === 1 ? 'Task' : 'Tasks'}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

