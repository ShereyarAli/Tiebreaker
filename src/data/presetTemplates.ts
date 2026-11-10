import { DecisionRecord } from '../types/decision';

export interface DecisionTemplate {
  id: string;
  category: string;
  title: string;
  options: string[];
  context: string;
  riskTolerance: 'Conservative' | 'Balanced' | 'Aggressive';
  priorities: string;
}

export const PRESET_TEMPLATES: DecisionTemplate[] = [
  {
    id: 'career-move',
    category: 'Career & Life',
    title: 'Accept early-stage AI startup Offer or stay at stable Big Tech company?',
    options: [
      'Accept Head of Product at 25-person AI Startup ($165k base + 1.2% equity)',
      'Stay as Senior PM at Tier-1 Tech Firm ($235k cash comp + RSUs)',
      'Negotiate Internal Transfer to newly formed GenAI incubation team',
    ],
    context:
      'Current job feels comfortable but stagnant. Startup has 18 months runway and high traction, but requires 55+ hrs/week and potential relocation. I have 6 months emergency savings.',
    riskTolerance: 'Balanced',
    priorities: 'Career acceleration, learning curve, equity upside, avoiding regret, work-life sustainability',
  },
  {
    id: 'housing-buy-rent',
    category: 'Personal Finance',
    title: 'Buy a 2-bedroom townhouse with a 6.2% mortgage vs keep renting and invest in index funds?',
    options: [
      'Buy Townhouse for $620k with 20% down ($3,800/mo all-in payment)',
      'Continue Renting 2-bed apartment for $2,400/mo and dollar-cost average difference into index funds',
    ],
    context:
      'We plan to live in this city for at least 4-5 years. Property values have plateaued, HOA fees are $320/mo. Renting gives flexibility if one of us changes jobs.',
    riskTolerance: 'Conservative',
    priorities: 'Long-term net worth, housing stability, geographic flexibility, maintenance hassle',
  },
  {
    id: 'tech-architecture',
    category: 'Engineering & Tech',
    title: 'Migrate core legacy monolith to event-driven microservices or refactor into modular monolith?',
    options: [
      'Deconstruct into Kubernetes-based event-driven microservices with Kafka',
      'Refactor into strict modular monolith with isolated domain modules and unified DB',
    ],
    context:
      'Team of 14 backend engineers. Monolith deploy times are up to 35 mins. We have occasional database lock contention during marketing sales spikes.',
    riskTolerance: 'Balanced',
    priorities: 'Developer velocity, operational complexity, cloud infrastructure cost, system resilience',
  },
  {
    id: 'relocation-dilemma',
    category: 'Lifestyle',
    title: 'Relocate to London for European headquarters role vs stay in current city close to family?',
    options: [
      'Move to London on 2-year expat contract with housing stipend',
      'Decline relocation and pursue remote senior track from current city',
    ],
    context:
      'Partner can work remotely with minor time-zone adjustment. Elderly parents are 45 minutes away currently. Living abroad has been a bucket-list aspiration.',
    riskTolerance: 'Balanced',
    priorities: 'Family closeness, international life experience, partner happiness, financial savings rate',
  },
];
