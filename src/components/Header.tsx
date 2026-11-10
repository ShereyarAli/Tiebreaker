import React from 'react';
import { Scale, Plus, Moon, Sun, History } from 'lucide-react';

interface HeaderProps {
  onNewDecision: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  toggleDark: () => void;
  hasActiveDecision: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNewDecision,
  onOpenHistory,
  historyCount,
  activeTab,
  setActiveTab,
  isDark,
  toggleDark,
  hasActiveDecision,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-3 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl p-1"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:bg-indigo-700 transition-colors">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  The Tiebreaker
                </span>
                <span className="hidden sm:inline-block ml-2.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  Decision Intelligence
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Single Line) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            {hasActiveDecision && (
              <>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                    activeTab === 'overview'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 font-bold'
                      : 'border-transparent text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('pros-cons')}
                  className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                    activeTab === 'pros-cons'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 font-bold'
                      : 'border-transparent text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Pros & Cons
                </button>
                <button
                  onClick={() => setActiveTab('matrix')}
                  className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                    activeTab === 'matrix'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 font-bold'
                      : 'border-transparent text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Comparison Table
                </button>
                <button
                  onClick={() => setActiveTab('swot')}
                  className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                    activeTab === 'swot'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 font-bold'
                      : 'border-transparent text-slate-700 dark:text-slate-300'
                  }`}
                >
                  SWOT Analysis
                </button>
                <button
                  onClick={() => setActiveTab('verdict')}
                  className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                    activeTab === 'verdict'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 font-bold'
                      : 'border-transparent text-slate-700 dark:text-slate-300'
                  }`}
                >
                  The Verdict
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Actions & Primary CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenHistory}
              title="Saved Decisions History"
              className="relative p-2.5 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <History className="w-5 h-5" />
              {historyCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 text-[11px] font-bold text-white rounded-full flex items-center justify-center font-mono">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              onClick={toggleDark}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2.5 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={onNewDecision}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm shadow-indigo-500/25 transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>New Decision</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
