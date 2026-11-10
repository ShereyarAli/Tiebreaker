import React, { useState, useEffect } from 'react';
import { Flame, X, AlertTriangle, HelpCircle, ShieldAlert, RotateCcw } from 'lucide-react';
import { DevilsAdvocateData } from '../types/decision';

interface DevilsAdvocateModalProps {
  isOpen: boolean;
  onClose: () => void;
  decisionTitle: string;
  optionName: string;
  currentVerdict: string;
}

export const DevilsAdvocateModal: React.FC<DevilsAdvocateModalProps> = ({
  isOpen,
  onClose,
  decisionTitle,
  optionName,
  currentVerdict,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<DevilsAdvocateData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCritique = () => {
    setLoading(true);
    setError(null);

    fetch('/api/devils-advocate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: decisionTitle,
        optionName,
        currentVerdict,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          let msg = 'Failed to generate critique.';
          try {
            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
              const err = await res.json();
              msg = err.error || msg;
            } else {
              msg = `Server returned status ${res.status}. Please try again.`;
            }
          } catch {
            msg = `Server returned status ${res.status}. Please try again.`;
          }
          throw new Error(msg);
        }
        return res.json();
      })
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong.');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!isOpen || !optionName) return;
    fetchCritique();
  }, [isOpen, optionName, decisionTitle, currentVerdict]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/15 dark:bg-rose-950/60 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Devil's Advocate Stress-Test
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                Challenging: <strong className="text-slate-900 dark:text-white font-bold">{optionName}</strong>
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

        {/* Loading state */}
        {loading && (
          <div className="py-14 flex flex-col items-center justify-center space-y-4">
            <div className="w-9 h-9 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Generating adversarial critique and testing blind spots...
            </p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="p-5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl space-y-3 text-rose-950 dark:text-rose-100">
            <p className="text-sm font-medium leading-relaxed">{error}</p>
            <button
              onClick={fetchCritique}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Stress-Test</span>
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && data && (
          <div className="space-y-7 text-slate-800 dark:text-slate-200">
            {/* Hard Truths */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-extrabold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>3 Hard Truths You May Be Minimizing</span>
              </div>
              <ul className="space-y-2.5">
                {data.hardTruths.map((truth, i) => (
                  <li
                    key={i}
                    className="p-4 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-2xl text-sm sm:text-base text-rose-950 dark:text-rose-100 leading-relaxed font-medium"
                  >
                    {truth}
                  </li>
                ))}
              </ul>
            </div>

            {/* Hidden Costs */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-extrabold uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Hidden Second-Order Consequences</span>
              </div>
              <ul className="space-y-2.5">
                {data.hiddenCosts.map((cost, i) => (
                  <li
                    key={i}
                    className="p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl text-sm sm:text-base text-amber-950 dark:text-amber-100 leading-relaxed font-medium"
                  >
                    {cost}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stress Test Questions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm font-extrabold uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>Stress-Test Questions You Must Answer Honestly</span>
              </div>
              <div className="space-y-2.5">
                {data.stressTestQuestions.map((q, i) => (
                  <div
                    key={i}
                    className="p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 italic leading-relaxed"
                  >
                    "{q}"
                  </div>
                ))}
              </div>
            </div>

            {/* Final Advocate Summary */}
            <div className="p-5 bg-slate-950 text-white rounded-2xl space-y-1.5 border border-slate-800">
              <span className="text-xs uppercase font-extrabold text-slate-400 font-mono">
                Advocate's Final Take
              </span>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                {data.conclusion}
              </p>
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-slate-800 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            Close Critique
          </button>
        </div>
      </div>
    </div>
  );
};
