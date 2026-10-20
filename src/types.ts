export type WinGoMode = '30s' | '1m';

export type PredictionTargetType = 'SIZE' | 'HOLD';
export type MixTargetPick = 'BIG' | 'SMALL' | 'HOLD';

export interface HistoryItem {
  issue: string;
  num: number;
  size: 'BIG' | 'SMALL';
  color: 'GREEN' | 'RED' | 'RED-VIOLET' | 'GREEN-VIOLET' | 'VIOLET';
  timestamp?: number;
}

export interface Pattern100Stats {
  patternStr: string;
  matchedLength: number; // 3 to 10
  matchCount: number;
  bigWeight: number;
  smallWeight: number;
  nextExpected: 'BIG' | 'SMALL';
  confidence: number;
  description: string;
  trendCategory?: 'DRAGON' | 'MIRROR' | 'ZIGZAG' | 'TWIN' | 'TRIPLET' | 'LADDER' | 'BREAKER' | 'RANDOM_CHAOS';
  trendLabel?: string;
}

export interface AtoZTrendAnalysis {
  trendCategory: 'DRAGON' | 'MIRROR' | 'ZIGZAG' | 'TWIN' | 'TRIPLET' | 'LADDER' | 'BREAKER' | 'RANDOM_CHAOS';
  trendLabel: string;
  nextExpected: 'BIG' | 'SMALL';
  confidence: number;
  patternStr: string;
  matchedLength: number;
  description: string;
  weightBig: number;
  weightSmall: number;
}

export interface Engine100Breakdown {
  pattern3to10Score: { big: number; small: number };
  weightedFreqScore: { big: number; small: number };
  markovTransitionScore: { big: number; small: number };
  entropyScore: { entropy100: number; trendStrength: number; marketState: 'TRENDING' | 'CHOP_VOLATILE' | 'BALANCED' };
  quantumWaveScore: { bigAmp: number; smallAmp: number };
  neuralScore: { big: number; small: number };
  topSameSideNumber: number;
  sameSideScores: Record<number, number>;
}

export interface TripleNumberPrediction {
  heroNumber: number; // Strike #1 (Primary Choice / Apex Pick)
  comboNumber: number; // Strike #2 (Secondary Choice / Strategic Companion Pick)
  hedgeNumber: number; // Strike #3 (Tertiary Choice / Tactical Trend Hedge)
  comboPatternLabel: string; // e.g. "DRAGON REPEAT COMBO", "MIRROR AXIS TRIAD", "10-100 MATRIX TRIO"
  winIntensity: 'HIGH' | 'MAXIMUM' | 'CRITICAL';
  depthHorizonScore: { d10: number; d25: number; d50: number; d100: number; d500?: number; d1000?: number };
  confidence1: number;
  confidence2: number;
  confidence3: number;
  jointConfidence: number;
  entropyScore?: number;
  oscillatorPhase?: string;
  rollingWindowDepth?: number;
  digitProbabilities?: Record<number, number>;
  workerLatencyMs?: number;
  jackpotProbability?: number;
  jackpotWinningTier?: 'LEVEL_1_JACKPOT_LOCK' | 'LEVEL_2_FIX_JACKPOT' | 'ULTRA_MAX_JACKPOT';
}

export interface PredictionHistoryItem {
  id: string;
  mode: WinGoMode;
  issue: string;
  predictionType: PredictionTargetType;
  targetPick: MixTargetPick;
  predictedSize: 'BIG' | 'SMALL' | 'HOLD';
  predictedColor?: 'GREEN' | 'RED';
  predictedNumbers: number[]; // 3 High-Probability Numbers [heroNumber, comboNumber, hedgeNumber]
  highProbNumbers?: [number, number, number];
  numberPredictions?: TripleNumberPrediction;
  sameSideNumber?: number; // Single high-probability number from the SAME side (5-9 for BIG, 0-4 for SMALL)
  sameSideLabel?: string; // e.g. "SAME-SIDE #7 (BIG)" or "SAME-SIDE #2 (SMALL)"
  oppositeNumber?: number; // kept for backwards-compatibility (points to sameSideNumber)
  oppositeSideLabel?: string;
  primaryNumber?: number;
  backupNumber?: number;
  backupSize?: 'BIG' | 'SMALL';
  matchedLength?: number;
  pattern100Stats?: Pattern100Stats;
  dataHorizonDepth?: number;
  actualNum?: number;
  actualSize?: 'BIG' | 'SMALL';
  actualColor?: 'GREEN' | 'RED' | 'RED-VIOLET' | 'GREEN-VIOLET' | 'VIOLET';
  status: 'WIN' | 'JACKPOT' | 'LOSS' | 'HOLD' | 'PENDING';
  statusLabel: string;
  timestamp: number;
  pattern: string;
  levelStage?: number;
  confidence?: number;
}

