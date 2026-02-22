import React, { useMemo, useState, useCallback } from 'react';
import { 
  eachDayOfInterval, 
  endOfWeek, 
  format, 
  isSameYear, 
  startOfWeek,
  isSameDay
} from 'date-fns';
import { DayCell } from './DayCell';
import { GridTooltip } from './GridTooltip';
import { START_DATE, END_DATE } from '../constants';
import { TrackerData, DayCellData, AppConfig } from '../types';

interface GridProps {
  data: TrackerData;
  config: AppConfig;
  currentYear: number;
  onCellClick: (data: DayCellData) => void;
}

const WeekdayHeader: React.FC = () => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  return (
    <div className="grid grid-cols-7 md:grid-cols-14 gap-1 w-full mb-2 sticky top-0 bg-white dark:bg-neutral-950 z-20 py-2 border-b border-gray-100 dark:border-neutral-800">
      {/* First Week Labels (Always Visible) */}
      {days.map((d, i) => (
        <div key={`d1-${i}`} className="text-[10px] text-center font-bold text-gray-400 dark:text-neutral-600 select-none">
          {d}
        </div>
      ))}
      
      {/* Second Week Labels (Visible on Tablet+) */}
      {days.map((d, i) => (
        <div key={`d2-${i}`} className="hidden md:block text-[10px] text-center font-bold text-gray-400 dark:text-neutral-600 select-none">
          {d}
        </div>
      ))}
    </div>
  );
};

const VerticalGrid: React.FC<{ 
  data: TrackerData; 
  config: AppConfig;
  currentYear: number;
  onCellClick: (data: DayCellData) => void;
  onCellMouseEnter: (e: React.MouseEvent, data: DayCellData) => void;
  onCellMouseLeave: () => void;
}> = ({ data, config, currentYear, onCellClick, onCellMouseEnter, onCellMouseLeave }) => {
  const allDays = useMemo(() => {
    const start = startOfWeek(new Date(currentYear, 0, 1), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(currentYear, 11, 31), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentYear]);

  // Capture today's date once per render
  const today = new Date();

  return (
    <div className="w-full flex flex-col pb-12">
      <WeekdayHeader />
      <div className="grid grid-cols-7 md:grid-cols-14 gap-1 w-full">
        {allDays.map((date) => {
          const dateString = format(date, 'yyyy-MM-dd');
          const isTargetYear = isSameYear(date, new Date(currentYear, 0, 1));
          const cellData: DayCellData = {
            date,
            dateString,
            isTargetYear,
            entry: data[dateString]
          };
          const isToday = isSameDay(date, today);

          return (
            <div key={dateString} className="aspect-square w-full">
              <DayCell 
                data={cellData} 
                config={config}
                isToday={isToday}
                onClick={onCellClick} 
                onMouseEnter={onCellMouseEnter}
                onMouseLeave={onCellMouseLeave}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const HorizontalGrid: React.FC<{
  data: TrackerData;
  config: AppConfig;
  currentYear: number;
  onCellClick: (data: DayCellData) => void;
  onCellMouseEnter: (e: React.MouseEvent, data: DayCellData) => void;
  onCellMouseLeave: () => void;
}> = ({ data, config, currentYear, onCellClick, onCellMouseEnter, onCellMouseLeave }) => {
  const gridWeeks = useMemo(() => {
    const matrixStart = startOfWeek(new Date(currentYear, 0, 1), { weekStartsOn: 1 }); 
    const matrixEnd = endOfWeek(new Date(currentYear, 11, 31), { weekStartsOn: 1 });
    const allDays = eachDayOfInterval({ start: matrixStart, end: matrixEnd });
    const weeks: DayCellData[][] = [];
    let currentWeek: DayCellData[] = [];
    allDays.forEach((date) => {
      const dateString = format(date, 'yyyy-MM-dd');
      const isTargetYear = isSameYear(date, new Date(currentYear, 0, 1));
      currentWeek.push({
        date,
        dateString,
        isTargetYear,
        entry: data[dateString]
      });
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    return weeks;
  }, [data, currentYear]);

  const today = new Date();

  return (
    <div className="w-full flex flex-col overflow-x-auto pb-4">
       <div className="flex w-full gap-[2px] min-w-max"> 
          {gridWeeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex-1 flex flex-col gap-[2px] w-4 lg:w-5">
              {week.map((dayData) => (
                  <div key={dayData.dateString} className="w-full aspect-square">
                    <DayCell 
                      data={dayData} 
                      config={config}
                      isToday={isSameDay(dayData.date, today)}
                      onClick={onCellClick} 
                      onMouseEnter={onCellMouseEnter}
                      onMouseLeave={onCellMouseLeave}
                    />
                  </div>
              ))}
              </div>
          ))}
       </div>
    </div>
  );
};

export const Grid: React.FC<GridProps> = ({ data, config, currentYear, onCellClick }) => {
  const [tooltipState, setTooltipState] = useState<{ data: DayCellData; x: number; y: number } | null>(null);

  const handleCellMouseEnter = useCallback((e: React.MouseEvent, cellData: DayCellData) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltipState({
        data: cellData,
        x: rect.left + rect.width / 2,
        y: rect.top
    });
  }, []);

  const handleCellMouseLeave = useCallback(() => {
    setTooltipState(null);
  }, []);

  return (
    <div className="w-full relative">
      <div className="block xl:hidden">
        <VerticalGrid 
          data={data} 
          config={config} 
          currentYear={currentYear}
          onCellClick={onCellClick} 
          onCellMouseEnter={handleCellMouseEnter}
          onCellMouseLeave={handleCellMouseLeave}
        />
      </div>

      <div className="hidden xl:block">
        <HorizontalGrid 
          data={data} 
          config={config} 
          currentYear={currentYear}
          onCellClick={onCellClick} 
          onCellMouseEnter={handleCellMouseEnter}
          onCellMouseLeave={handleCellMouseLeave}
        />
      </div>

      {tooltipState && (
        <GridTooltip 
            data={tooltipState.data} 
            position={{ x: tooltipState.x, y: tooltipState.y }} 
            theme={config.theme} 
        />
      )}
    </div>
  );
};