import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { generateHeuristicDecisionAnalysis } from './src/utils/heuristicDecisionEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization with required user-agent
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Helper with timeout and transient retry
async function callGeminiWithRetry<T>(fn: () => Promise<T>, timeoutMs = 7000): Promise<T> {
  const runWithTimeout = () => {
    let timer: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('AI generation timed out')), timeoutMs);
    });
    return Promise.race([fn(), timeoutPromise]).finally(() => clearTimeout(timer));
  };

  try {
    return await runWithTimeout();
  } catch (err: any) {
    const isTransient =
      err?.status === 503 ||
      err?.code === 503 ||
      err?.message?.includes('503') ||
      err?.message?.includes('high demand') ||
      err?.message?.includes('timed out');

    if (isTransient) {
      console.warn('Gemini request transient error or timeout, trying one quick retry...');
      await new Promise((r) => setTimeout(r, 800));
      return await runWithTimeout();
    }
    throw err;
  }
}

// API Endpoint: Analyze Decision
app.post('/api/analyze-decision', async (req, res) => {
  try {
    const { title, options, context, riskTolerance, priorities } = req.body;

    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        error: 'Please provide a decision title and at least two options.',
      });
    }

    const ai = getGeminiClient();

    const prompt = `
You are "The Tiebreaker", an elite decision scientist and strategic advisor.
Analyze the following decision dilemma thoroughly, objectively, and with psychological insight.

Decision Dilemma: "${title}"
Options:
${options.map((opt: string, i: number) => `${i + 1}. ${opt}`).join('\n')}

Additional Context: ${context || 'None provided'}
User Risk Tolerance: ${riskTolerance || 'Balanced'}
User Key Priorities / Constraints: ${priorities || 'None specified'}

Provide a structured, deeply analytical decision package containing:
1. Executive summary of the decision core challenge.
2. Structured Pros and Cons for each option, categorized (e.g. Financial, Career, Well-being, Execution, Long-term), with impact (High, Medium, Low) and whether it's short-term or long-term.
3. Comparison Matrix with 4 to 6 relevant criteria (e.g. Financial Upside, Peace of Mind, Growth Opportunity, Reversibility, Feasibility). For each criterion, assign an initial recommended weight (1 to 5) and scores (1 to 10) for each option.
4. Comprehensive SWOT analysis for each option (Strengths, Weaknesses, Opportunities, Threats).
5. Psychological Blind Spots & Pre-Mortem:
   - Hidden assumptions or cognitive biases (e.g. sunk cost, status quo bias, grass-is-greener syndrome).
   - Pre-mortem scenario for the top choices: "If this failed in 12 months, this is the most likely cause".
6. The Tiebreaker Verdict:
   - Recommended winner or best path forward based on the constraints.
   - Confidence level (High, Moderate, Close Call).
   - "The Core Trade-off": The fundamental single sentence trade-off the user is making.
   - 3 actionable next steps or low-risk reversible experiments to validate before committing.
`;

    const response = await callGeminiWithRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction:
          'You are The Tiebreaker, an incisive strategic consultant. Deliver concise, high-density, high-impact decision analysis. Keep points punchy and direct, 1-2 sentences per point, avoiding verbose filler.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: {
              type: Type.STRING,
              description: 'Clear, compelling 2-3 sentence summary of the core dilemma.',
            },
            optionsAnalysis: {
              type: Type.ARRAY,
              description: 'Detailed analysis for each option.',
              items: {
                type: Type.OBJECT,
                properties: {
                  optionName: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  pros: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        point: { type: Type.STRING },
                        category: { type: Type.STRING },
                        impact: { type: Type.STRING, description: 'High, Medium, or Low' },
                        timeHorizon: { type: Type.STRING, description: 'Short-term or Long-term' },
                      },
                      required: ['point', 'category', 'impact', 'timeHorizon'],
                    },
                  },
                  cons: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        point: { type: Type.STRING },
                        category: { type: Type.STRING },
                        impact: { type: Type.STRING, description: 'High, Medium, or Low' },
                        timeHorizon: { type: Type.STRING, description: 'Short-term or Long-term' },
                      },
                      required: ['point', 'category', 'impact', 'timeHorizon'],
                    },
                  },
                  swot: {
                    type: Type.OBJECT,
                    properties: {
                      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                      opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                      threats: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['strengths', 'weaknesses', 'opportunities', 'threats'],
                  },
                  preMortem: {
                    type: Type.STRING,
                    description: 'Specific realistic failure scenario in 12 months and how to prevent it.',
                  },
                },
                required: ['optionName', 'summary', 'pros', 'cons', 'swot', 'preMortem'],
              },
            },
            comparisonMatrix: {
              type: Type.OBJECT,
              properties: {
                criteria: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      defaultWeight: { type: Type.NUMBER, description: '1 to 5 scale' },
                      optionScores: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            optionName: { type: Type.STRING },
                            score: { type: Type.NUMBER, description: 'Score out of 10' },
                            reasoning: { type: Type.STRING },
                          },
                          required: ['optionName', 'score', 'reasoning'],
                        },
                      },
                    },
                    required: ['id', 'name', 'description', 'defaultWeight', 'optionScores'],
                  },
                },
              },
              required: ['criteria'],
            },
            blindSpots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  biasType: { type: Type.STRING },
                  observation: { type: Type.STRING },
                  reframingQuestion: { type: Type.STRING },
                },
                required: ['title', 'biasType', 'observation', 'reframingQuestion'],
              },
            },
            verdict: {
              type: Type.OBJECT,
              properties: {
                recommendedOption: { type: Type.STRING },
                confidenceLevel: { type: Type.STRING, description: 'High, Moderate, or Close Call' },
                coreTradeOff: { type: Type.STRING },
                rationale: { type: Type.STRING },
                actionableNextSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                reversibleTest: {
                  type: Type.STRING,
                  description: 'A 24-48 hour test or low-risk experiment to validate before locking in.',
                },
              },
              required: [
                'recommendedOption',
                'confidenceLevel',
                'coreTradeOff',
                'rationale',
                'actionableNextSteps',
                'reversibleTest',
              ],
            },
          },
          required: ['executiveSummary', 'optionsAnalysis', 'comparisonMatrix', 'blindSpots', 'verdict'],
        },
      },
    }));

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Gemini returned an empty response.');
    }

    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.warn('Gemini analysis failed or unavailable, falling back to heuristic decision engine:', error?.message || error);
    try {
      const { title, options, context, riskTolerance, priorities } = req.body;
      const fallbackAnalysis = generateHeuristicDecisionAnalysis({
        title,
        options,
        context,
        riskTolerance,
        priorities,
      });
      res.json(fallbackAnalysis);
    } catch (fallbackError: any) {
      console.error('Fallback generation error:', fallbackError);
      res.status(400).json({
        error: 'Unable to analyze decision. Please check your options and retry.',
      });
    }
  }
});

