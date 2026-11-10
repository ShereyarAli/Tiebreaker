import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, TrendingUp, AlertOctagon } from 'lucide-react';
import { OptionAnalysis } from '../types/decision';

interface SwotViewProps {
  options: OptionAnalysis[];
}

export const SwotView: React.FC<SwotViewProps> = ({ options }) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);
  const currentOption = options[selectedOptionIndex] || options[0];

  return (
    <div className="space-y-7">
      {/* Option Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-x-auto max-w-full">
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedOptionIndex(idx)}
              className={`px-4 py-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-2.5 ${
                selectedOptionIndex === idx
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="w-5 h-5 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-center font-mono font-bold">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="truncate max-w-[220px]">{opt.optionName}</span>
            </button>
          ))}
        </div>

        <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Showing SWOT for <strong className="text-slate-900 dark:text-white font-bold">Option {String.fromCharCode(65 + selectedOptionIndex)}</strong>
        </div>
      </div>

      {/* Option Context Card */}
      <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1.5">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
          {currentOption.optionName}
        </h3>
        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
          {currentOption.summary}
        </p>
      </div>

      {/* 2x2 SWOT Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* STRENGTHS (Internal / Positive) */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-emerald-500/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Strengths (Internal Advantages)
              </h4>
            </div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase font-mono bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
              Internal
            </span>
          </div>
          <ul className="space-y-3">
            {currentOption.swot.strengths.map((item, i) => (
              <li
                key={i}
                className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed flex items-start gap-3"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* WEAKNESSES (Internal / Negative) */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-amber-500/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Weaknesses (Internal Vulnerabilities)
              </h4>
            </div>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase font-mono bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800">
              Internal
            </span>
          </div>
          <ul className="space-y-3">
            {currentOption.swot.weaknesses.map((item, i) => (
              <li
                key={i}
                className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed flex items-start gap-3"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* OPPORTUNITIES (External / Positive) */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-indigo-500/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Opportunities (External Upside)
              </h4>
            </div>
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase font-mono bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-md border border-indigo-200 dark:border-indigo-800">
              External
            </span>
          </div>
          <ul className="space-y-3">
            {currentOption.swot.opportunities.map((item, i) => (
              <li
                key={i}
                className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed flex items-start gap-3"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* THREATS (External / Negative) */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-rose-500/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Threats (External Risks & Hazards)
              </h4>
            </div>
            <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase font-mono bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-md border border-rose-200 dark:border-rose-800">
              External
            </span>
          </div>
          <ul className="space-y-3">
            {currentOption.swot.threats.map((item, i) => (
              <li
                key={i}
                className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed flex items-start gap-3"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0" />
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
