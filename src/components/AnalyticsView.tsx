import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import {
  getDailyStats,
  getCategoryBreakdown,
  getActivityHeatmap,
} from '../utils/streakCalculator';
import { BarChart3, TrendingUp, CheckCircle, PieChart, Calendar, Award } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { tasks, theme, streakInfo } = useTasks();
  const [rangeDays, setRangeDays] = useState<number>(7);

  const dailyStats = getDailyStats(tasks, rangeDays);
  const categoryStats = getCategoryBreakdown(tasks);
  const heatmapData = getActivityHeatmap(tasks, 56); // 8 weeks

  // Overall metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const overallRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#334155' : '#f1f5f9';
  const axisColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold">Completed</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {completedTasks}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Tasks finished</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold">Success Rate</span>
            <TrendingUp className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {overallRate}%
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Completion ratio</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold">Best Streak</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {streakInfo.longestStreak} <span className="text-xs font-medium text-slate-400">days</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Personal record</p>
        </div>
      </div>

      {/* Main Graph: Daily Tasks Completed */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Daily Completed Tasks Graph
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tracking your daily productivity over time
              </p>
            </div>
          </div>

          {/* Timeframe switch */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
            {[7, 14, 30].map((days) => (
              <button
                key={days}
                onClick={() => setRangeDays(days)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  rangeDays === days
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {days}D
              </button>
            ))}
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis
                dataKey="displayDate"
                stroke={axisColor}
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: gridColor }}
              />
              <YAxis
                stroke={axisColor}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-xl text-xs space-y-1 border border-slate-800">
                        <div className="font-bold text-slate-200">{data.date}</div>
                        <div className="flex items-center justify-between space-x-3 text-orange-400">
                          <span>Completed:</span>
                          <span className="font-bold">{data.completed}</span>
                        </div>
                        <div className="flex items-center justify-between space-x-3 text-slate-400">
                          <span>Planned Total:</span>
                          <span>{data.total}</span>
                        </div>
                        <div className="flex items-center justify-between space-x-3 text-emerald-400">
                          <span>Rate:</span>
                          <span>{data.completionRate}%</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="completed" radius={[6, 6, 0, 0]}>
                {dailyStats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.completed > 0 ? '#ff5722' : isDark ? '#334155' : '#e2e8f0'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Consistency Heatmap (GitHub-style 8 weeks) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Activity & Consistency Heatmap
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Last 8 Weeks</span>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5">
            {heatmapData.map((day) => {
              const bgClass =
                day.level === 4
                  ? 'bg-orange-600'
                  : day.level === 3
                  ? 'bg-orange-500'
                  : day.level === 2
                  ? 'bg-orange-400'
                  : day.level === 1
                  ? 'bg-orange-300 dark:bg-orange-700/80'
                  : 'bg-slate-100 dark:bg-slate-800';

              return (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.count} task${day.count === 1 ? '' : 's'} completed`}
                  className={`w-3.5 h-3.5 rounded-sm transition-transform hover:scale-125 cursor-pointer ${bgClass}`}
                />
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-1.5 text-[11px] text-slate-400 pt-1">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800" />
          <div className="w-3 h-3 rounded-sm bg-orange-300 dark:bg-orange-700/80" />
          <div className="w-3 h-3 rounded-sm bg-orange-400" />
          <div className="w-3 h-3 rounded-sm bg-orange-500" />
          <div className="w-3 h-3 rounded-sm bg-orange-600" />
          <span>More</span>
        </div>
      </div>

      {/* Category Distribution */}
      {categoryStats.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Completed Tasks by Category
            </h3>
          </div>

          <div className="space-y-2.5">
            {categoryStats.map((item) => {
              const percent = completedTasks > 0 ? Math.round((item.count / completedTasks) * 100) : 0;
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                      <span
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name}
                    </span>
                    <span className="text-slate-400">
                      {item.count} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
