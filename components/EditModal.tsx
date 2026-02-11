import React from 'react';
import { X, Check, Minus, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ThemeColor } from '../types';
import { THEME_COLORS } from '../constants';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  dateString: string;
  inputLabel: string;
  outputLabel: string;
  hours: number;
  hasOutput: boolean;
  theme: ThemeColor;
  onSetHours: (dateString: string, hours: number) => void;
  onToggleOutput: (dateString: string) => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  date,
  dateString,
  inputLabel,
  outputLabel,
  hours,
  hasOutput,
  theme,
  onSetHours,
  onToggleOutput
}) => {
  if (!isOpen) return null;

  const adjustHours = (delta: number) => {
    onSetHours(dateString, Math.max(0, Math.min(24, hours + delta)));
  };

  const currentTheme = THEME_COLORS[theme] || THEME_COLORS.red;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm">
      <div 
        className="w-full max-w-sm bg-white dark:bg-neutral-950 border-2 border-neutral-900 dark:border-neutral-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-gray-100 dark:hover:bg-neutral-800 p-1 rounded-sm transition-colors text-neutral-900 dark:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold mb-6 tracking-tight dark:text-white">
          {format(date, 'MMMM d, yyyy')}
        </h3>

        <div className="space-y-8">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500 mb-3">
              {inputLabel} (Hours)
            </label>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => adjustHours(-0.5)}
                className="p-2 border-2 border-neutral-900 dark:border-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <Minus className="w-4 h-4 dark:text-white" />
              </button>
              
              <div className="flex-1 text-center">
                <input 
                  type="number" 
                  value={hours}
                  onChange={(e) => onSetHours(dateString, parseFloat(e.target.value) || 0)}
                  className="w-full text-3xl font-bold bg-transparent text-center focus:outline-none dark:text-white"
                  min="0"
                  max="24"
                  step="0.5"
                />
              </div>

              <button 
                onClick={() => adjustHours(0.5)}
                className="p-2 border-2 border-neutral-900 dark:border-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <Plus className="w-4 h-4 dark:text-white" />
              </button>
            </div>
          </div>

          <label className="flex items-center gap-4 cursor-pointer group pt-4 border-t border-gray-100 dark:border-neutral-900">
             <div 
              className={`w-6 h-6 border-2 ${currentTheme.border} flex items-center justify-center transition-colors ${hasOutput ? currentTheme.bg : 'bg-transparent'}`}
            >
              {hasOutput && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
            </div>
            <input 
              type="checkbox" 
              className="hidden"
              checked={hasOutput}
              onChange={() => onToggleOutput(dateString)}
            />
             <span className={`text-sm font-bold uppercase tracking-widest ${currentTheme.text} group-hover:underline`}>
              {outputLabel}
            </span>
          </label>
        </div>

        <div className="mt-10 flex justify-end">
           <button 
             onClick={onClose}
             className="px-6 py-2 bg-neutral-900 dark:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-300 transition-colors"
           >
             Save Entry
           </button>
        </div>
      </div>
    </div>
  );
};