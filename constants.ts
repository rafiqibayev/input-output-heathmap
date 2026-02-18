export const STORAGE_KEY_DATA = 'io-tracker-data';
export const STORAGE_KEY_CONFIG = 'io-tracker-config';
export const STORAGE_KEY_THEME_COLOR = 'io-tracker-theme';

export const TARGET_YEAR = 2026;
export const START_DATE = new Date(TARGET_YEAR, 0, 1); // Jan 1, 2026
export const END_DATE = new Date(TARGET_YEAR, 11, 31); // Dec 31, 2026

export const DEFAULT_INPUT_LABEL = "Deep Work";
export const DEFAULT_OUTPUT_LABEL = "Publish Project";
export const DEFAULT_DAILY_GOAL = 2;

export const THEME_COLORS = {
  red: { bg: 'bg-red-600', text: 'text-red-600', border: 'border-red-600', hover: 'hover:bg-red-500', textMuted: 'text-red-600/60', ring: 'ring-red-600' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500', hover: 'hover:bg-orange-400', textMuted: 'text-orange-500/60', ring: 'ring-orange-500' },
  amber: { bg: 'bg-amber-400', text: 'text-amber-400', border: 'border-amber-400', hover: 'hover:bg-amber-300', textMuted: 'text-amber-400/60', ring: 'ring-amber-400' },
  green: { bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500', hover: 'hover:bg-emerald-400', textMuted: 'text-emerald-500/60', ring: 'ring-emerald-500' },
  blue: { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500', hover: 'hover:bg-blue-400', textMuted: 'text-blue-500/60', ring: 'ring-blue-500' },
  violet: { bg: 'bg-violet-500', text: 'text-violet-500', border: 'border-violet-500', hover: 'hover:bg-violet-400', textMuted: 'text-violet-500/60', ring: 'ring-violet-500' },
  pink: { bg: 'bg-pink-500', text: 'text-pink-500', border: 'border-pink-500', hover: 'hover:bg-pink-400', textMuted: 'text-pink-500/60', ring: 'ring-pink-500' },
};

export const THEME_HEX = {
  red: '#dc2626',
  orange: '#ea580c',
  amber: '#d97706',
  green: '#16a34a',
  blue: '#2563eb',
  violet: '#7c3aed',
  pink: '#db2777',
};
