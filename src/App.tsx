import React from 'react';
import { TaskProvider } from './context/TaskContext';
import { Header } from './components/Header';
import { StreakBanner } from './components/StreakBanner';
import { DateNavigator } from './components/DateNavigator';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';
import { AnalyticsView } from './components/AnalyticsView';

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Daily Streak Highlight Banner */}
        <StreakBanner />

        {/* 2-Column Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Task Planning & Execution */}
          <div className="lg:col-span-7 space-y-4">
            <DateNavigator />
            <TaskInput />
            <TaskList />
          </div>

          {/* Right Column: Analytics & Completion Graph */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
            <AnalyticsView />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-400">
        <p>DailyFlow — Stay consistent, build momentum, and keep your daily streak alive 🔥</p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

