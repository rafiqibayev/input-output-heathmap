import React from 'react';
import { Grid } from './Grid';
import { StatsChart } from './StatsChart';
import { TrackerData, AppConfig } from '../types';
import { ChartDataPoint } from '../utils/processChartData';
import { THEMES } from '../constants';

interface CaptureCardProps {
  data: TrackerData;
  config: AppConfig;
  currentYear: number;
  stats: { grindDays: number; outputsShipped: number; totalHours: number };
  chartData: ChartDataPoint[];
  viewType: 'grid' | 'chart';
  showStats: boolean;
  isDark: boolean;
}

export const CaptureCard = React.forwardRef<HTMLDivElement, CaptureCardProps>(
  ({ data, config, currentYear, stats, chartData, viewType, showStats, isDark }, ref) => {
    const themeHex = THEMES[config.theme]?.hex || THEMES.cyan.hex;

    return (
      <div
        ref={ref}
        className={`fixed top-0 left-0 flex flex-col justify-between p-24 ${isDark ? 'dark bg-neutral-950 text-white' : 'bg-white text-neutral-900'
          }`}
        style={{
          width: '1920px',
          height: '1080px',
          zIndex: -9999,
          pointerEvents: 'none',
          // Move it off-screen but keep it in the DOM
          transform: 'translate(-200%, -200%)',
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-start w-full">
          <div>
            <h1 className="text-6xl font-black tracking-tighter uppercase">
              Input <span className="text-gray-300 dark:text-neutral-700">/</span> Output
            </h1>
            <p className="text-3xl text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold mt-4">
              {currentYear} Trajectory
            </p>
          </div>

          {showStats && (
            <div className="flex gap-16">
              <div className="flex flex-col items-end">
                <span className="text-xl text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">
                  Goal Met
                </span>
                <span className="text-6xl font-black">{stats.grindDays}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xl text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">
                  Shipped
                </span>
                <span className="text-6xl font-black" style={{ color: themeHex }}>
                  {stats.outputsShipped}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center mt-16 mb-16">
          {viewType === 'grid' ? (
            <div className="origin-center scale-[1.5]">
              {/* Force horizontal grid layout by wrapping in a container that mimics xl screen */}
              <div className="min-w-max xl:block" style={{ display: 'block' }}>
                <Grid
                  data={data}
                  config={config}
                  currentYear={currentYear}
                  onCellClick={() => { }}
                  forceDesktop={true}
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-full pt-8">
              <StatsChart
                data={chartData}
                theme={config.theme}
                currentYear={currentYear}
                isAnimationActive={false}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="w-full text-center">
          <p className="text-gray-300 dark:text-neutral-700 text-xl font-mono font-bold tracking-widest uppercase">
            Designed for the grind. Build your own at input-output.app
          </p>
        </div>
      </div>
    );
  }
);

CaptureCard.displayName = 'CaptureCard';