// API Endpoint: Devil's Advocate Deep-Dive
app.post('/api/devils-advocate', async (req, res) => {
  try {
    const { title, optionName, currentVerdict } = req.body;
    if (!title || !optionName) {
      return res.status(400).json({ error: 'Title and optionName are required.' });
    }

    const ai = getGeminiClient();
    const prompt = `
You are playing Devil's Advocate on this decision: "${title}".
The user is leaning towards or considering: "${optionName}".
Current context or verdict: "${currentVerdict || 'None'}".

Provide a rigorous, unflinching critique challenging this choice:
1. 3 sharp counter-arguments why choosing "${optionName}" might be a mistake.
2. The hidden costs and psychological traps.
3. 2 stress-testing questions the user must answer honestly before proceeding.
`;

    const response = await callGeminiWithRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          systemInstruction:
            "You are an incisive Devil's Advocate. Deliver punchy, high-impact counter-arguments. Avoid filler prose.",
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hardTruths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              hiddenCosts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              stressTestQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              conclusion: { type: Type.STRING },
            },
            required: ['hardTruths', 'hiddenCosts', 'stressTestQuestions', 'conclusion'],
          },
        },
      })
    );

    const data = JSON.parse(response.text || '{}');
    res.json(data);
  } catch (error: any) {
    console.warn("Gemini devil's advocate failed or unavailable, providing structured critique:", error?.message || error);
    const { optionName } = req.body;
    res.json({
      hardTruths: [
        `Choosing "${optionName}" may simply substitute one set of familiar challenges with a set of unproven, novel problems.`,
        `You might be over-indexing on short-term relief rather than compounding 3-year outcomes.`,
        `Every upside comes with an unseen operational or emotional maintenance cost.`,
      ],
      hiddenCosts: [
        `Emotional switching energy required to build new routines from scratch.`,
        `Opportunity cost of forfeiting alternative paths that cannot be pursued concurrently.`,
      ],
      stressTestQuestions: [
        `If this choice produces zero external recognition or applause, would you still be proud of making it?`,
        `What is the single worst realistic consequence of this choice, and can you tolerate it for 6 months?`,
      ],
      conclusion: `Ensure you are choosing "${optionName}" out of authentic conviction rather than escaping temporary discomfort.`,
    });
  }
});

// Dev server with Vite middleware or production static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`The Tiebreaker server running on http://localhost:${port}`);
  });
}

startServer();
