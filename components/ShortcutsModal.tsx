import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const globalShortcuts = [
    { key: 'T', action: 'Change Theme' },
    { key: 'Shift + I', action: 'Import Data' },
    { key: 'Shift + E', action: 'Export Data' },
    { key: '?', action: 'Show Shortcuts' },
    { key: 'Esc', action: 'Close Windows' },
  ];

  const entryShortcuts = [
    { key: 'Space', action: 'Toggle Output' },
    { key: 'Enter', action: 'Save Entry' },
  ];

  const Kbd = ({ children }: { children: React.ReactNode }) => (
    <kbd className="px-2 py-1 bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-md text-xs font-mono font-bold text-neutral-600 dark:text-neutral-300 shadow-sm min-w-[24px] text-center inline-block">
      {children}
    </kbd>
  );

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md bg-white dark:bg-neutral-950 border-2 border-neutral-900 dark:border-neutral-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-gray-100 dark:hover:bg-neutral-800 p-1 rounded-sm transition-colors text-neutral-900 dark:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold mb-6 tracking-tight dark:text-white uppercase flex items-center gap-2">
          <Keyboard className="w-5 h-5" /> Keyboard Shortcuts
        </h3>

        <div className="grid grid-cols-1 gap-8">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500 mb-4 border-b border-gray-100 dark:border-neutral-800 pb-2">
              Global Controls
            </h4>
            <div className="space-y-3">
              {globalShortcuts.map((s) => (
                <div key={s.action} className="flex justify-between items-center text-sm">
                  <span className="text-neutral-900 dark:text-white font-medium tracking-tight">{s.action}</span>
                  <Kbd>{s.key}</Kbd>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500 mb-4 border-b border-gray-100 dark:border-neutral-800 pb-2">
              Inside Entry Modal
            </h4>
            <div className="space-y-3">
              {entryShortcuts.map((s) => (
                <div key={s.action} className="flex justify-between items-center text-sm">
                  <span className="text-neutral-900 dark:text-white font-medium tracking-tight">{s.action}</span>
                  <Kbd>{s.key}</Kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};