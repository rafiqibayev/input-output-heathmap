export const STORAGE_KEY_DATA = 'io-tracker-data';
export const STORAGE_KEY_CONFIG = 'io-tracker-config';
export const STORAGE_KEY_THEME_COLOR = 'io-tracker-theme';

export const TARGET_YEAR = 2026;
export const START_DATE = new Date(TARGET_YEAR, 0, 1); // Jan 1, 2026
export const END_DATE = new Date(TARGET_YEAR, 11, 31); // Dec 31, 2026

export const DEFAULT_INPUT_LABEL = "Deep Work";
export const DEFAULT_OUTPUT_LABEL = "Publish Project";
export const DEFAULT_DAILY_GOAL = 2;

export const THEMES = {
  red:    { label: 'Red',    tailwind: 'red-600',    hex: '#dc2626' },
  orange: { label: 'Orange', tailwind: 'orange-600', hex: '#ea580c' },
  amber:  { label: 'Amber',  tailwind: 'amber-600',  hex: '#d97706' },
  green:  { label: 'Green',  tailwind: 'emerald-600', hex: '#059669' },
  blue:   { label: 'Blue',   tailwind: 'blue-600',   hex: '#2563eb' },
  violet: { label: 'Violet', tailwind: 'violet-600', hex: '#7c3aed' },
  pink:   { label: 'Pink',   tailwind: 'pink-600',   hex: '#db2777' },
};
