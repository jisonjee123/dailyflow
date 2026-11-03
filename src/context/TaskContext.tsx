import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, StreakInfo } from '../types';
import { getLocalDateString } from '../utils/dateUtils';
import { calculateStreak } from '../utils/streakCalculator';
import { fireTaskCelebration, fireStreakCelebration } from '../utils/confetti';

interface TaskContextType {
  tasks: Task[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  addTask: (data: {
    title: string;
    description?: string;
    priority: Task['priority'];
    category: Task['category'];
    dueTime?: string;
    date?: string;
  }) => void;
  toggleTask: (id: string) => void;
  editTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  clearCompletedForDate: (date: string) => void;
  streakInfo: StreakInfo;
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  filterCategory: string;
  setFilterCategory: (cat: string) => void;
  filterStatus: 'all' | 'pending' | 'completed';
  setFilterStatus: (status: 'all' | 'pending' | 'completed') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  resetToDemoData: () => void;
}

const STORAGE_KEY_TASKS = 'dailyflow_tasks_v1';
const STORAGE_KEY_SETTINGS = 'dailyflow_settings_v1';
const STORAGE_KEY_BEST_STREAK = 'dailyflow_best_streak_v1';



const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load tasks from localStorage', e);
    }
    return []; // Start fresh with no tasks
  });

  const [selectedDate, setSelectedDate] = useState<string>(getLocalDateString());
  const [dailyGoal, setDailyGoal] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.dailyGoal) return parsed.dailyGoal;
      }
    } catch { }
    return 1; // 1 task per day default
  });

  const [bestStreak, setBestStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BEST_STREAK);
      if (saved) return parseInt(saved, 10);
    } catch { }
    return 0;
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    } catch { }
    return 'light';
  });

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persist tasks
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to persist tasks', e);
    }
  }, [tasks]);

  // Persist dailyGoal
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify({ dailyGoal }));
    } catch { }
  }, [dailyGoal]);

  // Apply theme to html root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Calculate streak info
  const streakInfo = calculateStreak(tasks, dailyGoal, bestStreak);

  // Update best streak if current surpasses it
  useEffect(() => {
    if (streakInfo.currentStreak > bestStreak) {
      setBestStreak(streakInfo.currentStreak);
      localStorage.setItem(STORAGE_KEY_BEST_STREAK, streakInfo.currentStreak.toString());
    }
  }, [streakInfo.currentStreak, bestStreak]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const addTask = (data: {
    title: string;
    description?: string;
    priority: Task['priority'];
    category: Task['category'];
    dueTime?: string;
    date?: string;
  }) => {
    const newTask: Task = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      priority: data.priority,
      category: data.category,
      dueTime: data.dueTime || undefined,
      date: data.date || selectedDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const nextCompleted = !task.completed;
          if (nextCompleted) {
            fireTaskCelebration();
            // Check if completing this task meets or boosts streak
            if (streakInfo.currentStreak > 0 && !streakInfo.isGoalMetToday) {
              setTimeout(() => fireStreakCelebration(), 250);
            }
          }
          return {
            ...task,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return task;
      })
    );
  };

  const editTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const clearCompletedForDate = (date: string) => {
    setTasks((prev) => prev.filter((task) => !(task.date === date && task.completed)));
  };

  const resetToDemoData = () => {
    setTasks([]);
    setBestStreak(0);
    localStorage.removeItem(STORAGE_KEY_TASKS);
    localStorage.removeItem(STORAGE_KEY_BEST_STREAK);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        selectedDate,
        setSelectedDate,
        addTask,
        toggleTask,
        editTask,
        deleteTask,
        clearCompletedForDate,
        streakInfo,
        dailyGoal,
        setDailyGoal,
        theme,
        toggleTheme,
        filterCategory,
        setFilterCategory,
        filterStatus,
        setFilterStatus,
        searchQuery,
        setSearchQuery,
        resetToDemoData,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}

