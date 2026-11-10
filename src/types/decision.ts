export interface ProConItem {
  point: string;
  category: string;
  impact: 'High' | 'Medium' | 'Low';
  timeHorizon: 'Short-term' | 'Long-term';
  custom?: boolean;
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface OptionAnalysis {
  optionName: string;
  summary: string;
  pros: ProConItem[];
  cons: ProConItem[];
  swot: SWOTAnalysis;
  preMortem: string;
}

export interface OptionScore {
  optionName: string;
  score: number; // 1 to 10
  reasoning: string;
}

export interface Criterion {
  id: string;
  name: string;
  description: string;
  defaultWeight: number; // 1 to 5
  optionScores: OptionScore[];
}

export interface ComparisonMatrix {
  criteria: Criterion[];
}

export interface BlindSpot {
  title: string;
  biasType: string;
  observation: string;
  reframingQuestion: string;
}

export interface Verdict {
  recommendedOption: string;
  confidenceLevel: 'High' | 'Moderate' | 'Close Call';
  coreTradeOff: string;
  rationale: string;
  actionableNextSteps: string[];
  reversibleTest: string;
}

export interface DecisionAnalysisResult {
  executiveSummary: string;
  optionsAnalysis: OptionAnalysis[];
  comparisonMatrix: ComparisonMatrix;
  blindSpots: BlindSpot[];
  verdict: Verdict;
}

export interface DecisionRecord {
  id: string;
  timestamp: number;
  title: string;
  options: string[];
  context?: string;
  riskTolerance: 'Conservative' | 'Balanced' | 'Aggressive';
  priorities?: string;
  analysis?: DecisionAnalysisResult;
  userWeights?: Record<string, number>;
}

export interface DevilsAdvocateData {
  hardTruths: string[];
  hiddenCosts: string[];
  stressTestQuestions: string[];
  conclusion: string;
}
