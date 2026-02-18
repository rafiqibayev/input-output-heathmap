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
import { startOfDay, differenceInDays, format } from 'date-fns';

interface StatsChartProps {
  data: ChartDataPoint[];
  theme: ThemeColor;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-neutral-900 border border-neutral-700 p-3 rounded-sm shadow-xl">
        <p className="text-white text-xs font-bold font-mono mb-1">{data.displayDate}</p>
        <p className="text-gray-300 text-xs font-mono">
          Effort: <span className="text-white font-bold">{data.hours}h</span>
        </p>
        {data.output && (
          <p className="text-red-500 text-xs font-bold font-mono mt-1 uppercase tracking-wider">
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
  const themeHex = THEME_HEX[theme] || THEME_HEX.red;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const chartData = useMemo(() => {
    if (!isMobile) return data;

    // Mobile View: Last 30 Days
    // Find index of today
    const today = startOfDay(new Date()).getTime();
    const todayIndex = data.findIndex(d => d.timestamp >= today);
    
    if (todayIndex === -1) return data; // Fallback

    const startIndex = Math.max(0, todayIndex - 29);
    const endIndex = Math.min(data.length, todayIndex + 1);
    
    return data.slice(startIndex, endIndex);
  }, [data, isMobile]);

  // Identify Output dates for reference lines
  const outputDates = useMemo(() => {
    return chartData.filter(d => d.output).map(d => d.date);
  }, [chartData]);

  return (
    <div className="w-full h-64 mb-8 select-none">
       <div className="flex justify-between items-end mb-2 px-2">
         <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
           {isMobile ? '30 Day Sprint' : '2026 Trajectory'}
         </h3>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
                <div className="w-2 h-0.5 bg-gray-400 dashed"></div>
                <span className="text-[9px] font-bold uppercase text-gray-400 dark:text-neutral-600">Avg Pace</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500"></div>
                <span className="text-[9px] font-bold uppercase text-gray-400 dark:text-neutral-600">Shipped</span>
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
                // On mobile show day only (1, 5, 10...), Desktop show Month
                if (isMobile) return format(date, 'd');
                return format(date, 'MMM');
            }}
            interval={isMobile ? 4 : 30}
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
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#525252', strokeWidth: 1, strokeDasharray: '3 3' }} />
          
          <CartesianGrid vertical={false} stroke="#262626" strokeDasharray="3 3" opacity={0.3} />

          {/* Average Line */}
          <ReferenceLine 
            y={data[0]?.average || 0} 
            stroke="#737373" 
            strokeDasharray="3 3" 
            strokeWidth={1}
            isFront={false} 
          />

          {/* Output Markers */}
          {outputDates.map((date) => (
             <ReferenceLine 
                key={date} 
                x={date} 
                stroke="#ef4444" 
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
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};