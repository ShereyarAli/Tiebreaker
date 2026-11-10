import React, { useState } from 'react';
import {
  Trophy,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Flame,
  Coins,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Verdict, OptionAnalysis } from '../types/decision';

interface VerdictViewProps {
  verdict: Verdict;
  options: OptionAnalysis[];
  onOpenCoinToss: () => void;
  onOpenDevilsAdvocate: (optionName: string) => void;
  decisionTitle: string;
}

export const VerdictView: React.FC<VerdictViewProps> = ({
  verdict,
  options,
  onOpenCoinToss,
  onOpenDevilsAdvocate,
  decisionTitle,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<boolean>(false);

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
    });
  };

  const copyMemoToClipboard = () => {
    const text = `THE TIEBREAKER DECISION SUMMARY
Decision: ${decisionTitle}

RECOMMENDED VERDICT:
${verdict.recommendedOption} (Confidence: ${verdict.confidenceLevel})

THE CORE TRADE-OFF:
${verdict.coreTradeOff}

RATIONALE:
${verdict.rationale}

REVERSIBLE VALIDATION EXPERIMENT:
${verdict.reversibleTest}

ACTIONABLE NEXT STEPS:
${verdict.actionableNextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadMarkdown = () => {
    const text = `# Decision Intelligence Memo: ${decisionTitle}
*Generated via The Tiebreaker*

## Executive Recommendation
**Winner:** ${verdict.recommendedOption}  
**Confidence Level:** ${verdict.confidenceLevel}  

### The Core Trade-off
> ${verdict.coreTradeOff}

---

## Detailed Strategic Rationale
${verdict.rationale}

---

## Reversible Test Experiment (Before Final Lock-in)
${verdict.reversibleTest}

---

## Actionable Next Steps
${verdict.actionableNextSteps.map((s, i) => `- [ ] ${s}`).join('\n')}

---

## Options Evaluated
${options.map((o) => `### ${o.optionName}\n${o.summary}\n`).join('\n')}
`;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tiebreaker-decision-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-9">
      {/* Primary Verdict Hero Banner */}
      <div className="relative overflow-hidden p-7 sm:p-10 bg-slate-950 rounded-3xl border-2 border-indigo-500/40 text-white shadow-2xl">
        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <Trophy className="w-5 h-5 text-amber-300" />
              </span>
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-indigo-300 font-mono">
                The Tiebreaker Official Recommendation
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <span className="text-xs text-slate-400">Confidence:</span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-lg ${
                  verdict.confidenceLevel === 'High'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : verdict.confidenceLevel === 'Moderate'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {verdict.confidenceLevel} Confidence
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {verdict.recommendedOption}
            </h2>
          </div>

          {/* The Core Trade-off Callout */}
          <div className="p-5 bg-white/10 border border-white/15 rounded-2xl space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block font-mono">
              The Fundamental Core Trade-off
            </span>
            <p className="text-base sm:text-lg font-bold text-white leading-snug italic">
              "{verdict.coreTradeOff}"
            </p>
          </div>

          {/* Strategic Rationale */}
          <div className="pt-1">
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              {verdict.rationale}
            </p>
          </div>

          {/* Quick interactive utility buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
            <button
              onClick={triggerCelebration}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-md shadow-indigo-500/30 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Confirm Choice
            </button>

            <button
              onClick={() => onOpenDevilsAdvocate(verdict.recommendedOption)}
              className="px-4 py-2.5 text-xs sm:text-sm font-bold bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-700/60 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-rose-400" />
              Devil's Advocate
            </button>

            <button
              onClick={onOpenCoinToss}
              className="px-4 py-2.5 text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              Subconscious Coin Test
            </button>

            <button
              onClick={copyMemoToClipboard}
              className="px-4 py-2.5 text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition-colors flex items-center gap-2 sm:ml-auto cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Memo'}</span>
            </button>

            <button
              onClick={downloadMarkdown}
              className="px-4 py-2.5 text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              title="Download Markdown Memo"
            >
              <Download className="w-4 h-4" />
              <span>Export .md</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Reversible Experiment & Action Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
        {/* Reversible Test Experiment */}
        <div className="p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Low-Risk Reversible Experiment
            </h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Before committing permanently, stress-test your true feelings with this 24-48 hour psychological experiment:
          </p>
          <div className="p-5 bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 rounded-2xl">
            <p className="text-sm sm:text-base font-bold text-indigo-950 dark:text-indigo-100 leading-relaxed">
              {verdict.reversibleTest}
            </p>
          </div>
        </div>

        {/* Actionable Next Steps Checklist */}
        <div className="p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Immediate Execution Steps
              </h3>
            </div>
            <span className="text-xs font-bold font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 tabular-nums">
              {Object.values(completedSteps).filter(Boolean).length} of {verdict.actionableNextSteps.length} done
            </span>
          </div>

          <div className="space-y-3">
            {verdict.actionableNextSteps.map((step, idx) => {
              const isChecked = !!completedSteps[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isChecked
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="w-5 h-5 text-emerald-600 rounded-md mt-0.5 pointer-events-none accent-emerald-600"
                  />
                  <p
                    className={`text-sm sm:text-base leading-relaxed ${
                      isChecked
                        ? 'line-through text-slate-400 dark:text-slate-500 font-normal'
                        : 'text-slate-900 dark:text-slate-100 font-semibold'
                    }`}
                  >
                    {step}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
