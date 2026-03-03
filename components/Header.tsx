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

  const activeTheme = THEMES[config.theme] || THEMES.cyan;

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8">
      <div className="flex justify-between items-center md:block w-full md:w-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tighter dark:text-white uppercase select-none flex items-center gap-2">
            <img
              src="/favicon-dark.png"
              alt="Outpace Logo"
              className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={onImportClick}
              title="Import Data from JSON"
            />
            <span
              onClick={onExportClick}
              className="cursor-pointer hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors"
              title="Export Data to Clipboard"
            >
              OUTPACE
            </span>
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onToggleTheme}
            className="md:hidden flex items-center gap-2 p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {getThemeIcon()}
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">

        <div className="relative grid grid-cols-2 bg-gray-100 dark:bg-neutral-900 p-1 rounded-sm w-full sm:w-auto shrink-0">
          {/* Animated Slider Background */}
          <div
            className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-sm transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-sm"
            style={{
              transform: config.viewMode === 'goal' ? 'translateX(0)' : 'translateX(100%)',
              backgroundColor: `${activeTheme.hex}15`,
              boxShadow: `inset 0 0 0 1px ${activeTheme.hex}40`
            }}
          />

          <button
            onClick={() => onUpdateConfig('viewMode', 'goal')}
            className={`relative z-10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors duration-300 flex items-center justify-center gap-2 ${config.viewMode === 'goal' ? '' : 'text-gray-400 dark:text-neutral-600 hover:text-gray-600 dark:hover:text-neutral-400'}`}
            style={{ color: config.viewMode === 'goal' ? activeTheme.hex : undefined }}
          >
            <Target className="w-3 h-3" />
            Goal
          </button>
          <button
            onClick={() => onUpdateConfig('viewMode', 'intensity')}
            className={`relative z-10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors duration-300 flex items-center justify-center gap-2 ${config.viewMode === 'intensity' ? '' : 'text-gray-400 dark:text-neutral-600 hover:text-gray-600 dark:hover:text-neutral-400'}`}
            style={{ color: config.viewMode === 'intensity' ? activeTheme.hex : undefined }}
          >
            <Zap className="w-3 h-3" />
            Intensity
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div
            className="relative group transition-all duration-300"
            style={{ width: `max(100px, ${(config.inputLabel?.length || 0) + 3}ch)`, maxWidth: '100%' }}
          >
            <label className="absolute -top-2 left-1/2 -translate-x-1/2 px-1 bg-white dark:bg-neutral-950 text-[9px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider z-10">
              Input
            </label>
            <input
              type="text"
              maxLength={30}
              value={config.inputLabel}
              onChange={(e) => onUpdateConfig('inputLabel', e.target.value)}
              className="w-full border-2 border-gray-100 dark:border-neutral-900 bg-transparent px-3 py-2 text-sm font-medium text-center focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-200 dark:text-white transition-colors rounded-sm"
            />
          </div>

          <div
            className="relative group shrink-0 transition-all duration-300"
            style={{ width: `max(80px, ${(config.dailyGoal?.toString().length || 0) + 4}ch)`, maxWidth: '100%' }}
          >
            <label className="absolute -top-2 left-1/2 -translate-x-1/2 px-1 bg-white dark:bg-neutral-950 text-[9px] font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-wider z-10">
              Hours
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

          <div
            className="relative group transition-all duration-300"
            style={{ width: `max(100px, ${(config.outputLabel?.length || 0) + 3}ch)`, maxWidth: '100%' }}
          >
            <label
              className="absolute -top-2 left-1/2 -translate-x-1/2 px-1 bg-white dark:bg-neutral-950 text-[9px] font-bold uppercase tracking-wider z-10 opacity-70 whitespace-nowrap"
              style={{ color: activeTheme.hex }}
            >
              Output
            </label>
            <input
              type="text"
              maxLength={30}
              value={config.outputLabel}
              onChange={(e) => onUpdateConfig('outputLabel', e.target.value)}
              className="w-full border-2 border-gray-100 dark:border-neutral-900 bg-transparent px-3 py-2 text-sm font-bold text-center focus:outline-none transition-colors rounded-sm"
              style={{ color: activeTheme.hex, borderColor: activeTheme.hex }}
            />
          </div>


        </div>

        <button
          onClick={onToggleTheme}
          className="hidden md:flex p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
        >
          {getThemeIcon()}
        </button>

      </div>
    </header>
  );
};