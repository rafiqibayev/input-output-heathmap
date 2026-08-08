export const STORAGE_KEY_DATA = 'io-tracker-data';
export const STORAGE_KEY_CONFIG = 'io-tracker-config';
export const STORAGE_KEY_THEME_COLOR = 'io-tracker-theme';

export const TARGET_YEAR = 2026;
export const START_DATE = new Date(TARGET_YEAR, 0, 1); // Jan 1, 2026
export const END_DATE = new Date(TARGET_YEAR, 11, 31); // Dec 31, 2026

export const DEFAULT_INPUT_LABEL = "Deep Work";
export const DEFAULT_OUTPUT_LABEL = "Publish Project";
export const DEFAULT_DAILY_GOAL = 2;

export const THEMES: Record<string, { label: string; tailwind: string; hex: string; logo: string }> = {
  cyan: { label: 'Cyan', tailwind: 'sky-400', hex: '#45C3FB', logo: '/logo-cyan.png' },
  blue: { label: 'Blue', tailwind: 'blue-500', hex: '#2961F0', logo: '/logo-blue.png' },
  purple: { label: 'Purple', tailwind: 'purple-500', hex: '#905EF5', logo: '/logo-purple.png' },
  green: { label: 'Green', tailwind: 'emerald-500', hex: '#2DAC5E', logo: '/logo-green.png' },
  red: { label: 'Red', tailwind: 'red-500', hex: '#E72224', logo: '/logo-red.png' },
  yellow: { label: 'Yellow', tailwind: 'amber-400', hex: '#FEBF00', logo: '/logo-yellow.png' },
};


