import { DecisionAnalysisResult, OptionAnalysis, ProConItem, Criterion } from '../types/decision';

export function generateHeuristicDecisionAnalysis(params: {
  title: string;
  options: string[];
  context?: string;
  riskTolerance: 'Conservative' | 'Balanced' | 'Aggressive';
  priorities?: string;
}): DecisionAnalysisResult {
  const { title, options, context = '', riskTolerance = 'Balanced', priorities = '' } = params;

  // Determine key themes from title and priorities
  const lowerTitle = (title + ' ' + context + ' ' + priorities).toLowerCase();
  const isCareer = lowerTitle.includes('job') || lowerTitle.includes('offer') || lowerTitle.includes('career') || lowerTitle.includes('salary') || lowerTitle.includes('company');
  const isFinance = lowerTitle.includes('buy') || lowerTitle.includes('rent') || lowerTitle.includes('invest') || lowerTitle.includes('house') || lowerTitle.includes('car') || lowerTitle.includes('money');
  const isTech = lowerTitle.includes('tech') || lowerTitle.includes('code') || lowerTitle.includes('monolith') || lowerTitle.includes('microservice') || lowerTitle.includes('architecture') || lowerTitle.includes('migrate');

  // Build Option Analyses
  const optionsAnalysis: OptionAnalysis[] = options.map((optionName, idx) => {
    const isFirst = idx === 0;

    let pros: ProConItem[] = [];
    let cons: ProConItem[] = [];

    if (isCareer) {
      if (isFirst) {
        pros = [
          { point: 'Immediate new growth curve and skill expansion in a fresh environment.', category: 'Professional Growth', impact: 'High', timeHorizon: 'Short-term' },
          { point: 'Higher potential ceiling for leadership scope and career progression.', category: 'Career Momentum', impact: 'High', timeHorizon: 'Long-term' },
          { point: 'Breaks stagnation and provides energizing change of routine.', category: 'Psychological', impact: 'Medium', timeHorizon: 'Short-term' },
        ];
        cons = [
          { point: 'Ramping-up stress, social proof reset, and new team onboarding friction.', category: 'Execution', impact: 'Medium', timeHorizon: 'Short-term' },
          { point: 'Uncertainty regarding actual day-to-day team culture vs interview pitch.', category: 'Cultural Risk', impact: 'High', timeHorizon: 'Short-term' },
        ];
      } else {
        pros = [
          { point: 'Established institutional credibility, proven performance history, and safety buffer.', category: 'Stability', impact: 'High', timeHorizon: 'Short-term' },
          { point: 'Predictable workflows and lower day-to-day anxiety.', category: 'Well-being', impact: 'Medium', timeHorizon: 'Short-term' },
          { point: 'Preserves existing relationships and unvested incentives or seniority.', category: 'Retention', impact: 'High', timeHorizon: 'Long-term' },
        ];
        cons = [
          { point: 'Risk of career inertia and skill plateauing if challenges remain static.', category: 'Growth Cap', impact: 'High', timeHorizon: 'Long-term' },
          { point: 'Lingering regret regarding what could have been achieved with bold action.', category: 'Psychological', impact: 'High', timeHorizon: 'Long-term' },
        ];
      }
    } else if (isFinance) {
      if (isFirst) {
        pros = [
          { point: 'Direct asset equity accumulation and long-term tangible wealth foundation.', category: 'Wealth Building', impact: 'High', timeHorizon: 'Long-term' },
          { point: 'Psychological stability, control over personal living environment, and pride of ownership.', category: 'Life Quality', impact: 'High', timeHorizon: 'Short-term' },
        ];
        cons = [
          { point: 'High capital illiquidity, closing transaction costs, and maintenance liability.', category: 'Financial Flexibility', impact: 'High', timeHorizon: 'Short-term' },
          { point: 'Geographic lock-in reduces agility to pursue unexpected opportunities.', category: 'Flexibility', impact: 'Medium', timeHorizon: 'Long-term' },
        ];
      } else {
        pros = [
          { point: 'Maximum financial liquidity: capital remains available in liquid high-yield assets.', category: 'Liquidity', impact: 'High', timeHorizon: 'Short-term' },
          { point: 'Zero maintenance surprise costs, zero property tax increases, low friction to relocate.', category: 'Peace of Mind', impact: 'Medium', timeHorizon: 'Short-term' },
        ];
        cons = [
          { point: 'Zero equity accumulation from monthly housing expenditures.', category: 'Opportunity Cost', impact: 'High', timeHorizon: 'Long-term' },
          { point: 'Exposure to inflation or landlord decisions upon lease renewal.', category: 'Predictability', impact: 'Medium', timeHorizon: 'Long-term' },
        ];
      }
    } else {
      // General Strategic Framework
      pros = [
        { point: `High alignment with active pursuit of forward progress for: "${optionName}".`, category: 'Strategic Upside', impact: 'High', timeHorizon: 'Long-term' },
        { point: 'Directly addresses the primary tension motivating this decision.', category: 'Problem Resolution', impact: 'High', timeHorizon: 'Short-term' },
        { point: 'Clear path to tangible measurable feedback within 30-90 days.', category: 'Execution', impact: 'Medium', timeHorizon: 'Short-term' },
      ];
      cons = [
        { point: 'Requires meaningful initial energy commitment and transition effort.', category: 'Switching Cost', impact: 'Medium', timeHorizon: 'Short-term' },
        { point: 'Forecloses alternative paths or opportunity costs associated with other choices.', category: 'Trade-off', impact: 'High', timeHorizon: 'Long-term' },
      ];
    }

    return {
      optionName,
      summary: `Comprehensive evaluation of "${optionName}" focusing on upside sustainability, switching costs, and risk mitigation.`,
      pros,
      cons,
      swot: {
        strengths: [
          `Clear conceptual focus directly targeting core priorities`,
          `High degree of personal autonomy and intentional direction`,
          `Strong foundational advantages over passive inaction`,
        ],
        weaknesses: [
          `Requires disciplined execution during the initial 90 days`,
          `Potential friction during the transitional adjustment phase`,
        ],
        opportunities: [
          `Unlocks compounding secondary benefits once baseline is stabilized`,
          `Positions you proactively rather than reactively responding to circumstances`,
        ],
        threats: [
          `Unanticipated external macro shifts or unexpected dependency delays`,
          `Premature fatigue if initial momentum is not sustained with clear milestones`,
        ],
      },
      preMortem: `If choosing "${optionName}" leads to regret in 12 months, the root cause will likely be failing to set measurable boundaries early. Protect against this by establishing a firm 90-day check-in with defined success criteria.`,
    };
  });

  // Criteria & Scoring
  const criteria: Criterion[] = [
    {
      id: 'crit-upside',
      name: 'Long-Term Upside & Compounding',
      description: 'Potential for significant lasting benefits over a 2 to 5 year horizon.',
      defaultWeight: riskTolerance === 'Aggressive' ? 5 : 4,
      optionScores: options.map((opt, i) => ({
        optionName: opt,
        score: i === 0 ? 8.8 : 7.2,
        reasoning: i === 0 ? 'Higher proactive momentum and upward ceiling.' : 'Consistent baseline with lower standard deviation.',
      })),
    },
    {
      id: 'crit-peace',
      name: 'Peace of Mind & Mental Well-being',
      description: 'Minimizes day-to-day stress, anxiety, and burnout risk.',
      defaultWeight: 4,
      optionScores: options.map((opt, i) => ({
        optionName: opt,
        score: i === 0 ? (riskTolerance === 'Conservative' ? 6.5 : 7.8) : 8.0,
        reasoning: 'Evaluated against operational friction and emotional clarity.',
      })),
    },
    {
      id: 'crit-reversibility',
      name: 'Reversibility (Two-Way Door Framework)',
      description: 'How easily this choice can be modified or pivoted if conditions change.',
      defaultWeight: riskTolerance === 'Conservative' ? 5 : 3,
      optionScores: options.map((opt, i) => ({
        optionName: opt,
        score: i === 0 ? 7.5 : 8.2,
        reasoning: 'Degree of lock-in and liquidity of time, capital, and reputation.',
      })),
    },
    {
      id: 'crit-regret',
      name: 'Regret Minimization (Bezos Heuristic)',
      description: 'Looking back at age 80, which path minimizes chronic wondering "what if"?',
      defaultWeight: 5,
      optionScores: options.map((opt, i) => ({
        optionName: opt,
        score: i === 0 ? 9.0 : 5.8,
        reasoning: i === 0 ? 'Bold action rarely produces long-term psychological regret compared to safe inaction.' : 'Safe path carries risk of silent opportunity cost.',
      })),
    },
    {
      id: 'crit-execution',
      name: 'Feasibility & Execution Ease',
      description: 'Pragmatic ability to execute this choice with your current bandwidth.',
      defaultWeight: 3,
      optionScores: options.map((opt) => ({
        optionName: opt,
        score: 7.8,
        reasoning: 'Realistic implementation requirements within existing constraints.',
      })),
    },
  ];

  // Pick winner based on risk preference
  const winnerIndex = riskTolerance === 'Conservative' && options.length > 1 ? 1 : 0;
  const recommendedOption = options[winnerIndex] || options[0];

  return {
    executiveSummary: `This dilemma pivots on the tension between forward momentum and protective stability. When balancing ${riskTolerance.toLowerCase()} risk parameters, the decisive factor is not merely avoiding downside, but preventing compounding opportunity cost over the next 12 to 36 months.`,
    optionsAnalysis,
    comparisonMatrix: {
      criteria,
    },
    blindSpots: [
      {
        title: 'Status Quo & Endowment Effect',
        biasType: 'Loss Aversion',
        observation: 'Humans routinely overweight the discomfort of making an active change while underestimating the silent, compounding cost of staying in place.',
        reframingQuestion: 'If neither option was your current reality and you were deciding from a blank slate today, which would you pursue?',
      },
      {
        title: 'The Grass-Is-Greener Trap',
        biasType: 'Projection Bias',
        observation: 'It is natural to imagine the chosen path free of mundane problems, but every path simply exchanges one set of problems for another.',
        reframingQuestion: 'Which set of problems and daily hassles are you genuinely more excited to solve?',
      },
    ],
    verdict: {
      recommendedOption,
      confidenceLevel: riskTolerance === 'Balanced' ? 'High' : 'Moderate',
      coreTradeOff: `You are choosing whether to trade short-term familiar comfort for higher asymmetrical growth and intentional agency.`,
      rationale: `Based on your ${riskTolerance.toLowerCase()} risk profile, "${recommendedOption}" offers the strongest ratio of long-term upside to manageable downside. The regret minimization framework strongly favors proactive agency over passive drift, provided you establish clear 90-day guardrails.`,
      actionableNextSteps: [
        'Document your non-negotiable boundaries (financial, time, emotional) in writing before communicating your choice.',
        'Schedule a concrete 30-day review date on your personal calendar to evaluate progress objectively.',
        'Communicate your decision with conviction to key stakeholders, removing lingering ambiguity.',
      ],
      reversibleTest: 'The 48-Hour Mental Commitment Test: Live the next 48 hours completely as if you have chosen this option. Notice whether you experience deep relief or lingering dread.',
    },
  };
}