export interface ActivePrediction {
  mode: WinGoMode;
  issue: string;
  predictionType: PredictionTargetType; // Strictly 'SIZE' or 'HOLD'
  targetPick: MixTargetPick; // Strictly 'BIG' | 'SMALL' | 'HOLD'
  predictedSize: 'BIG' | 'SMALL' | 'HOLD';
  predictedColor?: 'GREEN' | 'RED';
  predictedNumbers: number[]; // 3 High-Probability Numbers [heroNumber, comboNumber, hedgeNumber]
  highProbNumbers?: [number, number, number];
  numberPredictions?: TripleNumberPrediction;
  sameSideNumber?: number; // Single high-probability number from SAME side
  sameSideLabel?: string;
  oppositeNumber?: number; // kept for backwards-compatibility (points to sameSideNumber)
  oppositeSideLabel?: string;
  primaryNumber?: number;
  backupNumber?: number;
  backupSize?: 'BIG' | 'SMALL';
  sideNumbers?: number[];
  pattern: string;
  confidence: number;
  timestamp: number;
  highestProbType: PredictionTargetType;
  highestProbScore: number;
  colorWinProb?: number;
  sizeWinProb: number;
  levelStage: number; // Current Martingale Level (1, 2)
  levelAdvice: string;
  consecutiveLossCount?: number;
  detectedTrap?: string | null;
  antiTrapShieldActive?: boolean;
  dataHorizonDepth?: number;
  confidenceMeter?: {
    percentage: number;
    tier: 'OPTIMAL' | 'SUPER_CONVERGENCE' | 'ULTRA_LOCK';
    label: string;
  };
  ensembleScores?: {
    quantumNeural: number;
    markovChain: number;
    fibonacciMomentum: number;
    liquiditySmartMoney: number;
    entropyConvergence: number;
    colorParityFusion?: number;
    antiTrapStability?: number;
    pattern3to10Weight?: number;
    weightedFreq100?: number;
  };
  pattern100Stats?: Pattern100Stats;
  engine100Breakdown?: Engine100Breakdown;
  matrixRiskLevel?: string;
  suggestedBetMultiplier?: string;
  predictedParity?: 'EVEN' | 'ODD';
  matchedPatternName?: string;
  matchedSequence?: string;
  autoAdjustmentActive?: boolean;
  fiftyGameDistribution?: {
    totalEvaluated: number;
    winRate50: number;
    level1WinRate: number;
    level2WinRate: number;
    volatility: 'LOW' | 'MEDIUM' | 'HIGH';
    aggressivenessScore: number;
    under2LevelFixedLock: boolean;
  };
  llmInsights?: {
    modelsConsulted: string[];
    geminiStatus?: string;
    groqStatus?: string;
    hfStatus?: string;
    aiConsensusReasoning?: string;
  };
  multiDimProbabilities?: {
    sizeProbBig: number;
    sizeProbSmall: number;
    colorProbGreen: number;
    colorProbRed: number;
    colorProbViolet: number;
    parityProbEven: number;
    parityProbOdd: number;
  };
}

export interface MarketLiquidity {
  poolType: 'SIZE' | 'COLOR';
  labelA: string;
  labelB: string;
  volA: number;
  volB: number;
  bigVol: number;
  smallVol: number;
  target: MixTargetPick;
  targetPool: string;
  safeDiff: number;
  statusText: string;
}

export interface AdaptiveEngineState {
  maxRiskLevel: number; // e.g., 3, 4, 5 (default), 6
  consecutiveLosses: number;
  currentLevelStage: number;
  suggestedMultiplier: string;
  isCapitalProtectionActive: boolean;
  antiTrapShieldActive: boolean;
  detectedTrap: string | null;
  lastPivotReason: string | null;
}

export type MainTabType = 'dashboard' | 'live_game';

export interface GamePreset {
  name: string;
  url: string;
  category: string;
}

export type SamuraiToastType = 'jackpot' | 'win' | 'loss' | 'market_ready' | 'pattern_detected' | 'info';

export interface SamuraiToast {
  id: string;
  type: SamuraiToastType;
  title: string;
  message: string;
  detail?: string;
  badge?: string;
  timestamp: number;
  duration?: number; // ms
}

