import React from 'react';
import { format } from 'date-fns';
import { DayCellData, AppConfig } from '../types';
import { THEME_COLORS } from '../constants';

interface DayCellProps {
  data: DayCellData;
  config: AppConfig;
  maxHoursRecord: number;
  onClick: (data: DayCellData) => void;
}

export const DayCell: React.FC<DayCellProps> = React.memo(({ data, config, maxHoursRecord, onClick }) => {
  const { isTargetYear, entry, date } = data;
  const { dailyGoal, viewMode, theme } = config;

  const hours = entry?.hours || 0;
  const hasOutput = entry?.output || false;
  
  const currentTheme = THEME_COLORS[theme] || THEME_COLORS.red;

  // Default Base: Void/Gray
  let bgClass = 'bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800'; 
  let textClass = 'text-gray-400 dark:text-neutral-700 font-medium';
  let intensityOpacity = 0;
  let useIntensityOverlay = false;

  if (hasOutput) {
    // Dynamic Theme Priority
    bgClass = `${currentTheme.bg} ${currentTheme.hover}`;
    textClass = 'text-white font-bold';
  } else if (hours > 0) {
    if (viewMode === 'goal') {
      // GOAL MODE: Solid Binary logic
      if (hours >= dailyGoal) {
        bgClass = 'bg-neutral-900 hover:bg-neutral-700 dark:bg-neutral-100 dark:hover:bg-white';
        textClass = 'text-white dark:text-neutral-900 font-bold';
      } else {
        bgClass = 'bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700';
        textClass = 'text-gray-500 dark:text-neutral-600 font-medium';
      }
    } else {
      // INTENSITY MODE: Relative Heatmap logic
      useIntensityOverlay = true;
      const ratio = hours / maxHoursRecord;
      intensityOpacity = 0.2 + (ratio * 0.8);
      
      textClass = intensityOpacity > 0.5 ? 'text-white dark:text-neutral-900' : 'text-neutral-600 dark:text-neutral-300';
      textClass += ' font-bold relative z-10';
      bgClass = 'bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800';
    }
  }

  const dayNum = date.getDate();
  const isFirstOfMonth = dayNum === 1;
  const label = isFirstOfMonth ? format(date, 'MMM').toUpperCase() : dayNum;
  const visibilityClass = isTargetYear ? 'opacity-100' : 'opacity-0 pointer-events-none';
  const textSizeClass = isFirstOfMonth ? 'text-[8px] md:text-[9px]' : 'text-[10px] md:text-xs';

  return (
    <button
      onClick={() => isTargetYear && onClick(data)}
      title={`${data.dateString}: ${hours}h ${hasOutput ? '(Shipped)' : ''}`}
      className={`
        relative w-full h-full rounded-[1px] md:rounded-sm 
        flex items-center justify-center overflow-hidden
        transition-all duration-200 active:scale-95
        ${bgClass} ${visibilityClass}
      `}
    >
        {useIntensityOverlay && (
          <div 
            className="absolute inset-0 bg-neutral-900 dark:bg-neutral-100 pointer-events-none transition-opacity duration-300"
            style={{ opacity: intensityOpacity }}
          />
        )}
        
        <span className={`${textSizeClass} leading-none select-none ${textClass} tracking-tighter relative z-10`}>
            {label}
        </span>
    </button>
  );
});

DayCell.displayName = 'DayCell';