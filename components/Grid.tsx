import React, { useMemo, useState } from 'react';
import { 
  eachDayOfInterval, 
  endOfWeek, 
  format, 
  isSameYear, 
  startOfWeek, 
} from 'date-fns';
import { DayCell } from './DayCell';
import { EditModal } from './EditModal';
import { START_DATE, END_DATE } from '../constants';
import { TrackerData, DayCellData, AppConfig } from '../types';

interface GridProps {
  data: TrackerData;
  config: AppConfig;
  maxHoursRecord: number;
  onSetHours: (dateString: string, hours: number) => void;
  onToggleOutput: (dateString: string) => void;
}

const VerticalGrid: React.FC<{ 
  data: TrackerData; 
  config: AppConfig;
  maxHoursRecord: number;
  onCellClick: (data: DayCellData) => void;
}> = ({ data, config, maxHoursRecord, onCellClick }) => {
  const allDays = useMemo(() => {
    const start = startOfWeek(START_DATE, { weekStartsOn: 1 });
    const end = endOfWeek(END_DATE, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, []);

  return (
    <div className="w-full flex flex-col pb-12">
      <div className="grid grid-cols-7 md:grid-cols-14 gap-1 w-full">
        {allDays.map((date) => {
          const dateString = format(date, 'yyyy-MM-dd');
          const isTargetYear = isSameYear(date, START_DATE);
          const cellData: DayCellData = {
            date,
            dateString,
            isTargetYear,
            entry: data[dateString]
          };
          return (
            <div key={dateString} className="aspect-square w-full">
              <DayCell 
                data={cellData} 
                config={config} 
                maxHoursRecord={maxHoursRecord} 
                onClick={onCellClick} 
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
  maxHoursRecord: number;
  onCellClick: (data: DayCellData) => void;
}> = ({ data, config, maxHoursRecord, onCellClick }) => {
  const gridWeeks = useMemo(() => {
    const matrixStart = startOfWeek(START_DATE, { weekStartsOn: 1 }); 
    const matrixEnd = endOfWeek(END_DATE, { weekStartsOn: 1 });
    const allDays = eachDayOfInterval({ start: matrixStart, end: matrixEnd });
    const weeks: DayCellData[][] = [];
    let currentWeek: DayCellData[] = [];
    allDays.forEach((date) => {
      const dateString = format(date, 'yyyy-MM-dd');
      const isTargetYear = isSameYear(date, START_DATE);
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
  }, [data]);

  return (
    <div className="w-full flex flex-col">
       <div className="flex w-full gap-[2px]"> 
          {gridWeeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex-1 flex flex-col gap-[2px]">
              {week.map((dayData) => (
                  <div key={dayData.dateString} className="w-full aspect-square">
                    <DayCell 
                      data={dayData} 
                      config={config} 
                      maxHoursRecord={maxHoursRecord} 
                      onClick={onCellClick} 
                    />
                  </div>
              ))}
              </div>
          ))}
       </div>
    </div>
  );
};

export const Grid: React.FC<GridProps> = ({ data, config, maxHoursRecord, onSetHours, onToggleOutput }) => {
  const [selectedDay, setSelectedDay] = useState<DayCellData | null>(null);

  const handleCellClick = (cellData: DayCellData) => {
    setSelectedDay(cellData);
  };

  const closeModal = () => setSelectedDay(null);

  return (
    <div className="w-full">
      <div className="block xl:hidden">
        <VerticalGrid data={data} config={config} maxHoursRecord={maxHoursRecord} onCellClick={handleCellClick} />
      </div>

      <div className="hidden xl:block">
        <HorizontalGrid data={data} config={config} maxHoursRecord={maxHoursRecord} onCellClick={handleCellClick} />
      </div>

      {selectedDay && (
        <EditModal
          isOpen={!!selectedDay}
          onClose={closeModal}
          date={selectedDay.date}
          dateString={selectedDay.dateString}
          inputLabel={config.inputLabel}
          outputLabel={config.outputLabel}
          hours={data[selectedDay.dateString]?.hours || 0}
          hasOutput={!!data[selectedDay.dateString]?.output}
          theme={config.theme}
          onSetHours={onSetHours}
          onToggleOutput={onToggleOutput}
        />
      )}
    </div>
  );
};