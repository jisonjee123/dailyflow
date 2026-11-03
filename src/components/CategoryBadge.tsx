import React from 'react';
import { CATEGORY_COLORS } from '../utils/streakCalculator';

interface CategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'sm' }) => {
  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
      style={{
        backgroundColor: `${color}18`,
        color: color,
        border: `1px solid ${color}35`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full mr-1.5 shrink-0"
        style={{ backgroundColor: color }}
      />
      {category}
    </span>
  );
};

