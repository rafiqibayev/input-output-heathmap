import React, { useState } from 'react';
import { TrackerData, ThemeColor } from '../types';
import { THEMES } from '../constants';
import { eachDayOfInterval, startOfDay, format, subDays } from 'date-fns';
import { GoogleGenAI } from '@google/genai';

interface AIDiagnosticProps {
  data: TrackerData;
  dailyGoal: number;
  theme: ThemeColor;
}

export const AIDiagnostic: React.FC<AIDiagnosticProps> = ({ data, dailyGoal, theme }) => {
  const [loading, setLoading] = useState(false);
  const [diagnostic, setDiagnostic] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeTheme = THEMES[theme] || THEMES.cyan;

  const runDiagnostic = async () => {
    setLoading(true);
    setError(null);
    setDiagnostic(null);

    try {
      // 1. Prepare Data
      const today = startOfDay(new Date());
      const allDates = Object.keys(data).sort();

      let totalHours = 0;
      let totalOutputs = 0;
      let currentStreak = 0;
      let maxStreak = 0;

      allDates.forEach(dateStr => {
        const entry = data[dateStr];
        const hours = entry.hours || 0;
        const output = entry.output || false;

        totalHours += hours;
        if (output) totalOutputs += 1;

        if (hours >= dailyGoal) {
          currentStreak += 1;
          if (currentStreak > maxStreak) maxStreak = currentStreak;
        } else {
          currentStreak = 0;
        }
      });

      const thirtyDaysAgo = subDays(today, 29);
      const recentDays = eachDayOfInterval({ start: thirtyDaysAgo, end: today });

      let recentActivityStr = '';
      recentDays.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const displayDate = format(day, 'MMM d');
        const entry = data[dateStr];
        const hours = entry?.hours || 0;
        const output = entry?.output || false;

        recentActivityStr += `${displayDate}: ${hours} hours${output ? ' (SHIPPED!)' : ''}\n`;
      });

      const prompt = `
All-Time Stats:
- Total hours worked: ${totalHours}
- Total outputs shipped: ${totalOutputs}
- Longest continuous streak: ${maxStreak} days

The Goal: ${dailyGoal} hours per day.

Recent Activity (Last 30 Days):
${recentActivityStr}
      `;

      // 2. Call Gemini
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are the 'System Oracle' for a brutalist productivity tracker. Analyze the user's work data. Your tone must be: hacker, deadpan, slightly aggressive but motivating. No pleasantries. No emojis. All text must be entirely in lowercase.\nFormat your response into 3 short paragraphs:\n1. A blunt observation of their recent momentum (or lack thereof).\n2. A specific pattern you noticed in their data (e.g., 'you grind hard before shipping then disappear for a week', or 'you always skip fridays').\n3. A concluding directive or challenge to get them back to work.",
        }
      });

      setDiagnostic(response.text || 'system failure: no response generated.');
    } catch (err) {
      console.error(err);
      setError('system error: failed to connect to oracle.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-16 mb-8">
      <h2 className="text-gray-500 font-mono text-sm tracking-widest mb-4 uppercase">System Diagnostic</h2>
      <div className="bg-black border border-gray-800 p-6 font-mono w-full min-h-[200px] flex flex-col">
        {!diagnostic && !loading && !error && (
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={runDiagnostic}
              className="text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600 px-6 py-3 text-sm tracking-widest uppercase transition-colors"
            >
              [ RUN SYSTEM DIAGNOSTIC ]
            </button>
          </div>
        )}

        {loading && (
          <div className="flex-1 flex items-start">
            <span className="animate-pulse" style={{ color: activeTheme.hex }}>{'>'} analyzing trajectory data...</span>
          </div>
        )}

        {error && (
          <div className="flex-1 flex items-start">
            <span className="text-red-500">{'>'} {error}</span>
            <button onClick={runDiagnostic} className="ml-4 text-gray-500 hover:text-white underline">retry</button>
          </div>
        )}

        {diagnostic && !loading && (
          <div className="flex-1 flex flex-col gap-4">
            {diagnostic.split('\n\n').map((paragraph, i) => (
              <p key={i} style={{ color: activeTheme.hex }}>{paragraph}</p>
            ))}
            <div className="mt-4">
              <button
                onClick={runDiagnostic}
                className="text-gray-600 hover:text-gray-300 text-xs tracking-widest uppercase transition-colors"
              >
                [ RE-RUN DIAGNOSTIC ]
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
