/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Scale,
  Plus,
  ArrowRight,
  Sparkles,
  Trophy,
  CheckCircle2,
  Sliders,
  Flame,
  Coins,
  AlertTriangle,
  Compass,
  RotateCcw,
} from 'lucide-react';

import { Header } from './components/Header';
import { DecisionForm } from './components/DecisionForm';
import { ProsConsView } from './components/ProsConsView';
import { ComparisonMatrixView } from './components/ComparisonMatrixView';
import { SwotView } from './components/SwotView';
import { BlindSpotsView } from './components/BlindSpotsView';
import { VerdictView } from './components/VerdictView';
import { DevilsAdvocateModal } from './components/DevilsAdvocateModal';
import { CoinTossModal } from './components/CoinTossModal';
import { HistoryDrawer } from './components/HistoryDrawer';

import { DecisionRecord, DecisionAnalysisResult, ProConItem } from './types/decision';
import { SAMPLE_DECISION } from './data/sampleDecision';

const STORAGE_KEY_HISTORY = 'the_tiebreaker_history_v1';
const STORAGE_KEY_THEME = 'the_tiebreaker_theme_v1';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved !== null) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [isDark]);

  const toggleDark = () => setIsDark((prev) => !prev);

  // History state
  const [history, setHistory] = useState<DecisionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse history:', e);
    }
    return [SAMPLE_DECISION];
  });

  // Current active decision
  const [currentDecision, setCurrentDecision] = useState<DecisionRecord | null>(SAMPLE_DECISION);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Modal and drawer states
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [devilsAdvocateTarget, setDevilsAdvocateTarget] = useState<string | null>(null);
  const [isCoinTossOpen, setIsCoinTossOpen] = useState<boolean>(false);

  // Analysis loading & error
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [lastSubmittedPayload, setLastSubmittedPayload] = useState<{
    title: string;
    options: string[];
    context: string;
    riskTolerance: 'Conservative' | 'Balanced' | 'Aggressive';
    priorities: string;
  } | null>(null);

  // Persist history to localStorage
  const saveHistory = (updated: DecisionRecord[]) => {
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  };

  // Handle new decision analysis
  const handleAnalyzeDecision = async (formData: {
    title: string;
    options: string[];
    context: string;
    riskTolerance: 'Conservative' | 'Balanced' | 'Aggressive';
    priorities: string;
  }) => {
    setIsLoading(true);
    setAnalysisError(null);
    setLastSubmittedPayload(formData);

    try {
      const response = await fetch('/api/analyze-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        let serverMsg = 'Failed to analyze decision.';
        try {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const errJson = await response.json();
            serverMsg = errJson.error || serverMsg;
          } else {
            if (response.status === 504 || response.status === 502) {
              serverMsg = 'The AI analysis request timed out. Please try again with shorter context.';
            } else if (response.status === 503) {
              serverMsg = 'The AI model is experiencing a high-demand spike. Please click Retry below in a moment.';
            } else {
              serverMsg = `Decision service returned status ${response.status}. Please try again.`;
            }
          }
        } catch {
          serverMsg = `Decision service returned status ${response.status}. Please try again.`;
        }
        throw new Error(serverMsg);
      }

      let analysis: DecisionAnalysisResult;
      try {
        analysis = await response.json();
      } catch (jsonErr) {
        throw new Error('Received an unexpected non-JSON response from the server. Please click Retry below.');
      }

      const newRecord: DecisionRecord = {
        id: `decision-${Date.now()}`,
        timestamp: Date.now(),
        title: formData.title,
        options: formData.options,
        context: formData.context,
        riskTolerance: formData.riskTolerance,
        priorities: formData.priorities,
        analysis,
        userWeights: {},
      };

      const updatedHistory = [newRecord, ...history.filter((h) => h.id !== newRecord.id)];
      saveHistory(updatedHistory);
      setCurrentDecision(newRecord);
      setIsFormOpen(false);
      setActiveTab('overview');
    } catch (error: any) {
      console.error('Analysis error:', error);
      const msg = error?.message || '';
      if (msg.includes('high demand') || msg.includes('503')) {
        setAnalysisError(
          'Gemini model is currently experiencing temporary high demand. Click "Retry Analysis" below to try again.'
        );
      } else {
        setAnalysisError(
          error?.message ||
            'Could not complete decision analysis. Please check your network and GEMINI_API_KEY.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Retry last submitted decision
  const handleRetryLast = () => {
    if (lastSubmittedPayload) {
      handleAnalyzeDecision(lastSubmittedPayload);
    }
  };

  // Add custom Pro / Con
  const handleAddCustomProCon = (
    optionIndex: number,
    type: 'pro' | 'con',
    item: ProConItem
  ) => {
    if (!currentDecision?.analysis) return;

    const updatedOptions = [...currentDecision.analysis.optionsAnalysis];
    const targetOption = updatedOptions[optionIndex];
    if (!targetOption) return;

    if (type === 'pro') {
      targetOption.pros = [item, ...targetOption.pros];
    } else {
      targetOption.cons = [item, ...targetOption.cons];
    }

    const updatedDecision: DecisionRecord = {
      ...currentDecision,
      analysis: {
        ...currentDecision.analysis,
        optionsAnalysis: updatedOptions,
      },
    };

    setCurrentDecision(updatedDecision);
    const updatedHistory = history.map((h) => (h.id === updatedDecision.id ? updatedDecision : h));
    saveHistory(updatedHistory);
  };

  // Weights change
  const handleWeightsChange = (weights: Record<string, number>) => {
    if (!currentDecision) return;
    const updatedDecision: DecisionRecord = {
      ...currentDecision,
      userWeights: weights,
    };
    setCurrentDecision(updatedDecision);
    const updatedHistory = history.map((h) => (h.id === updatedDecision.id ? updatedDecision : h));
    saveHistory(updatedHistory);
  };

  // Delete decision
  const handleDeleteDecision = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    saveHistory(updated);
    if (currentDecision?.id === id) {
      setCurrentDecision(updated[0] || null);
    }
  };

  // Clear all
  const handleClearHistory = () => {
    saveHistory([]);
    setCurrentDecision(null);
  };

  // Load demo sample
  const handleLoadSample = () => {
    const updated = [SAMPLE_DECISION, ...history.filter((h) => h.id !== SAMPLE_DECISION.id)];
    saveHistory(updated);
    setCurrentDecision(SAMPLE_DECISION);
    setIsFormOpen(false);
    setActiveTab('overview');
    setAnalysisError(null);
  };

  const analysis = currentDecision?.analysis;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors antialiased">
      {/* Top Navigation Bar */}
      <Header
        onNewDecision={() => {
          setIsFormOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleDark={toggleDark}
        hasActiveDecision={!!currentDecision}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Friendly, high-contrast readable Error Alert */}
        {analysisError && (
          <div className="p-5 bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-300 dark:border-rose-800 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-rose-950 dark:text-rose-100">
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <strong className="text-base font-extrabold block">Notice from Decision Engine</strong>
                <p className="text-sm text-rose-900 dark:text-rose-200 leading-relaxed font-medium">
                  {analysisError}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
              {lastSubmittedPayload && (
                <button
                  onClick={handleRetryLast}
                  disabled={isLoading}
                  className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Retry Analysis</span>
                </button>
              )}
              <button
                onClick={() => setAnalysisError(null)}
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-rose-800 dark:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Decision Creation Form Modal or Inline Panel */}
        {isFormOpen ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            <DecisionForm
              onSubmit={handleAnalyzeDecision}
              isLoading={isLoading}
              onCancel={currentDecision ? () => setIsFormOpen(false) : undefined}
            />
          </div>
        ) : !currentDecision ? (
          /* Empty State when no decision is loaded */
          <div className="py-20 text-center max-w-2xl mx-auto space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-md">
              <Scale className="w-10 h-10" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome to The Tiebreaker
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Stuck between two job offers, a housing dilemma, or a major technical migration?
                Provide your competing alternatives and let AI decision science break down the trade-offs.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
              <button
                onClick={() => setIsFormOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                <span>Start New Decision</span>
              </button>
              <button
                onClick={handleLoadSample}
                className="w-full sm:w-auto px-6 py-3.5 text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Explore Demo Dilemma</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Decision Workspace */
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Decision Title Header & Meta */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                <div className="space-y-2.5 max-w-3xl">
                  {/* Clean unboxed text metadata with typographic separators */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                      Active Dilemma
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="font-mono tabular-nums">
                      {new Date(currentDecision.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span>{currentDecision.options.length} Competing Options</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {currentDecision.riskTolerance} Risk
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                    {currentDecision.title}
                  </h1>

                  {currentDecision.context && (
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                      {currentDecision.context}
                    </p>
                  )}
                </div>

                {/* Header Action Tools */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => setIsCoinTossOpen(true)}
                    className="px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                    title="Flip Subconscious Coin"
                  >
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span>Flip Coin</span>
                  </button>

                  {analysis && (
                    <button
                      onClick={() => setDevilsAdvocateTarget(analysis.verdict.recommendedOption)}
                      className="px-3.5 py-2 text-xs sm:text-sm font-bold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                      title="Challenge winner with Devil's Advocate"
                    >
                      <Flame className="w-4 h-4 text-rose-500" />
                      <span>Devil's Advocate</span>
                    </button>
                  )}

                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="px-4 py-2 text-xs sm:text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Edit Dilemma</span>
                  </button>
                </div>
              </div>

              {/* View Switcher Tabs (Segmented Control) */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview & Highlights' },
                  { id: 'pros-cons', label: 'Pros & Cons List' },
                  { id: 'matrix', label: 'Comparison Table' },
                  { id: 'swot', label: 'SWOT Analysis' },
                  { id: 'blind-spots', label: 'Blind Spots & Pre-Mortem' },
                  { id: 'verdict', label: 'The Tiebreaker Verdict' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB CONTENTS */}
            {analysis && (
              <>
                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-8 animate-in fade-in duration-150">
                    {/* Executive Summary */}
                    <div className="p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-2.5">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-mono">
                        Executive Dilemma Summary
                      </span>
                      <p className="text-base sm:text-lg text-slate-800 dark:text-slate-100 leading-relaxed font-medium">
                        {analysis.executiveSummary}
                      </p>
                    </div>

                    {/* Verdict Teaser Card */}
                    <div className="p-7 sm:p-8 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white rounded-3xl border-2 border-indigo-500/30 shadow-lg space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <Trophy className="w-5 h-5 text-amber-400" />
                          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 font-mono">
                            Tiebreaker Verdict
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm font-mono text-indigo-200 font-semibold">
                          Confidence: {analysis.verdict.confidenceLevel}
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                        {analysis.verdict.recommendedOption}
                      </h3>

                      <p className="text-sm sm:text-base text-slate-200 leading-relaxed italic">
                        "{analysis.verdict.coreTradeOff}"
                      </p>

                      <div className="pt-3 flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => setActiveTab('verdict')}
                          className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-white text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                        >
                          <span>Inspect Full Verdict & Action Plan</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setActiveTab('pros-cons')}
                          className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
                        >
                          View Pros & Cons
                        </button>
                      </div>
                    </div>

                    {/* Quick 3-Pillar Snapshot Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Pillar 1: Pros & Cons Count */}
                      <div
                        onClick={() => setActiveTab('pros-cons')}
                        className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-indigo-500 dark:hover:border-indigo-500 transition-all cursor-pointer space-y-3 group shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                              Pros & Cons
                            </h4>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          Structured evaluation across financial upside, career momentum, lifestyle sustainability, and downside risks.
                        </p>
                        <div className="pt-2 text-sm font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 font-mono">
                          <span>
                            {analysis.optionsAnalysis.reduce((sum, o) => sum + o.pros.length, 0)} Advantages
                          </span>
                          <span>·</span>
                          <span>
                            {analysis.optionsAnalysis.reduce((sum, o) => sum + o.cons.length, 0)} Drawbacks
                          </span>
                        </div>
                      </div>

                      {/* Pillar 2: Matrix Comparison */}
                      <div
                        onClick={() => setActiveTab('matrix')}
                        className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-indigo-500 dark:hover:border-indigo-500 transition-all cursor-pointer space-y-3 group shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                              Comparison Table
                            </h4>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          Side-by-side numerical scores with interactive weight sliders tailored to your personal priorities.
                        </p>
                        <div className="pt-2 text-sm font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
                          {analysis.comparisonMatrix.criteria.length} Criteria Evaluated
                        </div>
                      </div>

                      {/* Pillar 3: SWOT & Blind Spots */}
                      <div
                        onClick={() => setActiveTab('swot')}
                        className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-indigo-500 dark:hover:border-indigo-500 transition-all cursor-pointer space-y-3 group shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <Compass className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                              SWOT Quadrants
                            </h4>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          Strengths, weaknesses, market opportunities, and external threats across all competing paths.
                        </p>
                        <div className="pt-2 text-sm font-extrabold text-purple-600 dark:text-purple-400 font-mono">
                          {analysis.optionsAnalysis.length} Options Evaluated
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. PROS & CONS TAB */}
                {activeTab === 'pros-cons' && (
                  <ProsConsView
                    optionsAnalysis={analysis.optionsAnalysis}
                    onAddCustomProCon={handleAddCustomProCon}
                  />
                )}

                {/* 3. COMPARISON TABLE TAB */}
                {activeTab === 'matrix' && (
                  <ComparisonMatrixView
                    matrix={analysis.comparisonMatrix}
                    options={analysis.optionsAnalysis}
                    initialWeights={currentDecision.userWeights}
                    onWeightsChange={handleWeightsChange}
                  />
                )}

                {/* 4. SWOT ANALYSIS TAB */}
                {activeTab === 'swot' && <SwotView options={analysis.optionsAnalysis} />}

                {/* 5. BLIND SPOTS TAB */}
                {activeTab === 'blind-spots' && (
                  <BlindSpotsView
                    blindSpots={analysis.blindSpots}
                    options={analysis.optionsAnalysis}
                  />
                )}

                {/* 6. VERDICT TAB */}
                {activeTab === 'verdict' && (
                  <VerdictView
                    verdict={analysis.verdict}
                    options={analysis.optionsAnalysis}
                    onOpenCoinToss={() => setIsCoinTossOpen(true)}
                    onOpenDevilsAdvocate={(name) => setDevilsAdvocateTarget(name)}
                    decisionTitle={currentDecision.title}
                  />
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-7 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold text-slate-900 dark:text-slate-200">The Tiebreaker</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Unbiased Strategic Decision Matrix</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span>Pros & Cons</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Weighted Criteria</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>SWOT Matrix</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Pre-Mortem Analysis</span>
          </div>
        </div>
      </footer>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectDecision={(dec) => {
          setCurrentDecision(dec);
          setIsFormOpen(false);
          setActiveTab('overview');
        }}
        onDeleteDecision={handleDeleteDecision}
        onClearHistory={handleClearHistory}
        onLoadSample={handleLoadSample}
      />

      {/* Devil's Advocate Modal */}
      {devilsAdvocateTarget && currentDecision?.analysis && (
        <DevilsAdvocateModal
          isOpen={!!devilsAdvocateTarget}
          onClose={() => setDevilsAdvocateTarget(null)}
          decisionTitle={currentDecision.title}
          optionName={devilsAdvocateTarget}
          currentVerdict={currentDecision.analysis.verdict.recommendedOption}
        />
      )}

      {/* Coin Toss Simulator Modal */}
      {currentDecision && (
        <CoinTossModal
          isOpen={isCoinTossOpen}
          onClose={() => setIsCoinTossOpen(false)}
          optionA={currentDecision.options[0] || 'Option A'}
          optionB={currentDecision.options[1] || 'Option B'}
        />
      )}
    </div>
  );
}
