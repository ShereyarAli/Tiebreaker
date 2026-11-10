import React, { useState, useMemo } from 'react';
import { RotateCcw, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { ComparisonMatrix, OptionAnalysis } from '../types/decision';

interface ComparisonMatrixViewProps {
  matrix: ComparisonMatrix;
  options: OptionAnalysis[];
  initialWeights?: Record<string, number>;
  onWeightsChange?: (weights: Record<string, number>) => void;
}

export const ComparisonMatrixView: React.FC<ComparisonMatrixViewProps> = ({
  matrix,
  options,
  initialWeights,
  onWeightsChange,
}) => {
  // Initialize weights from saved user weights or AI defaultWeights
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    if (initialWeights && Object.keys(initialWeights).length > 0) {
      return initialWeights;
    }
    const initial: Record<string, number> = {};
    matrix.criteria.forEach((c) => {
      initial[c.id] = c.defaultWeight;
    });
    return initial;
  });

  const [expandedCriterionId, setExpandedCriterionId] = useState<string | null>(null);

  const handleWeightChange = (criterionId: string, value: number) => {
    const updated = { ...weights, [criterionId]: value };
    setWeights(updated);
    if (onWeightsChange) {
      onWeightsChange(updated);
    }
  };

  const handleResetWeights = () => {
    const reset: Record<string, number> = {};
    matrix.criteria.forEach((c) => {
      reset[c.id] = c.defaultWeight;
    });
    setWeights(reset);
    if (onWeightsChange) {
      onWeightsChange(reset);
    }
  };

  // Calculate weighted total scores dynamically
  const scoresByOption = useMemo(() => {
    const totalWeights = matrix.criteria.reduce(
      (sum, c) => sum + (weights[c.id] ?? c.defaultWeight),
      0
    );
    if (totalWeights === 0) return [];

    return options
      .map((opt) => {
        let weightedSum = 0;
        matrix.criteria.forEach((crit) => {
          const critWeight = weights[crit.id] ?? crit.defaultWeight;
          const scoreObj = crit.optionScores.find((s) => s.optionName === opt.optionName);
          const score = scoreObj ? scoreObj.score : 5;
          weightedSum += score * critWeight;
        });

        const normalizedScore = Number((weightedSum / totalWeights).toFixed(1));
        return {
          optionName: opt.optionName,
          score: normalizedScore,
          rawTotal: Number(weightedSum.toFixed(1)),
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [matrix, options, weights]);

  const topOption = scoresByOption[0];

  return (
    <div className="space-y-8">
      {/* Dynamic Weighted Leaderboard Banner */}
      <div className="p-6 sm:p-7 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white shadow-lg border border-indigo-500/25">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider font-mono">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Current Dynamic Leader (Adjust Weights Below)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {topOption?.optionName}
            </h3>
            <p className="text-sm text-indigo-200/90 leading-relaxed">
              Leading with a weighted score of{' '}
              <span className="font-extrabold font-mono text-amber-300 tabular-nums text-base">
                {topOption?.score} / 10
              </span>{' '}
              based on your active importance weights.
            </p>
          </div>

          <button
            onClick={handleResetWeights}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-indigo-100 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition-colors whitespace-nowrap shrink-0 self-start md:self-auto cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to AI Defaults
          </button>
        </div>

        {/* Real-time score progress bars */}
        <div className="mt-6 space-y-3 pt-5 border-t border-white/10">
          {scoresByOption.map((item, idx) => {
            const isWinner = idx === 0;
            return (
              <div key={item.optionName} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5 truncate pr-3">
                    <span className="font-mono text-xs text-indigo-300 font-bold">
                      #{idx + 1}
                    </span>
                    <span
                      className={`truncate ${
                        isWinner ? 'font-bold text-white text-base' : 'text-slate-300 font-medium'
                      }`}
                    >
                      {item.optionName}
                    </span>
                  </div>
                  <span className="font-mono tabular-nums font-extrabold text-white shrink-0 text-sm sm:text-base">
                    {item.score} / 10
                  </span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isWinner ? 'bg-amber-400' : 'bg-indigo-400/80'
                    }`}
                    style={{ width: `${Math.min(100, item.score * 10)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              Side-by-Side Evaluation Matrix
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
              Adjust sliders in the left column to reflect how much each criterion matters to you.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800 self-start sm:self-auto">
            {matrix.criteria.length} Criteria Evaluated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-300 font-bold">
                <th className="py-4 px-6 w-1/3">Criteria & Importance</th>
                {options.map((opt, i) => (
                  <th key={i} className="py-4 px-6">
                    <div className="font-extrabold text-slate-900 dark:text-white text-base truncate">
                      Option {String.fromCharCode(65 + i)}
                    </div>
                    <div className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate max-w-[240px] mt-0.5">
                      {opt.optionName}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {matrix.criteria.map((crit) => {
                const currentWeight = weights[crit.id] ?? crit.defaultWeight;
                const isExpanded = expandedCriterionId === crit.id;

                return (
                  <tr
                    key={crit.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-5 px-6 align-top">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                            {crit.name}
                          </span>
                          <button
                            onClick={() => setExpandedCriterionId(isExpanded ? null : crit.id)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-2"
                            title="Toggle explanation"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {crit.description}
                        </p>
                        {/* Inline Weight Slider */}
                        <div className="flex items-center gap-3 pt-2">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono">
                            Weight:
                          </span>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            step="1"
                            value={currentWeight}
                            onChange={(e) => handleWeightChange(crit.id, Number(e.target.value))}
                            className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                          <span className="font-mono text-sm font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                            {currentWeight}x
                          </span>
                        </div>
                      </div>
                    </td>

                    {options.map((opt, i) => {
                      const scoreData = crit.optionScores.find(
                        (s) => s.optionName === opt.optionName
                      );
                      const score = scoreData?.score ?? 5;
                      const reasoning = scoreData?.reasoning || 'Evaluated capability.';

                      return (
                        <td key={i} className="py-5 px-6 align-top">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-mono text-base font-black tabular-nums ${
                                  score >= 8
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : score >= 6
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : score >= 4
                                    ? 'text-amber-600 dark:text-amber-400'
                                    : 'text-rose-600 dark:text-rose-400'
                                }`}
                              >
                                {score} / 10
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              {reasoning}
                            </p>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
            {/* Table Footer: Weighted Sum Totals */}
            <tfoot>
              <tr className="border-t-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 font-bold text-slate-900 dark:text-white">
                <td className="py-5 px-6">
                  <span className="font-extrabold text-sm sm:text-base uppercase tracking-wider">
                    Total Weighted Score
                  </span>
                </td>
                {options.map((opt, i) => {
                  const scoreObj = scoresByOption.find((s) => s.optionName === opt.optionName);
                  const isWinner = scoresByOption[0]?.optionName === opt.optionName;

                  return (
                    <td key={i} className="py-5 px-6">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xl sm:text-2xl font-black tabular-nums text-indigo-600 dark:text-indigo-400">
                          {scoreObj?.score ?? 0}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">/ 10</span>
                        {isWinner && (
                          <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-300 dark:border-amber-700">
                            LEADER
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
