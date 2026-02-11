import React from 'react';
import { useTrackerData } from './hooks/useTrackerData';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { Stats } from './components/Stats';
import { Grid } from './components/Grid';
import { THEME_COLORS } from './constants';
import { ThemeColor } from './types';

const App: React.FC = () => {
  const { 
    data, 
    config, 
    setHours,
    toggleOutput, 
    updateConfig, 
    stats 
  } = useTrackerData();

  const { themeMode, cycleTheme } = useTheme();

  const cycleThemeColor = () => {
    const colors = Object.keys(THEME_COLORS) as ThemeColor[];
    const currentIndex = colors.indexOf(config.theme);
    const nextIndex = (currentIndex + 1) % colors.length;
    updateConfig('theme', colors[nextIndex]);
  };

  const currentTheme = THEME_COLORS[config.theme] || THEME_COLORS.red;

  return (
    <div className="min-h-screen w-full bg-white dark:bg-neutral-950 px-6 md:px-8 lg:px-12 pb-20 transition-colors duration-200">
      <div className="w-full mx-auto">
        <Header 
          config={config} 
          onUpdateConfig={updateConfig}
          themeMode={themeMode}
          onToggleTheme={cycleTheme}
        />
        
        <Stats 
          grindDays={stats.grindDays} 
          outputsShipped={stats.outputsShipped} 
          totalHours={stats.totalHours}
          theme={config.theme}
        />

        <main className="w-full mt-8">
            <div className="flex flex-wrap items-center gap-6 mb-6 text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-sm"></div>
                    <span className="text-gray-400 dark:text-neutral-500">Void</span>
                </div>
                
                {config.viewMode === 'goal' ? (
                  <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-neutral-900 dark:bg-neutral-100 rounded-sm"></div>
                      <span className="text-neutral-900 dark:text-neutral-100">Success (Goal Met)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 dark:text-neutral-600">Relative Intensity:</span>
                    <div className="flex gap-1 items-center">
                      <div className="w-3 h-3 bg-neutral-900 dark:bg-neutral-100 rounded-sm opacity-20"></div>
                      <div className="w-3 h-3 bg-neutral-900 dark:bg-neutral-100 rounded-sm opacity-50"></div>
                      <div className="w-3 h-3 bg-neutral-900 dark:bg-neutral-100 rounded-sm opacity-80"></div>
                      <div className="w-3 h-3 bg-neutral-900 dark:bg-neutral-100 rounded-sm opacity-100"></div>
                    </div>
                  </div>
                )}

                 <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${currentTheme.bg} rounded-sm transition-colors duration-500`}></div>
                    <span className={`${currentTheme.text} transition-colors duration-500`}>Shipped</span>
                </div>
            </div>

            <Grid 
              data={data} 
              config={config}
              maxHoursRecord={stats.maxHoursRecord}
              onSetHours={setHours}
              onToggleOutput={toggleOutput}
            />
        </main>

        <footer className="mt-20 pt-8 border-t border-gray-100 dark:border-neutral-800 text-center">
            <button 
              onClick={cycleThemeColor}
              className="text-gray-300 dark:text-neutral-700 hover:text-neutral-900 dark:hover:text-white text-xs font-mono font-bold tracking-widest transition-all duration-300 cursor-pointer"
            >
              DESIGNED FOR THE GRIND. DATA STORED LOCALLY.
            </button>
        </footer>
      </div>
    </div>
  );
};

export default App;