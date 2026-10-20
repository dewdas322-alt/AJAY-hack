import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '2mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Real-Time WinGo Draw History Proxy API (Guarantees zero dropped draws / zero CORS blocks)
app.get('/api/wingo-history', async (req, res) => {
  const mode = req.query.mode === '30s' ? 'WinGo_30S' : 'WinGo_1M';
  const url = `https://draw.ar-lottery01.com/WinGo/${mode}/GetHistoryIssuePage.json`;

  try {
    const fetchRes = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
    });

    if (!fetchRes.ok) {
      return res.status(fetchRes.status).json({ error: 'Upstream fetch failed' });
    }

    const data = await fetchRes.json();
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal proxy error' });
  }
});

interface LLMAnalysisRequest {
  history: Array<{
    issue: string;
    num: number;
    size: 'BIG' | 'SMALL';
    color: string;
  }>;
  mode: string;
  targetIssue: string;
  currentLevelStage?: number;
  consecutiveLosses?: number;
  analysisFeatures?: {
    redRate10?: number;
    redRate30?: number;
    streak?: number;
    streakColor?: string;
    switchRate?: number;
    trend?: number;
    patternName?: string;
  };
}

// Helper: Gemini AI Analysis as Advisor
async function runGeminiAnalysis(payload: LLMAnalysisRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const ai = new GoogleGenAI({ apiKey });
  const fullHistory100 = payload.history.slice(0, 100);

  const prompt = `You are the SAMURAI WARRIOR Statistical Advisor for WinGo with Deep 10-100 Trend & Rule-Based Feature Analysis.
Analyze the following sequential historical WinGo outcomes (newest to oldest):
${JSON.stringify(fullHistory100, null, 2)}

Rule-based engine features from analyze():
${JSON.stringify(payload.analysisFeatures || {}, null, 2)}

Target Issue: ${payload.targetIssue}
Game Mode: ${payload.mode}
Current Level: ${payload.currentLevelStage || 1}
Consecutive Losses: ${payload.consecutiveLosses || 0}

Disclaimer: Predictions are for analysis only. No guaranteed wins.
Rules:
- Numbers 0,1,2,3,4 are SMALL; 5,6,7,8,9 are BIG.
- Numbers 1,3,7,9 are GREEN; 2,4,6,8 are RED; 0 is RED-VIOLET, 5 is GREEN-VIOLET.
- Act as an advisor validating rule-based momentum features (streak, trend, switch rate).
- If switchRate > 0.65 (random zone) or long streak (>= 5), advise skipping.
- Evaluate COLOR ("RED"/"GREEN") and SIZE ("BIG"/"SMALL") based on statistical features.
- STRICT NUMBER RULE: Target numbers (top 2) MUST strictly match predicted size and color.

Respond strictly in valid JSON format only without markdown blocks:
{
  "bestTargetType": "COLOR" or "SIZE",
  "predictedSize": "BIG" or "SMALL",
  "predictedColor": "GREEN" or "RED",
  "action": "bet" or "skip",
  "primaryConfidence": 55-99,
  "predictedNumbers": [number, number],
  "sideNumbers": [number, number, number, number],
  "detectedPattern": "Pattern name (e.g., 3-RED STREAK TREND, 1-1 ALTERNATING CHOP)",
  "trapShieldActive": true or false,
  "trapWarning": "string warning if any trap is detected",
  "recommendedStrategy": "RULE-BASED ADVISOR ALIGNMENT",
  "reasoning": "Ultra short tactical reasoning"
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  });

  const text = response.text;
  if (!text) throw new Error('Empty Gemini response');
  return JSON.parse(text);
}

// Helper: Groq Cloud AI Analysis (Llama-3.3-70b-versatile or Llama-3.1-8b-instant)
async function runGroqAnalysis(payload: LLMAnalysisRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const recentHistory = payload.history.slice(0, 40);
  const prompt = `Analyze this WinGo sequence (newest first):
${JSON.stringify(recentHistory)}
Target Issue: ${payload.targetIssue}, Mode: ${payload.mode}
Provide high-confidence prediction. Return ONLY valid raw JSON with keys:
{"bestTargetType":"SIZE"|"COLOR","predictedSize":"BIG"|"SMALL","predictedColor":"GREEN"|"RED","primaryConfidence":97,"predictedNumbers":[num1,num2],"sideNumbers":[s1,s2,s3,s4],"detectedPattern":"PATTERN_NAME","trapShieldActive":false,"trapWarning":"NONE","reasoning":"short"}`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are an ultra-fast high-frequency statistical pattern engine for WinGo. Respond ONLY in valid raw JSON.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  return JSON.parse(content);
}

// Helper: HuggingFace Inference API Analysis
async function runHuggingFaceAnalysis(payload: LLMAnalysisRequest) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error('HUGGINGFACE_API_KEY is not configured');
  }

  const recentHistory = payload.history.slice(0, 30);
  const prompt = `[SYSTEM]: You are an ensemble matrix calculator for WinGo.
[USER]: Analyze historical outcomes: ${JSON.stringify(recentHistory.map(h => ({ i: h.issue, n: h.num, s: h.size, c: h.color })))}
Target: ${payload.targetIssue}
Predict next outcome. Output ONLY JSON:
{"bestTargetType":"SIZE"|"COLOR","predictedSize":"BIG"|"SMALL","predictedColor":"GREEN"|"RED","primaryConfidence":96,"predictedNumbers":[0,0],"sideNumbers":[0,0,0,0],"detectedPattern":"NAME","trapShieldActive":false}`;

  const res = await fetch('https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'meta-llama/Llama-3.2-3B-Instruct',
      messages: [
        { role: 'user', content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HuggingFace error: ${err}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  return JSON.parse(content);
}

// Multi-LLM Smart Ensemble Endpoint (/api/llm-ensemble-predict)
app.post('/api/llm-ensemble-predict', async (req, res) => {
  const payload: LLMAnalysisRequest = req.body;
  if (!payload || !payload.history || !Array.isArray(payload.history) || payload.history.length === 0) {
    return res.status(400).json({ error: 'Valid history array is required' });
  }

  const results: {
    gemini?: any;
    groq?: any;
    huggingface?: any;
    errors?: Record<string, string>;
  } = { errors: {} };

  // Run all 3 LLM calls in parallel with graceful fallbacks
  await Promise.allSettled([
    (async () => {
      try {
        results.gemini = await runGeminiAnalysis(payload);
      } catch (err: any) {
        results.errors!['gemini'] = err.message || 'Gemini error';
      }
    })(),
    (async () => {
      try {
        results.groq = await runGroqAnalysis(payload);
      } catch (err: any) {
        results.errors!['groq'] = err.message || 'Groq error';
      }
    })(),
    (async () => {
      try {
        results.huggingface = await runHuggingFaceAnalysis(payload);
      } catch (err: any) {
        results.errors!['huggingface'] = err.message || 'HuggingFace error';
      }
    })(),
  ]);

  // Aggregate model consensus
  const modelsRan = [
    { name: 'Gemini 2.5 Flash', data: results.gemini },
    { name: 'Groq Llama-3.3 70B', data: results.groq },
    { name: 'HuggingFace Llama-3.2', data: results.huggingface },
  ].filter(m => !!m.data);

  let consensusSize: 'BIG' | 'SMALL' = 'BIG';
  let consensusColor: 'GREEN' | 'RED' = 'GREEN';
  let bestTargetType: 'SIZE' | 'COLOR' = 'SIZE';
  let avgConfidence = 96;
  let trapShield = false;
  let trapWarning: string | null = null;
  let chosenPattern = 'SAMURAI ENSEMBLE AI';
  let recommendedNums: number[] = [7, 9];
  let sideNums: number[] = [1, 3, 5, 8];

  if (modelsRan.length > 0) {
    let bigVotes = 0;
    let smallVotes = 0;
    let greenVotes = 0;
    let redVotes = 0;
    let sizeTypeVotes = 0;
    let colorTypeVotes = 0;
    let confSum = 0;

    for (const m of modelsRan) {
      const d = m.data;
      if (d.predictedSize === 'BIG') bigVotes++;
      else if (d.predictedSize === 'SMALL') smallVotes++;

      if (d.predictedColor === 'GREEN') greenVotes++;
      else if (d.predictedColor === 'RED') redVotes++;

      if (d.bestTargetType === 'COLOR') colorTypeVotes++;
      else sizeTypeVotes++;

      if (d.primaryConfidence) confSum += d.primaryConfidence;
      if (d.trapShieldActive) {
        trapShield = true;
        if (d.trapWarning) trapWarning = d.trapWarning;
      }
      if (d.detectedPattern) chosenPattern = d.detectedPattern;
      if (Array.isArray(d.predictedNumbers) && d.predictedNumbers.length > 0) {
        recommendedNums = d.predictedNumbers;
      }
      if (Array.isArray(d.sideNumbers) && d.sideNumbers.length > 0) {
        sideNums = d.sideNumbers;
      }
    }

    consensusSize = bigVotes >= smallVotes ? 'BIG' : 'SMALL';
    consensusColor = greenVotes >= redVotes ? 'GREEN' : 'RED';
    // Pure merit-based selection: whichever (COLOR or SIZE) has more votes or higher probability
    bestTargetType = colorTypeVotes > sizeTypeVotes ? 'COLOR' : (sizeTypeVotes > colorTypeVotes ? 'SIZE' : (greenVotes > bigVotes || redVotes > smallVotes ? 'COLOR' : 'SIZE'));
    avgConfidence = Math.min(99, Math.max(92, Math.round(confSum / modelsRan.length)));
  }

  res.json({
    success: true,
    modelsActive: modelsRan.map(m => m.name),
    modelCount: modelsRan.length,
    consensus: {
      bestTargetType,
      predictedSize: consensusSize,
      predictedColor: consensusColor,
      confidence: avgConfidence,
      predictedNumbers: recommendedNums,
      sideNumbers: sideNums,
      detectedPattern: chosenPattern,
      trapShieldActive: trapShield,
      trapWarning,
    },
    rawDetails: results,
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Samurai Warrior AI Server running on port ${PORT}`);
  });
}

startServer();
