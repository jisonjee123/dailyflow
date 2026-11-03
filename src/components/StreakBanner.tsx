import React from 'react';
import { useTasks } from '../context/TaskContext';
import { Flame, Trophy, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export const StreakBanner: React.FC = () => {
  const { streakInfo, dailyGoal } = useTasks();
  const { currentStreak, longestStreak, completedToday, streakStatus } = streakInfo;

  const progressPercent = Math.min(100, Math.round((completedToday / dailyGoal) * 100));

  const getStatusBadge = () => {
    switch (streakStatus) {
      case 'completed':
        return (
          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
            Streak Protected Today
          </span>
        );
      case 'at_risk':
        return (
          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-600 dark:text-amber-400" />
            Streak At Risk! Complete a task
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-slate-500" />
            Start A New Streak
          </span>
        );
    }
  };

  const getMotivationalMessage = () => {
    if (streakStatus === 'completed') {
      return `Awesome work! You've crushed today's goal with ${completedToday} task${completedToday > 1 ? 's' : ''} completed!`;
    }
    if (streakStatus === 'at_risk') {
      const remaining = Math.max(1, dailyGoal - completedToday);
      return `Don't break the chain! Finish ${remaining} more task${remaining > 1 ? 's' : ''} to keep your ${currentStreak}-day streak alive.`;
    }
    return `Every journey begins with a single step. Complete ${dailyGoal} task${dailyGoal > 1 ? 's' : ''} to ignite your flame!`;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-rose-950/30 border border-orange-200/80 dark:border-orange-800/50 p-5 sm:p-6 shadow-sm">
      {/* Background Decorative Blur */}
      <div className="absolute -right-8 -top-8 w-40 h-40 bg-orange-400/20 dark:bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-amber-400/20 dark:bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Streak Counter & Fire Flame */}
        <div className="flex items-center space-x-5">
          <div className="relative shrink-0">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                currentStreak > 0
                  ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 shadow-lg shadow-orange-500/30 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
              }`}
            >
              <Flame
                className={`w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-300 ${
                  currentStreak > 0
                    ? 'fill-white stroke-orange-600 drop-shadow animate-flame-pulse'
                    : 'stroke-current'
                }`}
              />
            </div>
            {currentStreak >= 3 && (
              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-yellow-400 text-yellow-950 text-[10px] font-black rounded-full shadow-md uppercase tracking-wider animate-bounce-short">
                Hot!
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {currentStreak}
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300">
                {currentStreak === 1 ? 'Day Streak' : 'Days Streak'}
              </span>
              {getStatusBadge()}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
              {getMotivationalMessage()}
            </p>
          </div>
        </div>

        {/* Right: Today's Goal Progress & All-Time Record */}
        <div className="w-full md:w-72 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-xl p-4 border border-orange-100 dark:border-orange-900/40">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
            <span>Today's Target</span>
            <span className="text-slate-900 dark:text-white font-bold">
              {completedToday} / {dailyGoal} Completed
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Record */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="flex items-center text-slate-500 dark:text-slate-400">
              <Trophy className="w-3.5 h-3.5 mr-1 text-amber-500" />
              All-Time Best Streak
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {longestStreak} {longestStreak === 1 ? 'Day' : 'Days'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

