import React from 'react';
import { AppConfig, ThemeMode, ViewMode, ThemeColor } from '../types';
import { Moon, Sun, Monitor, Target, Zap } from 'lucide-react';
import { THEMES } from '../constants';

interface HeaderProps {
  config: AppConfig;
  onUpdateConfig: (key: keyof AppConfig, value: string | number | ViewMode | ThemeColor) => void;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  onImportClick: () => void;
  onExportClick: () => void;
  currentYear: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  config, 
  onUpdateConfig, 
  themeMode, 
  onToggleTheme,
  onImportClick,
  onExportClick,
  currentYear
}) => {
  
  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light': return <Sun className="w-5 h-5 text-neutral-900" />;
      case 'dark': return <Moon className="w-5 h-5 text-white" />;
      case 'system': return <Monitor className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
    }
  };

  const activeTheme = THEMES[config.theme] || THEMES.red;

  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 py-8">
      <div className="flex justify-between items-start md:block w-full md:w-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tighter mb-1 dark:text-white uppercase select-none flex items-center">
             <span 
               onClick={onImportClick}
               className="cursor-pointer hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors"
               title="Import Data from JSON"
             >
               Input
             </span>
             <span className="mx-2 text-gray-300 dark:text-neutral-700">/</span>
             <span 
               onClick={onExportClick}
               className="cursor-pointer hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors"
               title="Export Data to Clipboard"
             >
               Output
             </span>
          </h1>
          <p className="text-xs text-gray-400 dark:text-neutral-500 uppercase tracking-widest font-bold">{currentYear} Visualization</p>
        </div>
        
        <button 
          onClick={onToggleTheme}
          className="md:hidden flex items-center gap-2 p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
        >
          {getThemeIcon()}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 w-full md:w-auto">
        
        <div className="flex bg-gray-100 dark:bg-neutral-900 p-1 rounded-sm w-full sm:w-auto shrink-0">
          <button 
            onClick={() => onUpdateConfig('viewMode', 'goal')}
            className={`flex-1 sm:flex-none px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2 ${config.viewMode === 'goal' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm' : 'text-gray-400 dark:text-neutral-600'}`}
          >
            <Target className="w-3 h-3" />
            Goal
          </button>
          <button 
            onClick={() => onUpdateConfig('viewMode', 'intensity')}
            className={`flex-1 sm:flex-none px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2 ${config.viewMode === 'intensity' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm' : 'text-gray-400 dark:text-neutral-600'}`}
          >
            <Zap className="w-3 h-3" />
            Intensity
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="relative group flex-1">
            <label className="absolute -top-2 left-2 px-1 bg-white dark:bg-neutral-950 text-[9px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider z-10">
              Input Label
            </label>
            <input
              type="text"
              value={config.inputLabel}
              onChange={(e) => onUpdateConfig('inputLabel', e.target.value)}
              className="w-full border-2 border-gray-100 dark:border-neutral-900 bg-transparent px-3 py-2 text-sm font-medium focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-200 dark:text-white transition-colors rounded-sm"
            />
          </div>

          <div className="relative group w-24 shrink-0">
            <label className="absolute -top-2 left-2 px-1 bg-white dark:bg-neutral-950 text-[9px] font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-wider z-10">
              Goal (h)
            </label>
            <input
              type="number"
              min="0.1"
              step="0.5"
              max="24"
              value={config.dailyGoal}
              onChange={(e) => onUpdateConfig('dailyGoal', parseFloat(e.target.value) || 0)}
              className="w-full border-2 border-gray-100 dark:border-neutral-900 bg-transparent px-3 py-2 text-sm font-bold text-center focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-200 dark:text-white transition-colors rounded-sm"
            />
          </div>

          <div className="relative group flex-1">
            <label 
              className="absolute -top-2 left-2 px-1 bg-white dark:bg-neutral-950 text-[9px] font-bold uppercase tracking-wider z-10 opacity-70"
              style={{ color: activeTheme.hex }}
            >
              Output Label
            </label>
            <input
              type="text"
              value={config.outputLabel}
              onChange={(e) => onUpdateConfig('outputLabel', e.target.value)}
              className="w-full border-2 border-gray-100 dark:border-neutral-900 bg-transparent px-3 py-2 text-sm font-bold focus:outline-none transition-colors rounded-sm"
              style={{ color: activeTheme.hex, borderColor: activeTheme.hex }}
            />
          </div>
        </div>

        <button 
          onClick={onToggleTheme}
          className="hidden md:flex mb-1 p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
        >
          {getThemeIcon()}
        </button>

      </div>
    </header>
  );
};