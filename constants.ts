export const STORAGE_KEY_DATA = 'io-tracker-data';
export const STORAGE_KEY_CONFIG = 'io-tracker-config';
export const STORAGE_KEY_THEME_COLOR = 'io-tracker-theme';

export const TARGET_YEAR = 2026;
export const START_DATE = new Date(TARGET_YEAR, 0, 1); // Jan 1, 2026
export const END_DATE = new Date(TARGET_YEAR, 11, 31); // Dec 31, 2026

export const DEFAULT_INPUT_LABEL = "Deep Work";
export const DEFAULT_OUTPUT_LABEL = "Publish Project";
export const DEFAULT_DAILY_GOAL = 2;

export const THEMES: Record<string, { label: string; tailwind: string; hex: string }> = {
  cyan: { label: 'Cyan', tailwind: 'cyan-500', hex: '#06B6D4' },
  red: { label: 'Red', tailwind: 'red-600', hex: '#d40606' },
  blue: { label: 'Blue', tailwind: 'blue-500', hex: '#0682d4' },
  green: { label: 'Green', tailwind: 'green-600', hex: '#4ca104' }, // Adapted from #5fd406 for light mode readability
  purple: { label: 'Purple', tailwind: 'purple-600', hex: '#5d3ff4' },
  yellow: { label: 'Yellow', tailwind: 'yellow-600', hex: '#c79c04' }, // Adapted from #f4d03f for light mode readability
};
