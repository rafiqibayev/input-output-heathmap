import React from 'react';
import { format } from 'date-fns';
import { DayCellData, ThemeColor } from '../types';
import { THEME_HEX } from '../constants';

interface GridTooltipProps {
  data: DayCellData;
  position: { x: number; y: number } | null;
  theme: ThemeColor;
}

export const GridTooltip: React.FC<GridTooltipProps> = ({ data, position, theme }) => {
  if (!position) return null;

  const { entry, date } = data;
  const hours = entry?.hours || 0;
  const hasOutput = entry?.output || false;
  const themeHex = THEME_HEX[theme] || THEME_HEX.red;

  let statusText = "VOID";
  let statusColor = "text-gray-500";

  if (hasOutput) {
    statusText = "⚡ SHIPMENT DEPLOYED";
  } else if (hours > 4) {
    statusText = "🔥 HIGH INTENSITY";
    statusColor = "text-orange-500";
  } else if (hours > 0) {
    statusText = "🔨 BUILDING...";
    statusColor = "text-blue-400";
  }

  return (
    <div 
      className="fixed z-50 pointer-events-none flex flex-col items-center transition-opacity duration-150 ease-out animate-in fade-in zoom-in-95"
      style={{
        left: position.x,
        top: position.y - 8,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div className="bg-neutral-900 border border-neutral-700 shadow-[0_8px_30px_rgb(0,0,0,0.5)] p-3 rounded-sm min-w-[150px] text-left relative">
        <div className="text-[10px] text-gray-400 font-mono mb-2 uppercase tracking-wider border-b border-neutral-800 pb-1 flex justify-between">
          <span>{format(date, 'MMM d, yyyy')}</span>
        </div>
        
        <div 
            className={`text-xs font-bold font-mono mb-1 ${!hasOutput ? statusColor : ''}`}
            style={hasOutput ? { color: themeHex } : {}}
        >
          {statusText}
        </div>

        <div className="text-[10px] text-gray-300 font-mono">
          <span className="font-bold text-white text-sm mr-1">{hours}</span>
          <span className="uppercase tracking-tight opacity-70">Hours Recorded</span>
        </div>
      </div>
      
      {/* Triangle Pointer */}
      <div className="w-2 h-2 bg-neutral-900 border-r border-b border-neutral-700 transform rotate-45 -mt-1"></div>
    </div>
  );
};
