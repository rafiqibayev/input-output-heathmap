export type ViewMode = 'goal' | 'intensity';
export type ThemeColor = 'red' | 'orange' | 'amber' | 'green' | 'blue' | 'violet' | 'pink';

export interface DailyEntry {
  hours: number;
  output: boolean;
}

export interface TrackerData {
  [dateString: string]: DailyEntry; // Key format: YYYY-MM-DD
}

export interface AppConfig {
  inputLabel: string;
  outputLabel: string;
  dailyGoal: number;
  viewMode: ViewMode;
  theme: ThemeColor;
}

export interface DayCellData {
  date: Date;
  dateString: string; // YYYY-MM-DD
  isTargetYear: boolean; // Is actually in 2026
  entry?: DailyEntry;
}

export type ThemeMode = 'light' | 'dark' | 'system';