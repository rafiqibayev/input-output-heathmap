import { eachDayOfInterval, format, isAfter, startOfDay } from 'date-fns';
import { TrackerData } from '../types';
import { START_DATE, END_DATE } from '../constants';

export interface ChartDataPoint {
  date: string;
  displayDate: string;
  timestamp: number;
  hours: number;
  output: boolean;
  average: number;
  isFuture: boolean;
}

export const processChartData = (data: TrackerData): ChartDataPoint[] => {
  const allDays = eachDayOfInterval({ start: START_DATE, end: END_DATE });
  const today = startOfDay(new Date());

  // Calculate Global Average up to today
  let totalHours = 0;
  let daysPassed = 0;
  
  // First pass to calculate average
  allDays.forEach(day => {
    if (isAfter(day, today)) return;
    const dateString = format(day, 'yyyy-MM-dd');
    const entry = data[dateString];
    if (entry) {
        totalHours += entry.hours;
    }
    daysPassed++;
  });

  const globalAverage = daysPassed > 0 ? parseFloat((totalHours / daysPassed).toFixed(2)) : 0;

  return allDays.map(day => {
    const dateString = format(day, 'yyyy-MM-dd');
    const entry = data[dateString];
    const isFuture = isAfter(day, today);
    
    return {
      date: dateString,
      displayDate: format(day, 'MMM d'),
      timestamp: day.getTime(),
      hours: entry ? entry.hours : 0,
      output: entry ? entry.output : false,
      average: globalAverage,
      isFuture
    };
  });
};