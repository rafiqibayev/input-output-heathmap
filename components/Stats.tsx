import React from 'react';
import { ThemeColor } from '../types';
import { THEME_COLORS } from '../constants';

interface StatsProps {
  grindDays: number;
  outputsShipped: number;
  totalHours: number;
  theme: ThemeColor;
}

export const Stats: React.FC<StatsProps> = ({ grindDays, outputsShipped, totalHours, theme }) => {
  const currentTheme = THEME_COLORS[theme] || THEME_COLORS.red;

  return (
    <div className="flex flex-wrap gap-8 my-8 pb-8 border-b border-gray-100 dark:border-neutral-800">
      <div className="flex flex-col">
        <span className="text-4xl font-bold tracking-tighter text-neutral-900 dark:text-white">{grindDays}</span>
        <span className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest mt-1">Goal Met</span>
      </div>
      
      <div className="flex flex-col">
        <span className={`text-4xl font-bold tracking-tighter ${currentTheme.text}`}>{outputsShipped}</span>
        <span className={`text-xs font-bold ${currentTheme.textMuted} uppercase tracking-widest mt-1`}>Outputs Shipped</span>
      </div>

      <div className="flex flex-col">
        <span className="text-4xl font-bold tracking-tighter text-neutral-400 dark:text-neutral-600">{Math.round(totalHours)}h</span>
        <span className="text-xs font-bold text-gray-300 dark:text-neutral-700 uppercase tracking-widest mt-1">Total Effort</span>
      </div>
    </div>
  );
};