import { useState, useEffect, useCallback, useMemo } from 'react';
import { TrackerData, AppConfig, DailyEntry, ViewMode, ThemeColor } from '../types';
import { 
  STORAGE_KEY_DATA, 
  STORAGE_KEY_CONFIG, 
  STORAGE_KEY_THEME_COLOR,
  DEFAULT_INPUT_LABEL, 
  DEFAULT_OUTPUT_LABEL, 
  DEFAULT_DAILY_GOAL 
} from '../constants';

interface UseTrackerDataReturn {
  data: TrackerData;
  config: AppConfig;
  setHours: (dateString: string, hours: number) => void;
  toggleOutput: (dateString: string) => void;
  updateConfig: (key: keyof AppConfig, value: string | number | ViewMode | ThemeColor) => void;
  exportData: () => string;
  importData: (jsonString: string) => boolean;
  stats: {
    grindDays: number;
    outputsShipped: number;
    totalHours: number;
  };
}

export const useTrackerData = (): UseTrackerDataReturn => {
  const [config, setConfig] = useState<AppConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONFIG);
      const storedTheme = localStorage.getItem(STORAGE_KEY_THEME_COLOR) as ThemeColor;
      
      const defaults: AppConfig = { 
        inputLabel: DEFAULT_INPUT_LABEL, 
        outputLabel: DEFAULT_OUTPUT_LABEL, 
        dailyGoal: DEFAULT_DAILY_GOAL,
        viewMode: 'goal',
        theme: storedTheme || 'red'
      };
      return stored ? { ...defaults, ...JSON.parse(stored), theme: storedTheme || JSON.parse(stored).theme || 'red' } : defaults;
    } catch (e) {
      return { 
        inputLabel: DEFAULT_INPUT_LABEL, 
        outputLabel: DEFAULT_OUTPUT_LABEL, 
        dailyGoal: DEFAULT_DAILY_GOAL,
        viewMode: 'goal',
        theme: 'red'
      };
    }
  });

  const [data, setData] = useState<TrackerData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DATA);
      if (!stored) return {};
      const parsed = JSON.parse(stored);
      
      const migrated: TrackerData = {};
      Object.keys(parsed).forEach(key => {
        const entry = parsed[key];
        if (typeof entry.input === 'boolean') {
          migrated[key] = {
            hours: entry.input ? (config.dailyGoal || DEFAULT_DAILY_GOAL) : 0,
            output: entry.output || false
          };
        } else {
          migrated[key] = entry;
        }
      });
      return migrated;
    } catch (e) {
      console.error("Failed to parse data", e);
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    localStorage.setItem(STORAGE_KEY_THEME_COLOR, config.theme);
  }, [config]);

  const setHours = useCallback((dateString: string, hours: number) => {
    setData((prev) => {
      const current = prev[dateString] || { hours: 0, output: false };
      return {
        ...prev,
        [dateString]: { ...current, hours: Math.max(0, Math.min(24, hours)) }
      };
    });
  }, []);

  const toggleOutput = useCallback((dateString: string) => {
    setData((prev) => {
      const current = prev[dateString] || { hours: 0, output: false };
      return {
        ...prev,
        [dateString]: { ...current, output: !current.output }
      };
    });
  }, []);

  const updateConfig = useCallback((key: keyof AppConfig, value: string | number | ViewMode | ThemeColor) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const exportData = useCallback(() => {
    const exportObject = {
      version: 1,
      timestamp: new Date().toISOString(),
      config,
      data
    };
    return JSON.stringify(exportObject, null, 2);
  }, [config, data]);

  const importData = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      
      // Basic validation
      if (!parsed.data || !parsed.config) {
        return false;
      }

      // Check structure of config
      const requiredConfigKeys = ['inputLabel', 'outputLabel', 'dailyGoal'];
      const hasKeys = requiredConfigKeys.every(k => k in parsed.config);
      
      if (!hasKeys) return false;

      // Update state - this will trigger useEffects to save to localStorage
      setConfig(prev => ({ ...prev, ...parsed.config }));
      setData(parsed.data);
      return true;
    } catch (e) {
      console.error("Import failed", e);
      return false;
    }
  }, []);

  const stats = useMemo(() => {
    const entries = Object.values(data) as DailyEntry[];
    const grindDays = entries.filter((d: DailyEntry) => d.hours >= config.dailyGoal).length;
    const outputsShipped = entries.filter((d: DailyEntry) => d.output).length;
    const totalHours = entries.reduce((acc, d: DailyEntry) => acc + (d.hours || 0), 0);

    return { grindDays, outputsShipped, totalHours };
  }, [data, config.dailyGoal]);

  return {
    data,
    config,
    setHours,
    toggleOutput,
    updateConfig,
    exportData,
    importData,
    stats
  };
};