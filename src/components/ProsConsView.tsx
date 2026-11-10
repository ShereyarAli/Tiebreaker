import React, { useState } from 'react';
import { Plus, CheckCircle2, XCircle, Filter } from 'lucide-react';
import { OptionAnalysis, ProConItem } from '../types/decision';

interface ProsConsViewProps {
  optionsAnalysis: OptionAnalysis[];
  onAddCustomProCon: (
    optionIndex: number,
    type: 'pro' | 'con',
    item: ProConItem
  ) => void;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({
  optionsAnalysis,
  onAddCustomProCon,
}) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newType, setNewType] = useState<'pro' | 'con'>('pro');
  const [newPoint, setNewPoint] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('Personal');
  const [newImpact, setNewImpact] = useState<'High' | 'Medium' | 'Low'>('High');
  const [newHorizon, setNewHorizon] = useState<'Short-term' | 'Long-term'>('Long-term');

  const currentOption = optionsAnalysis[selectedOptionIndex] || optionsAnalysis[0];

  // Extract all unique categories across this option's pros and cons
  const categories = Array.from(
    new Set([
      ...currentOption.pros.map((p) => p.category),
      ...currentOption.cons.map((c) => c.category),
    ])
  );

  const filteredPros = currentOption.pros.filter(
    (p) => categoryFilter === 'all' || p.category === categoryFilter
  );
  const filteredCons = currentOption.cons.filter(
    (c) => categoryFilter === 'all' || c.category === categoryFilter
  );

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPoint.trim()) return;

    onAddCustomProCon(selectedOptionIndex, newType, {
      point: newPoint.trim(),
      category: newCategory.trim() || 'General',
      impact: newImpact,
      timeHorizon: newHorizon,
      custom: true,
    });

    setNewPoint('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-7">
      {/* Option Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-x-auto max-w-full">
          {optionsAnalysis.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedOptionIndex(idx);
                setCategoryFilter('all');
              }}
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

        <div className="flex items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-2xs"
            >
              <option value="all">All Categories ({currentOption.pros.length + currentOption.cons.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Add custom pro/con button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl border border-indigo-200 dark:border-indigo-800 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Pro/Con
          </button>
        </div>
      </div>

      {/* Option Summary Header */}
      <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-mono">
              Analyzing Option {String.fromCharCode(65 + selectedOptionIndex)}
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
              {currentOption.optionName}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
              {currentOption.summary}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold font-mono tabular-nums shrink-0 p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
              +{currentOption.pros.length} Pros
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-rose-700 dark:text-rose-400 font-bold">
              -{currentOption.cons.length} Cons
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Pros & Cons Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PROS COLUMN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-emerald-500/30">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Advantages & Upsides
              </h4>
            </div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
              {filteredPros.length} Advantages
            </span>
          </div>

          <div className="space-y-3.5">
            {filteredPros.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 py-6 italic text-center">
                No advantages match the selected category filter.
              </p>
            ) : (
              filteredPros.map((pro, i) => (
                <div
                  key={i}
                  className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {pro.point}
                    </p>
                    {pro.custom && (
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800 shrink-0">
                        Custom
                      </span>
                    )}
                  </div>

                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {pro.category}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span
                      className={`font-bold ${
                        pro.impact === 'High'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : pro.impact === 'Medium'
                          ? 'text-slate-700 dark:text-slate-300'
                          : 'text-slate-500'
                      }`}
                    >
                      {pro.impact} Impact
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="font-medium text-slate-600 dark:text-slate-400">{pro.timeHorizon}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CONS COLUMN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-rose-500/30">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Drawbacks & Downside Risks
              </h4>
            </div>
            <span className="text-xs font-bold text-rose-700 dark:text-rose-400 font-mono tabular-nums bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-800">
              {filteredCons.length} Drawbacks
            </span>
          </div>

          <div className="space-y-3.5">
            {filteredCons.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 py-6 italic text-center">
                No drawbacks match the selected category filter.
              </p>
            ) : (
              filteredCons.map((con, i) => (
                <div
                  key={i}
                  className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-rose-400 dark:hover:border-rose-600 transition-colors shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {con.point}
                    </p>
                    {con.custom && (
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800 shrink-0">
                        Custom
                      </span>
                    )}
                  </div>

                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {con.category}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span
                      className={`font-bold ${
                        con.impact === 'High'
                          ? 'text-rose-600 dark:text-rose-400'
                          : con.impact === 'Medium'
                          ? 'text-slate-700 dark:text-slate-300'
                          : 'text-slate-500'
                      }`}
                    >
                      {con.impact} Impact
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="font-medium text-slate-600 dark:text-slate-400">{con.timeHorizon}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Custom Pro/Con Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Add Personal Consideration to Option {String.fromCharCode(65 + selectedOptionIndex)}
            </h3>
            <form onSubmit={handleSaveCustom} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNewType('pro')}
                  className={`py-2.5 text-sm font-bold rounded-xl border text-center transition-all ${
                    newType === 'pro'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  + Advantage (Pro)
                </button>
                <button
                  type="button"
                  onClick={() => setNewType('con')}
                  className={`py-2.5 text-sm font-bold rounded-xl border text-center transition-all ${
                    newType === 'con'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  - Drawback (Con)
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                  Point / Reasoning
                </label>
                <textarea
                  value={newPoint}
                  onChange={(e) => setNewPoint(e.target.value)}
                  placeholder="Enter your personal observation or constraint..."
                  rows={3}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g. Family"
                    className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Impact
                  </label>
                  <select
                    value={newImpact}
                    onChange={(e) => setNewImpact(e.target.value as any)}
                    className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Timeframe
                  </label>
                  <select
                    value={newHorizon}
                    onChange={(e) => setNewHorizon(e.target.value as any)}
                    className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Short-term">Short-term</option>
                    <option value="Long-term">Long-term</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
