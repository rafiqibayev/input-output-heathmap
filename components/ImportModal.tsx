import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (jsonString: string) => boolean;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImport = () => {
    setError(null);
    if (!input.trim()) {
      setError("Please paste your data first.");
      return;
    }

    const success = onImport(input);
    if (success) {
      setInput('');
      onClose();
    } else {
      setError("Invalid JSON format or missing data.");
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className="w-full max-w-lg bg-white dark:bg-neutral-950 border-2 border-neutral-900 dark:border-neutral-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] p-6 relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-gray-100 dark:hover:bg-neutral-800 p-1 rounded-sm transition-colors text-neutral-900 dark:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold mb-2 tracking-tight dark:text-white uppercase">
          Import Data
        </h3>
        
        <div className="flex items-center gap-2 mb-6 text-red-600 dark:text-red-400">
           <AlertTriangle className="w-4 h-4" />
           <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider">
             Warning: This will overwrite your current progress.
           </p>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Paste your JSON data here...'
          className="w-full h-48 bg-gray-50 dark:bg-black border-2 border-gray-200 dark:border-neutral-800 p-4 text-xs font-mono text-neutral-900 dark:text-neutral-300 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 resize-none rounded-sm mb-4 placeholder:text-gray-400 dark:placeholder:text-neutral-700"
        />

        {error && (
           <p className="text-red-600 dark:text-red-400 text-xs font-bold mb-4 uppercase tracking-widest animate-pulse">
             {error}
           </p>
        )}

        <div className="flex justify-end gap-3">
           <button 
             onClick={onClose}
             className="px-6 py-2 border-2 border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
           >
             Cancel
           </button>
           <button 
             onClick={handleImport}
             className="px-6 py-2 bg-neutral-900 dark:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-300 transition-colors"
           >
             Load Data
           </button>
        </div>
      </div>
    </div>
  );
};