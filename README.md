# DailyFlow — Daily To-Do List & Streak Tracker

DailyFlow is a high-productivity daily task tracker featuring interactive task completion graphs and an automated daily streak tracking engine.

## Features

- **Daily To-Do List Management**:
  - Add tasks with title, notes, priority levels (`High`, `Med`, `Low`), category tags (`Work`, `Personal`, `Fitness`, `Learning`, `Errands`), and due times.
  - Interactive completion checkboxes with celebratory confetti animations.
  - Inline task editing and quick delete.
  - Search tasks, filter by completion status (`All`, `Pending`, `Completed`), and filter by category tags.
- **Automated Daily Streak Engine**:
  - Real-time streak calculation with animated flame badge.
  - Status protection indicators (`Streak Protected Today`, `Streak At Risk`, `Start A New Streak`).
  - Progress bar tracking your daily goal progress (e.g. 1/1, 2/3 tasks completed).
  - All-time record (longest streak) preserved.
  - Customizable daily goal target (1, 2, 3, or 5 tasks per day).
- **Interactive Graphs & Analytics**:
  - Recharts bar chart displaying completed tasks per day over 7, 14, or 30 days.
  - Overall completion success rate percentage and total completed counter.
  - 8-Week GitHub-style consistency activity heatmap.
  - Task completion distribution by category.
- **Modern UI & Persistence**:
  - Dark Mode and Light Mode support with smooth transitions.
  - Fully offline-first: all tasks, settings, and streak records persist in `localStorage`.
  - Date navigator with quick access to previous days, today, or future dates.

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

### 3. Build for production
```bash
npm run build
```

### 4. Preview the production build
```bash
npm run preview
```

