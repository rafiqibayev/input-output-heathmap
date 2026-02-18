import React, { useState, useEffect, useMemo } from 'react';
import { useTrackerData } from './hooks/useTrackerData';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { Stats } from './components/Stats';
import { Grid } from './components/Grid';
import { Toast } from './components/Toast';
import { ImportModal } from './components/ImportModal';
import { EditModal } from './components/EditModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { StatsChart } from './components/StatsChart';
import { THEME_COLORS } from './constants';
import { ThemeColor, DayCellData } from './types';
import { processChartData } from './utils/processChartData';

const App: React.FC = () => {
  const { 
    data, 
    config, 
    setHours,
    toggleOutput, 
    updateConfig,
    exportData,
    importData,
    stats 
  } = useTrackerData();

  const { themeMode, cycleTheme } = useTheme();
  
  // Modals state
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayCellData | null>(null);
  const [toast, setToast] = useState<{show: boolean, message: string}>({show: false, message: ''});
  
  const cycleThemeColor = () => {
    const colors = Object.keys(THEME_COLORS) as ThemeColor[];
    const currentIndex = colors.indexOf(config.theme);
    const nextIndex = (currentIndex + 1) % colors.length;
    updateConfig('theme', colors[nextIndex]);
  };

  const handleExport = () => {
    const json = exportData();
    navigator.clipboard.writeText(json).then(() => {
        setToast({ show: true, message: 'Data copied to clipboard' });
    }).catch(() => {
        setToast({ show: true, message: 'Failed to copy data' });
    });
  };

  const handleImport = (jsonString: string) => {
    const success = importData(jsonString);
    if (success) {
        setToast({ show: true, message: 'Data imported successfully' });
    }
    return success;
  };

  const handleCellClick = (cellData: DayCellData) => {
    setSelectedDay(cellData);
  };

  // Process data for chart
  const chartData = useMemo(() => processChartData(data), [data]);

  // Global Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Escape Logic (Always active)
      if (e.key === 'Escape') {
         if (selectedDay) setSelectedDay(null);
         if (isImportOpen) setIsImportOpen(false);
         if (isShortcutsOpen) setIsShortcutsOpen(false);
         return;
      }

      // 2. Disable global shortcuts if typing in an input
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA'].includes(target.tagName)) {
        return;
      }

      // 3. Disable global actions if any modal is open
      const isModalOpen = selectedDay || isImportOpen || isShortcutsOpen;
      
      if (isModalOpen) return;

      switch (e.key) {
        case '?':
          setIsShortcutsOpen(true);
          break;
        case 't':
        case 'T':
          cycleThemeColor();
          break;
        case 'I': 
        case 'i':
          if (e.shiftKey) {
             setIsImportOpen(true);
             e.preventDefault();
          }
          break;
        case 'E':
        case 'e':
           if (e.shiftKey) {
             handleExport();
             e.preventDefault();
           }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedDay, 
    isImportOpen, 
    isShortcutsOpen, 
    data, 
    cycleThemeColor, 
    handleExport,
    config.theme
  ]);

  const currentTheme = THEME_COLORS[config.theme] || THEME_COLORS.red;

  return (
    <div className="min-h-screen w-full bg-white dark:bg-neutral-950 px-6 md:px-8 lg:px-12 pb-20 transition-colors duration-200">
      <div className="w-full mx-auto">
        <Header 
          config={config} 
          onUpdateConfig={updateConfig}
          themeMode={themeMode}
          onToggleTheme={cycleTheme}
          onImportClick={() => setIsImportOpen(true)}
          onExportClick={handleExport}
        />
        
        <Stats 
          grindDays={stats.grindDays} 
          outputsShipped={stats.outputsShipped} 
          totalHours={stats.totalHours}
          theme={config.theme}
        />

        <main className="w-full mt-8">
            {/* Legend - Attached to Grid */}
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
                      <div className="w-3 h-3 bg-neutral-900 dark:bg-neutral-100 rounded-sm opacity-40"></div>
                      <div className="w-3 h-3 bg-neutral-900 dark:bg-neutral-100 rounded-sm opacity-60"></div>
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

            {/* Main Grid */}
            <Grid 
              data={data} 
              config={config}
              onCellClick={handleCellClick}
            />

            {/* Secondary Analysis Chart */}
            <div className="mt-12 md:mt-16 border-t border-gray-100 dark:border-neutral-800 pt-12">
               <StatsChart data={chartData} theme={config.theme} />
            </div>
        </main>

        <footer className="mt-20 pt-8 border-t border-gray-100 dark:border-neutral-800 text-center flex items-center justify-center gap-4">
            <button 
              onClick={cycleThemeColor}
              className="text-gray-300 dark:text-neutral-700 hover:text-neutral-900 dark:hover:text-white text-xs font-mono font-bold tracking-widest transition-all duration-300 cursor-pointer"
            >
              DESIGNED FOR THE GRIND. DATA STORED LOCALLY.
            </button>
            <button 
              onClick={() => setIsShortcutsOpen(true)}
              className="text-gray-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white text-xs font-mono font-bold tracking-widest transition-all duration-300 cursor-pointer"
              title="Keyboard Shortcuts"
            >
              [ ? ]
            </button>
        </footer>
      </div>

      <ImportModal 
        isOpen={isImportOpen} 
        onClose={() => setIsImportOpen(false)} 
        onImport={handleImport} 
      />
      
      {selectedDay && (
        <EditModal
          isOpen={!!selectedDay}
          onClose={() => setSelectedDay(null)}
          date={selectedDay.date}
          dateString={selectedDay.dateString}
          inputLabel={config.inputLabel}
          outputLabel={config.outputLabel}
          hours={data[selectedDay.dateString]?.hours || 0}
          hasOutput={!!data[selectedDay.dateString]?.output}
          theme={config.theme}
          onSetHours={setHours}
          onToggleOutput={toggleOutput}
        />
      )}

      <ShortcutsModal 
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <Toast 
        message={toast.message} 
        isVisible={toast.show} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  );
};

export default App;