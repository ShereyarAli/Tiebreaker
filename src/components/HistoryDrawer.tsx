import React from 'react';
import { X, Trash2, Scale, Clock, Sparkles } from 'lucide-react';
import { DecisionRecord } from '../types/decision';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: DecisionRecord[];
  onSelectDecision: (decision: DecisionRecord) => void;
  onDeleteDecision: (id: string) => void;
  onClearHistory: () => void;
  onLoadSample: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectDecision,
  onDeleteDecision,
  onClearHistory,
  onLoadSample,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Decision History
              </h3>
              <p className="text-xs font-semibold text-slate-500 font-mono tabular-nums">
                {history.length} saved {history.length === 1 ? 'dilemma' : 'dilemmas'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <Clock className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
              <div className="space-y-1">
                <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                  No saved decisions yet
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Decisions you analyze are saved automatically to your local browser storage.
                </p>
              </div>
              <button
                onClick={() => {
                  onLoadSample();
                  onClose();
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-xl transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Load Demo Career Dilemma
              </button>
            </div>
          ) : (
            history.map((item) => {
              const formattedDate = new Date(item.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={item.id}
                  className="p-5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-500 transition-all space-y-2.5 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      onClick={() => {
                        onSelectDecision(item);
                        onClose();
                      }}
                      className="text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug cursor-pointer"
                    >
                      {item.title}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDecision(item.id);
                      }}
                      title="Delete from history"
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {item.analysis?.verdict && (
                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 truncate">
                      Winner: {item.analysis.verdict.recommendedOption}
                    </div>
                  )}

                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono font-medium pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span>{formattedDate}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.options.length} Options</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.riskTolerance}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={onClearHistory}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
            >
              Clear All History
            </button>
            <button
              onClick={() => {
                onLoadSample();
                onClose();
              }}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Load Demo Dilemma
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
