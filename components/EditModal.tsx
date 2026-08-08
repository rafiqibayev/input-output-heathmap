import React, { useEffect, useRef } from 'react';
import { X, Check, Minus, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ThemeColor } from '../types';
import { THEMES } from '../constants';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  dateString: string;
  inputLabel: string;
  outputLabel: string;
  hours: number;
  hasOutput: boolean;
  note?: string;
  theme: ThemeColor;
  onSetHours: (dateString: string, hours: number) => void;
  onToggleOutput: (dateString: string) => void;
  onSetNote: (dateString: string, note: string) => void;
  focusNoteOnOpen?: boolean;
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
  note = '',
  theme,
  onSetHours,
  onToggleOutput,
  onSetNote,
  focusNoteOnOpen
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const noteInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus logic
  useEffect(() => {
    if (!isOpen) return;

    if (focusNoteOnOpen && hasOutput && noteInputRef.current) {
      noteInputRef.current.focus();
    } else if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, focusNoteOnOpen, hasOutput]);

  // Focus note input when output is toggled on
  useEffect(() => {
    if (hasOutput && noteInputRef.current && document.activeElement !== noteInputRef.current) {
      noteInputRef.current.focus();
    }
  }, [hasOutput]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Enter: Save & Close (Always)
      if (e.key === 'Enter') {
        onClose();
        e.preventDefault();
        return;
      }

      // 2. Escape: Close (Always)
      if (e.key === 'Escape') {
        onClose();
        e.preventDefault();
        return;
      }

      const isInputFocused = document.activeElement === inputRef.current || document.activeElement === noteInputRef.current;

      // 3. Arrows: Adjust Hours
      if (e.key === 'ArrowUp') {
        if (!isInputFocused) {
          onSetHours(dateString, Math.max(0, Math.min(24, hours + 0.5)));
          e.preventDefault();
        }
      }

      if (e.key === 'ArrowDown') {
        if (!isInputFocused) {
          onSetHours(dateString, Math.max(0, Math.min(24, hours - 0.5)));
          e.preventDefault();
        }
      }

      // 4. Space: Toggle Output
      // Even if input is focused, since it's a number input, space doesn't type a space.
      // It's safe to toggle output for better UX.
      if (e.key === ' ') {
        // Prevent toggling output if typing in the note input
        if (document.activeElement === noteInputRef.current) return;

        onToggleOutput(dateString);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, dateString, hours, onSetHours, onToggleOutput]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const adjustHours = (delta: number) => {
    onSetHours(dateString, Math.max(0, Math.min(24, hours + delta)));
  };

  const activeTheme = THEMES[theme] || THEMES.cyan;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-neutral-950 border-2 border-neutral-900 dark:border-neutral-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] p-6 relative"
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
                tabIndex={-1}
              >
                <Minus className="w-4 h-4 dark:text-white" />
              </button>

              <div className="flex-1 text-center">
                <input
                  ref={inputRef}
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
                tabIndex={-1}
              >
                <Plus className="w-4 h-4 dark:text-white" />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-neutral-900">
            <label className="flex items-center gap-4 cursor-pointer group">
              <div
                className="w-6 h-6 border-2 flex items-center justify-center transition-colors"
                style={{
                  borderColor: activeTheme.hex,
                  backgroundColor: hasOutput ? activeTheme.hex : 'transparent'
                }}
              >
                {hasOutput && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={hasOutput}
                onChange={() => onToggleOutput(dateString)}
              />
              <span
                className="text-sm font-bold uppercase tracking-widest group-hover:underline"
                style={{ color: activeTheme.hex }}
              >
                {outputLabel}
              </span>
            </label>

            {hasOutput && (
              <input
                ref={noteInputRef}
                type="text"
                value={note}
                onChange={(e) => onSetNote(dateString, e.target.value)}
                placeholder="What did you ship? (Optional)"
                maxLength={60}
                className="bg-transparent border-b border-gray-700 focus:border-white outline-none text-sm text-white w-full py-1 mt-3 transition-colors"
              />
            )}
          </div>
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