export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskCategory = 'Work' | 'Personal' | 'Fitness' | 'Learning' | 'Errands' | string;

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: string; // ISO string
  priority: TaskPriority;
  category: TaskCategory;
  dueTime?: string; // HH:mm
  createdAt: string; // ISO string
}

export type StreakStatus = 'completed' | 'at_risk' | 'broken' | 'empty';

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  completedToday: number;
  dailyGoal: number;
  isGoalMetToday: boolean;
  isStreakActiveToday: boolean;
  streakStatus: StreakStatus;
}

export interface DailyStat {
  date: string; // YYYY-MM-DD
  displayDate: string; // e.g., "Mon 24"
  completed: number;
  total: number;
  completionRate: number; // percentage 0-100
}

export interface CategoryBreakdown {
  name: string;
  count: number;
  color: string;
}

export interface AppSettings {
  dailyGoal: number;
  theme: 'light' | 'dark' | 'system';
  soundEnabled: boolean;
  celebrationsEnabled: boolean;
}

