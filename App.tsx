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
import { THEMES } from './constants';
import { ThemeColor, DayCellData } from './types';
import { CaptureCard } from './components/CaptureCard';
import { processChartData } from './utils/processChartData';
import { ChevronLeft, ChevronRight, Camera, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';

const App: React.FC = () => {
  const [currentYear, setCurrentYear] = useState(2026);

  const {
    data,
    config,
    setHours,
    toggleOutput,
    setNote,
    updateConfig,
    exportData,
    importData,
    stats
  } = useTrackerData(currentYear);

  const { themeMode, cycleTheme } = useTheme();

  // Modals state
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedDay, setSelectedDay] = useState<{ data: DayCellData, focusNote: boolean } | null>(null);
  const [toast, setToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' });

  const cycleThemeColor = () => {
    const colors = Object.keys(THEMES) as ThemeColor[];
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

  const captureCardRef = React.useRef<HTMLDivElement>(null);

  const handleExportImage = () => {
    if (isExporting) return;
    setIsExporting(true);

    // Small delay to ensure the loading state renders
    setTimeout(async () => {
      const node = captureCardRef.current;
      if (!node) {
        setIsExporting(false);
        return;
      }

      try {
        const isDark = document.documentElement.classList.contains('dark');
        const exportOptions = {
          cacheBust: true,
          pixelRatio: 2,
          style: { transform: 'none' },
          filter: (domNode: HTMLElement) => {
            if (domNode.tagName === 'LINK' && (domNode as HTMLLinkElement).href.includes('fonts.googleapis')) {
              return false;
            }
            return true;
          },
          backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
        };

        // PASS 1: The "Warm-up" render (Forces browser to paint SVGs and Fonts)
        await toPng(node, exportOptions);

        // PASS 2: The actual capture
        const dataUrl = await toPng(node, exportOptions);

        const link = document.createElement('a');
        link.download = `IO-Tracker-${currentYear}.png`;
        link.href = dataUrl;
        link.click();
        setToast({ show: true, message: 'Image downloaded!' });
      } catch (err) {
        console.error('Failed to export image', err);
        setToast({ show: true, message: 'Failed to export image' });
      } finally {
        setIsExporting(false);
      }
    }, 100);
  };

  const handleCellClick = (cellData: DayCellData, e: React.MouseEvent) => {
    const isPowerUserClick = e.metaKey || e.ctrlKey;
    const hasOutput = data[cellData.dateString]?.output || false;

    setSelectedDay({
      data: cellData,
      focusNote: isPowerUserClick && hasOutput
    });
  };

  const handlePreviousYear = () => setCurrentYear(prev => prev - 1);
  const handleNextYear = () => setCurrentYear(prev => prev + 1);

  // Process data for chart
  const chartData = useMemo(() => processChartData(data, currentYear), [data, currentYear]);

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
        case 'S':
        case 's':
          if (e.shiftKey) {
            handleExportImage();
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
    handleExportImage,
    config.theme
  ]);

  const currentTheme = THEMES[config.theme] || THEMES.cyan;

  return (
    <div className="min-h-screen w-full bg-white dark:bg-neutral-950 px-4 sm:px-6 lg:px-8 pb-20 transition-colors duration-200">
      <div className="w-full mx-auto">
        <Header
          config={config}
          onUpdateConfig={updateConfig}
          themeMode={themeMode}
          onToggleTheme={cycleTheme}
          onImportClick={() => setIsImportOpen(true)}
          onExportClick={handleExport}
          currentYear={currentYear}
        />

        <Stats
          grindDays={stats.grindDays}
          outputsShipped={stats.outputsShipped}
          totalHours={stats.totalHours}
          theme={config.theme}
        />

        <main className="w-full mt-8">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
            {/* Legend - Attached to Grid */}
            <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
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
                <div className="w-3 h-3 rounded-sm transition-colors duration-500" style={{ backgroundColor: currentTheme.hex }}></div>
                <span className="transition-colors duration-500" style={{ color: currentTheme.hex }}>Shipped</span>
              </div>
            </div>

            {/* Year Switcher */}
            <div className="flex items-center gap-4 text-sm font-mono text-gray-400">
              <button
                onClick={handleExportImage}
                disabled={isExporting}
                className="hover:text-neutral-900 dark:hover:text-white transition-colors mr-2 disabled:opacity-50"
                title="Export to PNG (Shift + S)"
              >
                {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
              </button>
              <button
                onClick={handlePreviousYear}
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-neutral-900 dark:text-white font-bold text-base select-none">
                {currentYear}
              </span>
              <button
                onClick={handleNextYear}
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Grid */}
          <Grid
            data={data}
            config={config}
            currentYear={currentYear}
            onCellClick={handleCellClick}
          />

          {/* Secondary Analysis Chart */}
          <div className="mt-12 md:mt-16 border-t border-gray-100 dark:border-neutral-800 pt-12">
            <StatsChart data={chartData} theme={config.theme} currentYear={currentYear} />
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
          date={selectedDay.data.date}
          dateString={selectedDay.data.dateString}
          inputLabel={config.inputLabel}
          outputLabel={config.outputLabel}
          hours={data[selectedDay.data.dateString]?.hours || 0}
          hasOutput={!!data[selectedDay.data.dateString]?.output}
          note={data[selectedDay.data.dateString]?.note || ''}
          theme={config.theme}
          onSetHours={setHours}
          onToggleOutput={toggleOutput}
          onSetNote={setNote}
          focusNoteOnOpen={selectedDay.focusNote}
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

      <CaptureCard
        ref={captureCardRef}
        data={data}
        config={config}
        currentYear={currentYear}
        stats={stats}
        chartData={chartData}
        viewType="grid"
        showStats={true}
        isDark={document.documentElement.classList.contains('dark')}
      />
    </div>
  );
};

export default App;