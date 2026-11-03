import { Task, StreakInfo, DailyStat, CategoryBreakdown } from '../types';
import { getLocalDateString, addDays, getChartLabel, getPastDates, parseLocalDate } from './dateUtils';

export const CATEGORY_COLORS: Record<string, string> = {
  Work: '#3b82f6', // blue
  Personal: '#8b5cf6', // purple
  Fitness: '#10b981', // emerald
  Learning: '#f59e0b', // amber
  Errands: '#ec4899', // pink
  Other: '#64748b', // slate
};

/**
 * Calculates current streak, best streak, and today's status
 */
export function calculateStreak(
  tasks: Task[],
  dailyGoal: number = 1,
  persistedBestStreak: number = 0
): StreakInfo {
  const today = getLocalDateString();
  const yesterday = addDays(today, -1);

  // Group completed tasks by task date
  const completedCountsByDate = new Map<string, number>();

  tasks.forEach((task) => {
    if (task.completed) {
      // Use task.date as the primary bucket
      const taskDate = task.date;
      completedCountsByDate.set(taskDate, (completedCountsByDate.get(taskDate) || 0) + 1);
    }
  });

  const completedToday = completedCountsByDate.get(today) || 0;
  const isGoalMetToday = completedToday >= dailyGoal;

  let currentStreak = 0;
  let streakStatus: StreakInfo['streakStatus'] = 'empty';

  // Check if today meets goal
  if (isGoalMetToday) {
    currentStreak = 1;
    streakStatus = 'completed';

    // Walk backward from yesterday
    let checkDate = yesterday;
    while ((completedCountsByDate.get(checkDate) || 0) >= dailyGoal) {
      currentStreak++;
      checkDate = addDays(checkDate, -1);
    }
  } else {
    // Today has not met goal yet. Check if yesterday was active to keep streak alive
    const completedYesterday = completedCountsByDate.get(yesterday) || 0;
    if (completedYesterday >= dailyGoal) {
      streakStatus = 'at_risk';
      let checkDate = yesterday;
      while ((completedCountsByDate.get(checkDate) || 0) >= dailyGoal) {
        currentStreak++;
        checkDate = addDays(checkDate, -1);
      }
    } else {
      currentStreak = 0;
      streakStatus = completedCountsByDate.size > 0 ? 'broken' : 'empty';
    }
  }

  // Calculate all-time longest streak
  const qualifiedDates = Array.from(completedCountsByDate.entries())
    .filter(([_, count]) => count >= dailyGoal)
    .map(([date]) => date)
    .sort();

  let maxStreak = 0;
  let tempStreak = 0;
  let prevDate: string | null = null;

  for (const date of qualifiedDates) {
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const expectedNext = addDays(prevDate, 1);
      if (date === expectedNext) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    if (tempStreak > maxStreak) {
      maxStreak = tempStreak;
    }
    prevDate = date;
  }

  const longestStreak = Math.max(maxStreak, currentStreak, persistedBestStreak);

  return {
    currentStreak,
    longestStreak,
    completedToday,
    dailyGoal,
    isGoalMetToday,
    isStreakActiveToday: isGoalMetToday,
    streakStatus,
  };
}

/**
 * Builds daily statistics for charting (past N days)
 */
export function getDailyStats(tasks: Task[], daysCount: number = 7): DailyStat[] {
  const dates = getPastDates(daysCount);
  const tasksByDate = new Map<string, { total: number; completed: number }>();

  tasks.forEach((t) => {
    const entry = tasksByDate.get(t.date) || { total: 0, completed: 0 };
    entry.total += 1;
    if (t.completed) {
      entry.completed += 1;
    }
    tasksByDate.set(t.date, entry);
  });

  return dates.map((dateStr) => {
    const entry = tasksByDate.get(dateStr) || { total: 0, completed: 0 };
    const completionRate = entry.total > 0 ? Math.round((entry.completed / entry.total) * 100) : 0;
    return {
      date: dateStr,
      displayDate: getChartLabel(dateStr, daysCount <= 14),
      completed: entry.completed,
      total: entry.total,
      completionRate,
    };
  });
}

/**
 * Calculates category breakdown of completed tasks
 */
export function getCategoryBreakdown(tasks: Task[]): CategoryBreakdown[] {
  const counts: Record<string, number> = {};

  tasks.forEach((t) => {
    if (t.completed) {
      const cat = t.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    }
  });

  return Object.entries(counts).map(([name, count]) => ({
    name,
    count,
    color: CATEGORY_COLORS[name] || CATEGORY_COLORS.Other,
  }));
}

/**
 * Generates data for a GitHub-like activity heatmap (e.g. past 60 days)
 */
export function getActivityHeatmap(tasks: Task[], daysCount: number = 60) {
  const dates = getPastDates(daysCount);
  const completedMap = new Map<string, number>();

  tasks.forEach((t) => {
    if (t.completed) {
      completedMap.set(t.date, (completedMap.get(t.date) || 0) + 1);
    }
  });

  return dates.map((d) => {
    const count = completedMap.get(d) || 0;
    let level = 0;
    if (count >= 5) level = 4;
    else if (count >= 3) level = 3;
    else if (count >= 2) level = 2;
    else if (count >= 1) level = 1;

    return {
      date: d,
      count,
      level,
      weekday: parseLocalDate(d).getDay(),
    };
  });
}

