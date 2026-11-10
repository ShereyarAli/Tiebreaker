import React from 'react';
import { EyeOff, AlertCircle, HelpCircle } from 'lucide-react';
import { BlindSpot, OptionAnalysis } from '../types/decision';

interface BlindSpotsViewProps {
  blindSpots: BlindSpot[];
  options: OptionAnalysis[];
}

export const BlindSpotsView: React.FC<BlindSpotsViewProps> = ({
  blindSpots,
  options,
}) => {
  return (
    <div className="space-y-8">
      {/* Intro banner */}
      <div className="p-6 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-3xl">
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 flex items-center justify-center shrink-0 mt-0.5">
            <EyeOff className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-extrabold text-amber-950 dark:text-amber-100 tracking-tight">
              Cognitive Debiasing & Hidden Assumptions
            </h3>
            <p className="text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
              When humans face high-stakes choices, our subconscious minds default to predictable heuristics: loss aversion, overconfidence, status-quo bias, or the compromise trap. These targeted reframing prompts challenge your instinctual assumptions before you commit.
            </p>
          </div>
        </div>
      </div>

      {/* Identified Blind Spots */}
      <div className="space-y-5">
        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
          Psychological Blind Spots Detected
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blindSpots.map((spot, idx) => (
            <div
              key={idx}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-base font-extrabold text-indigo-700 dark:text-indigo-300">
                  {spot.title}
                </span>
                <span className="text-xs font-bold font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                  {spot.biasType}
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                {spot.observation}
              </p>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <span className="block text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Reframing Inquiry
                  </span>
                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white italic leading-relaxed">
                    "{spot.reframingQuestion}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 12-Month Pre-Mortem Scenarios */}
      <div className="space-y-5 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div>
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            12-Month Pre-Mortem (Gary Klein Strategic Framework)
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            Imagine it is exactly one year from today and this decision has resulted in an unfortunate failure. What caused it, and what proactive safeguard can you install immediately?
          </p>
        </div>

        <div className="space-y-5">
          {options.map((opt, i) => (
            <div
              key={i}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-mono font-bold flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  {opt.optionName}
                </span>
              </div>
              <div className="p-4 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-2xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
                  <p className="text-sm sm:text-base text-rose-950 dark:text-rose-100 leading-relaxed font-medium">
                    {opt.preMortem}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
