export interface ResultItem {
  color: 'R' | 'G';
  number: number;
  size: 'B' | 'S';
  time: number;
}

export interface VoteResult {
  type: 'SIZE' | 'COLOUR';
  value: 'BIG' | 'SMALL' | 'RED' | 'GREEN';
  size: 'BIG' | 'SMALL';
  colour: 'RED' | 'GREEN';
  highNumber: number;
  confidence: number;
  sizeVotes: { BIG: number; SMALL: number };
  colourVotes: { RED: number; GREEN: number };
  numberVotes: Record<string, number>;
  sizeConfidence?: number;
  colourConfidence?: number;
}

export interface AnalysisResult {
  redRate10: number;
  redRate30: number;
  bigRate10?: number;
  bigRate30?: number;
  streak?: number;
  colorStreak?: number;
  colorStreakVal?: 'R' | 'G';
  sizeStreak?: number;
  sizeStreakVal?: 'B' | 'S';
  streakColor?: 'R' | 'G';
  switchRate?: number;
  switchRateColor?: number;
  switchRateSize?: number;
  trend?: number;
  patternName: string;
  patternInfo?: {
    name: string;
    boostType: string;
    predictedSize?: 'BIG' | 'SMALL';
    predictedColor?: 'RED' | 'GREEN';
    edge?: string;
    weight?: number;
  };
  voteResult?: VoteResult;
  markov?: any;
  entropy?: any;
  fourier?: any;
  engines?: any;
}

export interface PredictionV2Result {
  action: 'bet' | 'skip';
  targetType?: 'SIZE' | 'COLOR';
  targetValue?: 'BIG' | 'SMALL' | 'RED' | 'GREEN';
  color?: 'R' | 'G';
  size?: 'BIG' | 'SMALL';
  predictedSize?: 'BIG' | 'SMALL';
  predictedColor?: 'RED' | 'GREEN';
  sizeWinProb?: number;
  colorWinProb?: number;
  highNumber?: number;
  numB?: number;
  numS?: number;
  confidence: number;
  reason?: string;
  patternName?: string;
  voteResult?: VoteResult;
  engines?: any;
}

export interface BacktestResult {
  wins: number;
  losses: number;
  skips: number;
  accuracy: number;
  totalTrades: number;
}

export function addResult(result: ResultItem): void;
export function analyze(data?: ResultItem[]): AnalysisResult | null;
export function detectNamedPattern(
  data: ResultItem[],
  colorStreak: number,
  colorLast: 'R' | 'G',
  sizeStreak: number,
  sizeLast: 'B' | 'S',
  switchRateColor: number,
  switchRateSize: number,
  redRate10: number,
  bigRate10: number
): any;
export function runAkasatuVoteEngine(numbers: number[]): VoteResult;
export function calculateMarkovProbabilities(data?: ResultItem[]): any;
export function calculateShannonEntropy(data?: ResultItem[]): any;
export function detectFourierHarmonicCycles(data?: ResultItem[]): any;
export function getRifuPrediction(hist?: any[]): any;
export function computeSmartPrediction(hist?: any[]): any;
export function computeHybridPrediction(hist?: any[]): any;
export function computeMasterHybrid(hist?: any[]): any;
export function computeAdvancedPrediction(hist?: any[], lossStreak?: number): any;
export function computeUltimateProPrediction(hist?: any[]): any;
export function generateSmartNumber(hist?: any[], isBig?: boolean): number;
export function analyzeTrend(hist?: any[]): string;
export function updateEngineMemory(won: boolean, predictionSide?: string): void;
export function predictV2(hist?: ResultItem[], consecutiveLosses?: number): PredictionV2Result;
export function backtest(): BacktestResult;
