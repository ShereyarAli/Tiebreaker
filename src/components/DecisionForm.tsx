import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, ArrowRight, Compass, Shield, Zap } from 'lucide-react';
import { PRESET_TEMPLATES, DecisionTemplate } from '../data/presetTemplates';

interface DecisionFormProps {
  onSubmit: (formData: {
    title: string;
    options: string[];
    context: string;
    riskTolerance: 'Conservative' | 'Balanced' | 'Aggressive';
    priorities: string;
  }) => void;
  isLoading: boolean;
  onCancel?: () => void;
  initialValues?: {
    title: string;
    options: string[];
    context: string;
    riskTolerance: 'Conservative' | 'Balanced' | 'Aggressive';
    priorities: string;
  };
}

export const DecisionForm: React.FC<DecisionFormProps> = ({
  onSubmit,
  isLoading,
  onCancel,
  initialValues,
}) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [options, setOptions] = useState<string[]>(
    initialValues?.options && initialValues.options.length >= 2
      ? initialValues.options
      : ['', '']
  );
  const [context, setContext] = useState(initialValues?.context || '');
  const [riskTolerance, setRiskTolerance] = useState<'Conservative' | 'Balanced' | 'Aggressive'>(
    initialValues?.riskTolerance || 'Balanced'
  );
  const [priorities, setPriorities] = useState(initialValues?.priorities || '');
  const [error, setError] = useState<string | null>(null);

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const loadTemplate = (template: DecisionTemplate) => {
    setTitle(template.title);
    setOptions([...template.options]);
    setContext(template.context);
    setRiskTolerance(template.riskTolerance);
    setPriorities(template.priorities);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError('Please provide a decision question or dilemma.');
      return;
    }

    const cleanOptions = options.map((opt) => opt.trim()).filter((opt) => opt.length > 0);
    if (cleanOptions.length < 2) {
      setError('Please enter at least 2 distinct competing options.');
      return;
    }

    onSubmit({
      title: cleanTitle,
      options: cleanOptions,
      context: context.trim(),
      riskTolerance,
      priorities: priorities.trim(),
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden transition-colors">
      {/* Header Banner */}
      <div className="px-6 py-7 sm:px-8 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Frame Your Decision Dilemma
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Enter your dilemma and competing alternatives. The AI will evaluate pros & cons, compute criteria scores, build a SWOT matrix, and provide a definitive recommendation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0">Quick Templates:</span>
            <div className="flex flex-wrap gap-2">
              {PRESET_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => loadTemplate(tmpl)}
                  className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-800 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors whitespace-nowrap"
                >
                  {tmpl.category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-7">
        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-sm font-medium text-rose-800 dark:text-rose-200">
            {error}
          </div>
        )}

        {/* Decision Question */}
        <div className="space-y-2">
          <label className="block text-base font-bold text-slate-900 dark:text-slate-100">
            What decision are you trying to make? <span className="text-indigo-600 dark:text-indigo-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Should I accept the senior job offer in Seattle or stay at my current remote role?"
            className="w-full px-4 py-3 text-base text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-2xs font-medium placeholder:text-slate-400"
            required
          />
        </div>

        {/* Options Under Consideration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-base font-bold text-slate-900 dark:text-slate-100">
              Competing Options <span className="text-indigo-600 dark:text-indigo-400">*</span>
            </label>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono tabular-nums">
              {options.length} of 5 options
            </span>
          </div>

          <div className="space-y-3">
            {options.map((option, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center shrink-0 font-mono border border-slate-200 dark:border-slate-700">
                  {String.fromCharCode(65 + idx)}
                </span>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + idx)} (e.g. ${
                    idx === 0 ? 'Accept Offer at Company A' : idx === 1 ? 'Stay at Current Company' : 'Counter-offer or pursue Option C'
                  })`}
                  className="flex-1 px-4 py-2.5 text-sm sm:text-base text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-2xs font-medium placeholder:text-slate-400"
                  required
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors shrink-0"
                    title="Remove this option"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {options.length < 5 && (
            <button
              type="button"
              onClick={handleAddOption}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Another Option (up to 5)
            </button>
          )}
        </div>

        {/* Context & Backstory */}
        <div className="space-y-2">
          <label className="block text-base font-bold text-slate-900 dark:text-slate-100">
            Key Context & Details <span className="text-xs font-normal text-slate-500 dark:text-slate-400">(Optional)</span>
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={3}
            placeholder="Describe your current situation, timeline, personal dependencies, financial constraints, or what is making this choice difficult..."
            className="w-full px-4 py-3 text-sm sm:text-base text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-2xs font-normal placeholder:text-slate-400 leading-relaxed"
          />
        </div>

        {/* Risk Tolerance & Priorities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label className="block text-base font-bold text-slate-900 dark:text-slate-100">
              Your Risk Tolerance
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['Conservative', 'Balanced', 'Aggressive'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setRiskTolerance(mode)}
                  className={`py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl border text-center transition-all ${
                    riskTolerance === mode
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  {mode === 'Conservative' && <Shield className="w-4 h-4 inline mr-1.5" />}
                  {mode === 'Balanced' && <Compass className="w-4 h-4 inline mr-1.5" />}
                  {mode === 'Aggressive' && <Zap className="w-4 h-4 inline mr-1.5" />}
                  {mode}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
              {riskTolerance === 'Conservative' && 'Prioritizes downside floor, financial safety, and reversibility.'}
              {riskTolerance === 'Balanced' && 'Weighs calculated upside against sensible safeguards.'}
              {riskTolerance === 'Aggressive' && 'Maximizes asymmetrical growth, learning velocity, and long-term upside.'}
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-base font-bold text-slate-900 dark:text-slate-100">
              Primary Priorities & Non-Negotiables <span className="text-xs font-normal text-slate-500 dark:text-slate-400">(Optional)</span>
            </label>
            <input
              type="text"
              value={priorities}
              onChange={(e) => setPriorities(e.target.value)}
              placeholder="e.g. Work-life balance, learning curve, compensation, commute time"
              className="w-full px-4 py-2.5 text-sm sm:text-base text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-2xs font-normal placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Action Button Row */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
          ) : (
            <div />
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Evaluating Decision Dilemma...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Run The Tiebreaker Analysis</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
