/**
 * Returns date in YYYY-MM-DD in local time
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Convert YYYY-MM-DD string to Date at local midnight
 */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Add or subtract days from a YYYY-MM-DD string
 */
export function addDays(dateStr: string, days: number): string {
  const d = parseLocalDate(dateStr);
  d.setDate(d.getDate() + days);
  return getLocalDateString(d);
}

/**
 * Checks if the date string is today
 */
export function isToday(dateStr: string): boolean {
  return dateStr === getLocalDateString();
}

/**
 * Human friendly display label for a date
 */
export function getRelativeDateLabel(dateStr: string): string {
  const today = getLocalDateString();
  const yesterday = addDays(today, -1);
  const tomorrow = addDays(today, 1);

  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  if (dateStr === tomorrow) return 'Tomorrow';

  const d = parseLocalDate(dateStr);
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Full readable date: "Monday, November 3, 2026"
 */
export function getFullDateFormatted(dateStr: string): string {
  const d = parseLocalDate(dateStr);
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Short date format for charts: "Nov 3" or "Mon"
 */
export function getChartLabel(dateStr: string, includeDayOfWeek: boolean = true): string {
  const d = parseLocalDate(dateStr);
  if (includeDayOfWeek) {
    return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
  }
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/**
 * Generate an array of YYYY-MM-DD strings for the past N days up to referenceDate
 */
export function getPastDates(daysCount: number, referenceDate: string = getLocalDateString()): string[] {
  const dates: string[] = [];
  for (let i = daysCount - 1; i >= 0; i--) {
    dates.push(addDays(referenceDate, -i));
  }
  return dates;
}

