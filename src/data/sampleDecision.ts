import { DecisionRecord } from '../types/decision';

export const SAMPLE_DECISION: DecisionRecord = {
  id: 'sample-career-dilemma',
  timestamp: Date.now() - 3600000 * 4,
  title: 'Should I accept the Head of AI Product offer at a Series A startup or stay as Senior PM at Big Tech?',
  options: [
    'Accept Head of AI Product at 25-person Startup ($165k base + 1.2% equity)',
    'Stay as Senior PM at Tier-1 Tech Firm ($235k cash comp + RSUs)',
    'Negotiate Internal Transfer to newly formed GenAI incubation team',
  ],
  context:
    'Current job is stable but growth has flattened. Startup has 18 months runway and top-tier VC backing. I have 6 months of savings and no debt.',
  riskTolerance: 'Balanced',
  priorities: 'Career acceleration, learning curve, avoiding future regret, long-term equity wealth',
  analysis: {
    executiveSummary:
      'This decision balances guaranteed high-earning stability against asymmetrical upside and leadership ownership. The primary tension is whether you are trading 2-3 years of comfortable career predictability for high-velocity domain leadership in generative AI.',
    optionsAnalysis: [
      {
        optionName: 'Accept Head of AI Product at 25-person Startup ($165k base + 1.2% equity)',
        summary: 'High-upside career leap with executive scope, steep learning curve, but execution and market risk.',
        pros: [
          {
            point: 'Direct ownership of product roadmap, hiring, and board-level strategy.',
            category: 'Leadership & Career',
            impact: 'High',
            timeHorizon: 'Long-term',
          },
          {
            point: '1.2% equity provides life-changing financial upside if company reaches $200M+ valuation.',
            category: 'Financial',
            impact: 'High',
            timeHorizon: 'Long-term',
          },
          {
            point: 'Accelerated skill compression: learn in 18 months what takes 4 years in enterprise.',
            category: 'Growth',
            impact: 'High',
            timeHorizon: 'Short-term',
          },
        ],
        cons: [
          {
            point: '$70,000 annual cash compensation haircut reduces monthly discretionary buffer.',
            category: 'Financial',
            impact: 'High',
            timeHorizon: 'Short-term',
          },
          {
            point: 'Startup runway risk: will need to fundraise in 14-16 months under uncertain macro conditions.',
            category: 'Risk',
            impact: 'High',
            timeHorizon: 'Long-term',
          },
          {
            point: 'Expected 55-60 hour work weeks will strain personal downtime and exercise routines.',
            category: 'Well-being',
            impact: 'Medium',
            timeHorizon: 'Short-term',
          },
        ],
        swot: {
          strengths: [
            'Instant executive title and direct report management',
            'Full autonomy without layers of corporate committee approvals',
            'Deep insider positioning in cutting-edge AI product commercialization',
          ],
          weaknesses: [
            'Immature infrastructure, sparse engineering support, unproven product-market fit',
            'Substantial immediate cash flow reduction',
          ],
          opportunities: [
            'Positioning for future C-suite roles (CPO/VP) or founding your own venture',
            'High industry prestige if company scales or gets acquired',
          ],
          threats: [
            'Market consolidation by incumbent tech giants offering free native AI features',
            'Down-round risk or dilution during Series B financing',
          ],
        },
        preMortem:
          'In 12 months, the company burned through runway trying to build features before proving retention. Prevent by: Negotiating a clear 90-day retention North Star before signing, and ensuring founder alignment on disciplined product discovery.',
      },
      {
        optionName: 'Stay as Senior PM at Tier-1 Tech Firm ($235k cash comp + RSUs)',
        summary: 'Maximum financial security, predictable rhythm, high brand pedigree, but risk of creative stagnation.',
        pros: [
          {
            point: 'Premier guaranteed cash and liquid stock vesting with zero personal balance sheet risk.',
            category: 'Financial',
            impact: 'High',
            timeHorizon: 'Short-term',
          },
          {
            point: 'Predictable 38-42 hour work weeks supporting hobbies, fitness, and family relationships.',
            category: 'Well-being',
            impact: 'High',
            timeHorizon: 'Short-term',
          },
          {
            point: 'Tier-1 brand remains a permanent, durable stamp on your resume worldwide.',
            category: 'Pedigree',
            impact: 'Medium',
            timeHorizon: 'Long-term',
          },
        ],
        cons: [
          {
            point: 'Slower promotional velocity due to corporate leveling bands and political overhead.',
            category: 'Career',
            impact: 'High',
            timeHorizon: 'Long-term',
          },
          {
            point: 'High psychological cost of feeling sidelined while peers build frontier AI products.',
            category: 'Psychological',
            impact: 'High',
            timeHorizon: 'Long-term',
          },
          {
            point: 'Work consists largely of consensus building and slide preparation rather than shipping.',
            category: 'Job Satisfaction',
            impact: 'Medium',
            timeHorizon: 'Short-term',
          },
        ],
        swot: {
          strengths: [
            'Immense distribution, existing million-user customer base, enterprise resources',
            'High compensation certainty and top-tier benefits package',
          ],
          weaknesses: [
            'Bureaucratic red tape, sluggish deployment velocity, siloed domain scopes',
          ],
          opportunities: [
            'Capitalize on massive unvested 401k/stock while passively scouting advisory roles',
          ],
          threats: [
            'Skill obsolescence if enterprise continues using legacy workflows',
            'Periodic corporate reorganizations that shuffle leadership without warning',
          ],
        },
        preMortem:
          'In 12 months, you stayed comfortable, received a standard 3% raise, but watched the AI wave solidify and now feel 2 years behind technical peers. Prevent by: Setting a firm 6-month deadline with an accountability mentor to either secure significant internal AI scope or exit.',
      },
      {
        optionName: 'Negotiate Internal Transfer to newly formed GenAI incubation team',
        summary: 'Compromise path: retain cash compensation and corporate stability while gaining frontier tech exposure.',
        pros: [
          {
            point: 'Maintain high $235k total compensation package with zero equity cliff risk.',
            category: 'Financial',
            impact: 'High',
            timeHorizon: 'Short-term',
          },
          {
            point: 'Gain direct hands-on experience with modern LLM architectures and massive scale.',
            category: 'Learning',
            impact: 'High',
            timeHorizon: 'Short-term',
          },
          {
            point: 'Reversible move: if the incubation initiative gets scrapped, you retain internal status.',
            category: 'Risk Mitigation',
            impact: 'High',
            timeHorizon: 'Long-term',
          },
        ],
        cons: [
          {
            point: 'Internal political transfer friction and dependency on current manager release approval.',
            category: 'Execution',
            impact: 'Medium',
            timeHorizon: 'Short-term',
          },
          {
            point: 'You will not hold an executive title or true equity ownership.',
            category: 'Career Cap',
            impact: 'Medium',
            timeHorizon: 'Long-term',
          },
        ],
        swot: {
          strengths: [
            'Backed by massive enterprise compute budget and proprietary enterprise training datasets',
            'Zero financial compromise or downside risk',
          ],
          weaknesses: [
            'Still subject to corporate legal, PR, and security governance delays before launching',
          ],
          opportunities: [
            'Can publish technical case studies and lead a high-profile flagship initiative internally',
          ],
          threats: [
            'Corporate priority shifts could cancel the incubation initiative during mid-year budget reallocations',
          ],
        },
        preMortem:
          'In 12 months, the incubation team became mired in compliance reviews and never released a public feature. Prevent by: Securing explicit sponsorship from a VP who guarantees fast-track deployment guidelines before agreeing to the transfer.',
      },
    ],
    comparisonMatrix: {
      criteria: [
        {
          id: 'crit-upside',
          name: 'Long-term Financial Upside',
          description: 'Potential for significant wealth accumulation over 3-7 years.',
          defaultWeight: 5,
          optionScores: [
            { optionName: 'Accept Head of AI Product at 25-person Startup ($165k base + 1.2% equity)', score: 9, reasoning: '1.2% equity in a breakout winner dwarfs standard salary savings.' },
            { optionName: 'Stay as Senior PM at Tier-1 Tech Firm ($235k cash comp + RSUs)', score: 6, reasoning: 'Guaranteed high baseline, but capped without massive stock doubling.' },
            { optionName: 'Negotiate Internal Transfer to newly formed GenAI incubation team', score: 6.5, reasoning: 'Solid compensation with strong internal promotion path.' },
          ],
        },
        {
          id: 'crit-learning',
          name: 'Learning Velocity & Autonomy',
          description: 'Speed of skill acquisition and freedom from bureaucratic gatekeeping.',
          defaultWeight: 5,
          optionScores: [
            { optionName: 'Accept Head of AI Product at 25-person Startup ($165k base + 1.2% equity)', score: 9.5, reasoning: 'Unfiltered responsibility across strategy, hiring, and execution.' },
            { optionName: 'Stay as Senior PM at Tier-1 Tech Firm ($235k cash comp + RSUs)', score: 4, reasoning: 'Heavy political alignment and committee decision-making.' },
            { optionName: 'Negotiate Internal Transfer to newly formed GenAI incubation team', score: 7.5, reasoning: 'Cutting-edge tech domain, but still governed by corporate processes.' },
          ],
        },
        {
          id: 'crit-sustainability',
          name: 'Personal Well-being & Balance',
          description: 'Mental health, reasonable working hours, and low burnout probability.',
          defaultWeight: 3,
          optionScores: [
            { optionName: 'Accept Head of AI Product at 25-person Startup ($165k base + 1.2% equity)', score: 4.5, reasoning: 'Intense pace, constant urgency, and fundraising demands.' },
            { optionName: 'Stay as Senior PM at Tier-1 Tech Firm ($235k cash comp + RSUs)', score: 8.5, reasoning: 'Predictable calendar, generous PTO, and established team support.' },
            { optionName: 'Negotiate Internal Transfer to newly formed GenAI incubation team', score: 6.5, reasoning: 'Moderately demanding launch cycle, but standard corporate guardrails.' },
          ],
        },
        {
          id: 'crit-reversibility',
          name: 'Reversibility & Downside Floor',
          description: 'How easily you can undo or pivot if the choice underperforms.',
          defaultWeight: 4,
          optionScores: [
            { optionName: 'Accept Head of AI Product at 25-person Startup ($165k base + 1.2% equity)', score: 7, reasoning: 'If startup fails, you will easily land another Senior or Director role in Big Tech.' },
            { optionName: 'Stay as Senior PM at Tier-1 Tech Firm ($235k cash comp + RSUs)', score: 8, reasoning: 'Very high floor, though staying too long risks inertia.' },
            { optionName: 'Negotiate Internal Transfer to newly formed GenAI incubation team', score: 8.5, reasoning: 'Near 100% reversible internally with intact employment continuity.' },
          ],
        },
        {
          id: 'crit-regret',
          name: 'Regret Minimization (Jeff Bezos Framework)',
          description: 'Looking back at age 80, which option will you regret not pursuing?',
          defaultWeight: 5,
          optionScores: [
            { optionName: 'Accept Head of AI Product at 25-person Startup ($165k base + 1.2% equity)', score: 9.2, reasoning: 'You will never wonder "what if" regarding building in the AI wave.' },
            { optionName: 'Stay as Senior PM at Tier-1 Tech Firm ($235k cash comp + RSUs)', score: 3.5, reasoning: 'High risk of chronic lingering regret about playing it too safe.' },
            { optionName: 'Negotiate Internal Transfer to newly formed GenAI incubation team', score: 6.8, reasoning: 'Good hedge, but may still wonder what real startup ownership feels like.' },
          ],
        },
      ],
    },
    blindSpots: [
      {
        title: 'Status Quo Endowment Effect',
        biasType: 'Loss Aversion',
        observation: 'You are naturally overvaluing the $70k cash difference because giving up guaranteed money feels twice as painful as gaining hypothetical equity.',
        reframingQuestion: 'If you were currently unemployed and received both offers simultaneously, would you genuinely pick the corporate role?',
      },
      {
        title: 'The "Incubation" Mirage',
        biasType: 'Compromise Trap',
        observation: 'Option 3 feels safe because it compromises between both worlds, but corporate incubation units are frequently defunded when enterprise priorities shift.',
        reframingQuestion: 'Does the internal team have dedicated GPU budget and independent deployment authority, or are they dependent on core infra approval?',
      },
    ],
    verdict: {
      recommendedOption: 'Accept Head of AI Product at 25-person Startup ($165k base + 1.2% equity)',
      confidenceLevel: 'High',
      coreTradeOff: 'You are trading $70k in short-term cash comfort for 3x career acceleration and equity ownership during the most consequential tech platform shift in two decades.',
      rationale:
        'With 6 months of liquid emergency reserves, zero debt, and high tech hiring demand as a backstop, your downside is strictly capped while your professional trajectory and learning curve are maximized. Even in the worst-case scenario where the startup folds in 18 months, your market value as a former Head of Product who built AI systems will exceed your current leveling.',
      actionableNextSteps: [
        'Ask the startup CEO for their latest cap table summary, monthly burn rate, and runway calculations.',
        'Request 30 minutes with 2 current senior engineers to assess technical velocity and founder culture.',
        'Propose an acceleration clause in your equity agreement (e.g. single-trigger or double-trigger vesting acceleration upon change of control).',
      ],
      reversibleTest:
        'The 48-Hour Commit Test: Tell yourself tonight that you have officially declined the startup and decided to stay at Big Tech for the next 2 years. Pay close attention to whether you feel relief or a sinking feeling of resignation.',
    },
  },
};
