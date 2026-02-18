import React, { useMemo, useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import { ThemeColor } from '../types';
import { THEME_HEX } from '../constants';
import { ChartDataPoint } from '../utils/processChartData';
import { startOfDay, format, startOfWeek, isAfter, endOfWeek } from 'date-fns';

interface StatsChartProps {
  data: ChartDataPoint[];
  theme: ThemeColor;
}

const CustomTooltip = ({ active, payload, themeHex, viewMode }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    let label = data.displayDate;
    let valuePrefix = 'Effort: ';
    
    if (viewMode === 'weekly') {
       label = `Week of ${format(new Date(data.date), 'MMM d')}`;
       valuePrefix = 'Total: ';
    } else if (viewMode === 'build') {
       label = `${data.displayDate}`;
       valuePrefix = 'Project Scope: ';
    }
      
    return (
      <div className="bg-neutral-900 border border-neutral-700 p-3 rounded-sm shadow-xl z-50">
        <p className="text-white text-xs font-bold font-mono mb-1">{label}</p>
        <p className="text-gray-300 text-xs font-mono">
          {valuePrefix}
          <span className="text-white font-bold">{data.hours}h</span>
        </p>
        {data.output && (
          <p className="text-xs font-bold font-mono mt-1 uppercase tracking-wider" style={{ color: themeHex }}>
            ★ SHIPPED
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const StatsChart: React.FC<StatsChartProps> = ({ data, theme }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'build'>('daily');
  const themeHex = THEME_HEX[theme] || THEME_HEX.red;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Process Weekly Data
  const weeklyData = useMemo(() => {
    if (viewMode !== 'weekly') return [];

    const weeks: ChartDataPoint[] = [];
    let currentWeekStart = startOfWeek(new Date(data[0].date), { weekStartsOn: 1 });
    let currentWeekHours = 0;
    let currentWeekOutput = false;
    
    // Calculate global weekly average based on past weeks
    const today = startOfDay(new Date());
    let totalPastHours = 0;
    let pastWeeksCount = 0;

    // First pass to group
    const groupedWeeks: { date: Date; hours: number; output: boolean; isFuture: boolean }[] = [];
    
    // We iterate through all days to group them
    data.forEach((day) => {
      const dayDate = new Date(day.date);
      const weekStart = startOfWeek(dayDate, { weekStartsOn: 1 });
      
      if (weekStart.getTime() !== currentWeekStart.getTime()) {
        // Push previous week
        groupedWeeks.push({
          date: currentWeekStart,
          hours: currentWeekHours,
          output: currentWeekOutput,
          isFuture: isAfter(currentWeekStart, today)
        });
        
        // Reset
        currentWeekStart = weekStart;
        currentWeekHours = 0;
        currentWeekOutput = false;
      }
      
      currentWeekHours += day.hours;
      if (day.output) currentWeekOutput = true;
    });

    // Push last week
    groupedWeeks.push({
        date: currentWeekStart,
        hours: currentWeekHours,
        output: currentWeekOutput,
        isFuture: isAfter(currentWeekStart, today)
    });

    // Calculate Average
    groupedWeeks.forEach(w => {
        if (!w.isFuture && !isAfter(w.date, today)) {
            totalPastHours += w.hours;
            pastWeeksCount++;
        }
    });

    const weeklyAverage = pastWeeksCount > 0 ? parseFloat((totalPastHours / pastWeeksCount).toFixed(1)) : 0;

    // Format for Chart
    return groupedWeeks.map(w => ({
        date: format(w.date, 'yyyy-MM-dd'),
        displayDate: format(w.date, 'MMM d'),
        timestamp: w.date.getTime(),
        hours: w.hours,
        output: w.output,
        average: weeklyAverage,
        isFuture: w.isFuture
    }));

  }, [data, viewMode]);

  // Process Build (Accumulated) Data
  const buildData = useMemo(() => {
    if (viewMode !== 'build') return [];

    let currentProjectHours = 0;
    
    return data.map(day => {
        // Accumulate
        currentProjectHours += day.hours;
        
        const point = {
            ...day,
            hours: parseFloat(currentProjectHours.toFixed(1))
        };
        
        // Reset after shipping
        if (day.output) {
            currentProjectHours = 0;
        }
        
        return point;
    });
  }, [data, viewMode]);

  const chartData = useMemo(() => {
    let sourceData = data;
    if (viewMode === 'weekly') sourceData = weeklyData;
    if (viewMode === 'build') sourceData = buildData;

    if (!isMobile) return sourceData;

    // Mobile View Slicing
    const today = startOfDay(new Date()).getTime();
    const todayIndex = sourceData.findIndex(d => d.timestamp >= today);
    
    if (todayIndex === -1) return sourceData;

    // Daily/Build: 30 days. Weekly: 12 weeks (~3 months)
    const lookback = viewMode === 'weekly' ? 11 : 29;
    
    const startIndex = Math.max(0, todayIndex - lookback);
    const endIndex = Math.min(sourceData.length, todayIndex + 1);
    
    return sourceData.slice(startIndex, endIndex);
  }, [data, weeklyData, buildData, isMobile, viewMode]);

  // Identify Output dates for reference lines
  const outputDates = useMemo(() => {
    return chartData.filter(d => d.output).map(d => d.date);
  }, [chartData]);

  const currentAverage = chartData[0]?.average || 0;

  return (
    <div className="w-full h-64 mb-8 select-none">
       <div className="flex justify-between items-end mb-2 px-2">
         <div className="flex items-center gap-4">
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
               {isMobile ? (viewMode === 'weekly' ? '12 Week Sprint' : '30 Day Sprint') : '2026 Trajectory'}
             </h3>
             
             {/* Toggle */}
             <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                <button 
                  onClick={() => setViewMode('daily')}
                  className={`${viewMode === 'daily' ? 'text-neutral-900 dark:text-white' : 'text-gray-400 dark:text-neutral-600 hover:text-neutral-500'} transition-colors`}
                >
                    [ DAILY ]
                </button>
                <button 
                  onClick={() => setViewMode('weekly')}
                  className={`${viewMode === 'weekly' ? 'text-neutral-900 dark:text-white' : 'text-gray-400 dark:text-neutral-600 hover:text-neutral-500'} transition-colors`}
                >
                    [ WEEKLY ]
                </button>
                <button 
                  onClick={() => setViewMode('build')}
                  className={`${viewMode === 'build' ? 'text-neutral-900 dark:text-white' : 'text-gray-400 dark:text-neutral-600 hover:text-neutral-500'} transition-colors`}
                >
                    [ BUILD ]
                </button>
             </div>
         </div>

         <div className="flex items-center gap-4">
            {viewMode !== 'build' && (
              <div className="flex items-center gap-1">
                  <div className="w-2 h-0.5 border-t border-dashed border-gray-400"></div>
                  <span className="text-[9px] font-bold uppercase text-gray-400 dark:text-neutral-600">Avg Pace</span>
              </div>
            )}
            <div className="flex items-center gap-1">
                <div 
                  className="w-2 h-2 rounded-full border" 
                  style={{ backgroundColor: `${themeHex}33`, borderColor: themeHex }}
                ></div>
                <span className="text-[9px] font-bold uppercase text-gray-400 dark:text-neutral-600" style={{ color: themeHex }}>Shipped</span>
            </div>
         </div>
       </div>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={themeHex} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={themeHex} stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => {
                const date = new Date(value);
                if (isMobile) {
                    if (viewMode === 'weekly') return format(date, 'MM/d');
                    return format(date, 'd');
                }
                return format(date, 'MMM');
            }}
            // Adjust interval based on view mode
            interval={isMobile ? (viewMode === 'weekly' ? 2 : 4) : (viewMode === 'weekly' ? 4 : 30)}
            tick={{ fill: '#737373', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#737373', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip 
            content={<CustomTooltip themeHex={themeHex} viewMode={viewMode} />} 
            cursor={{ stroke: '#525252', strokeWidth: 1, strokeDasharray: '3 3' }} 
          />
          
          <CartesianGrid vertical={false} stroke="#262626" strokeDasharray="3 3" opacity={0.3} />

          {/* Average Line - Only for Daily/Weekly */}
          {viewMode !== 'build' && (
            <ReferenceLine 
                y={currentAverage} 
                stroke="#737373" 
                strokeDasharray="3 3" 
                strokeWidth={1}
                isFront={false} 
            />
          )}

          {/* Output Markers (Themed) */}
          {outputDates.map((date) => (
             <ReferenceLine 
                key={date} 
                x={date} 
                stroke={themeHex} 
                strokeDasharray="3 3"
                strokeWidth={1}
             />
          ))}

          <Area 
            type="monotone" 
            dataKey="hours" 
            stroke={themeHex} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorHours)" 
            isAnimationActive={true}
            animationDuration={500}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
