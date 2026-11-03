import React from 'react';
import { useTasks } from '../context/TaskContext';
import { ChevronLeft, ChevronRight, CheckCheck } from 'lucide-react';
import { addDays, getLocalDateString, getRelativeDateLabel } from '../utils/dateUtils';

export const DateNavigator: React.FC = () => {
  const { selectedDate, setSelectedDate, tasks } = useTasks();

  const handlePrevDay = () => {
    setSelectedDate(addDays(selectedDate, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const handleToday = () => {
    setSelectedDate(getLocalDateString());
  };

  const isCurrentToday = selectedDate === getLocalDateString();

  // Tasks count for the currently selected date
  const tasksForDate = tasks.filter((t) => t.date === selectedDate);
  const completedForDate = tasksForDate.filter((t) => t.completed).length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors">
      {/* Date Stepper */}
      <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
        <button
          onClick={handlePrevDay}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          title="Previous Day"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2">
          <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
            {getRelativeDateLabel(selectedDate)}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            ({selectedDate})
          </span>
        </div>

        <button
          onClick={handleNextDay}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          title="Next Day"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {!isCurrentToday && (
          <button
            onClick={handleToday}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 hover:bg-orange-100 transition-colors"
          >
            Go to Today
          </button>
        )}
      </div>

      {/* Date Picker & Quick Summary */}
      <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
        {/* Date picker */}
        <div className="relative">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              if (e.target.value) {
                setSelectedDate(e.target.value);
              }
            }}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Task progress badge for this date */}
        <div className="flex items-center text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          <CheckCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
          <span>
            {completedForDate} / {tasksForDate.length} Done
          </span>
        </div>
      </div>
    </div>
  );
};
