import React, { useRef, useLayoutEffect, useState } from 'react';
import { format } from 'date-fns';
import { DayCellData, ThemeColor } from '../types';
import { THEMES } from '../constants';

interface GridTooltipProps {
  data: DayCellData;
  position: { x: number; y: number } | null;
  theme: ThemeColor;
}

export const GridTooltip: React.FC<GridTooltipProps> = ({ data, position, theme }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ x: 0, pointerOffset: 0, sourceX: 0 });

  useLayoutEffect(() => {
    if (position && tooltipRef.current) {
      const width = tooltipRef.current.offsetWidth;
      const halfWidth = width / 2;
      const PADDING = 16;

      let xPos = position.x;
      let offset = 0;

      const minX = halfWidth + PADDING;
      const maxX = window.innerWidth - halfWidth - PADDING;

      if (xPos < minX) {
        offset = position.x - minX;
        xPos = minX;
      } else if (xPos > maxX) {
        offset = position.x - maxX;
        xPos = maxX;
      }

      setLayout({ x: xPos, pointerOffset: offset, sourceX: position.x });
    }
  }, [position, data]);

  if (!position) return null;

  const { entry, date } = data;
  const hours = entry?.hours || 0;
  const hasOutput = entry?.output || false;
  const themeHex = THEMES[theme]?.hex || THEMES.cyan.hex;

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

  const displayX = layout.sourceX === position.x ? layout.x : position.x;
  const displayOffset = layout.sourceX === position.x ? layout.pointerOffset : 0;

  return (
    <div
      ref={tooltipRef}
      className="fixed z-50 pointer-events-none flex flex-col items-center transition-opacity duration-150 ease-out animate-in fade-in zoom-in-95"
      style={{
        left: displayX,
        top: position.y - 8,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div className="bg-neutral-900 border border-neutral-700 shadow-[0_8px_30px_rgb(0,0,0,0.5)] p-3 rounded-sm min-w-[150px] max-w-[300px] text-left relative">
        <div className="text-[10px] text-gray-400 font-mono mb-2 uppercase tracking-wider border-b border-neutral-800 pb-1 flex justify-between">
          <span>{format(date, 'MMM d, yyyy')}</span>
        </div>

        <div
          className={`text-xs font-bold font-mono mb-1 ${!hasOutput ? statusColor : ''}`}
          style={hasOutput ? { color: themeHex } : {}}
        >
          {statusText}
        </div>

        {hasOutput && entry?.note && (
          <div
            className="text-gray-300 italic mb-1 border-l-2 pl-2 text-xs break-words"
            style={{ borderColor: themeHex }}
          >
            "{entry.note}"
          </div>
        )}

        <div className="text-[10px] text-gray-300 font-mono">
          <span className="font-bold text-white text-sm mr-1">{hours}</span>
          <span className="uppercase tracking-tight opacity-70">Hours Recorded</span>
        </div>
      </div>

      {/* Triangle Pointer */}
      <div
        className="w-2 h-2 bg-neutral-900 border-r border-b border-neutral-700 transform rotate-45 -mt-1"
        style={{ transform: `translateX(${displayOffset}px) rotate(45deg)` }}
      ></div>
    </div>
  );
};