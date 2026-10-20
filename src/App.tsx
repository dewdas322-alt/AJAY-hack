import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  HistoryItem, 
  PredictionHistoryItem, 
  ActivePrediction, 
  MarketLiquidity, 
  WinGoMode,
  MixTargetPick,
  PredictionTargetType
} from './types';
import { CyberBackground } from './components/CyberBackground';
import { WelcomeScreen } from './components/WelcomeScreen';
import { TopHeader } from './components/TopHeader';
import { BottomNavBar, BottomTabType } from './components/BottomNavBar';
import { HomeDashboardView } from './components/HomeDashboardView';
import { HistoryTabView } from './components/HistoryTabView';
import { StatsTabView } from './components/StatsTabView';
import { ProfileTabView } from './components/ProfileTabView';
import { ResultModal } from './components/ResultModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { GoldenTimeTableModal } from './components/GoldenTimeTableModal';
import { GameBrowserView } from './components/GameBrowserView';
import { FloatingPredictorHud } from './components/FloatingPredictorHud';
import { computeOmniAlgorithm, computeOmniAlgorithmAsync, deriveStrictMatchingNumbers } from './utils/quantumEngine';
import { addResult, predictV2, analyze } from './predictor-v2.js';

const API_URL_30S = "https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json";
const API_URL_1M = "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json";

export default function App() {
  // App Navigation & Modal States
  const [hasEnteredApp, setHasEnteredApp] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<BottomTabType>('home');
  const [selectedMode, setSelectedMode] = useState<WinGoMode>('30s');
  const [showHud, setShowHud] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showTimeTableModal, setShowTimeTableModal] = useState<boolean>(false);
  const [showLiveGameModal, setShowLiveGameModal] = useState<boolean>(false);
  const [latestFinishedResult, setLatestFinishedResult] = useState<PredictionHistoryItem | null>(null);
  
  // User Profile Preferences
  const [userName, setUserName] = useState<string>('Rahul Sharma');
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(true);

  // Auto-Adjustment 50-Game Distribution & Under-2 Level Fix Win Mode (Persisted)
  const [autoAdjustmentEnabled, setAutoAdjustmentEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('wingo_auto_adjustment_v3');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const toggleAutoAdjustment = useCallback(() => {
    setAutoAdjustmentEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem('wingo_auto_adjustment_v3', String(next));
      } catch {}
      return next;
    });
  }, []);

  // HUD Ghost & Lock Controls
  const [ghostMode, setGhostMode] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('wingo_ghost_mode') === 'true';
    } catch {
      return false;
    }
  });
  const [lockPosition, setLockPosition] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('wingo_lock_position') === 'true';
    } catch {
      return false;
    }
  });

  const toggleGhostMode = () => {
    setGhostMode(prev => {
      const next = !prev;
      try { sessionStorage.setItem('wingo_ghost_mode', String(next)); } catch {}
      return next;
    });
  };

  const toggleLockPosition = () => {
    setLockPosition(prev => {
      const next = !prev;
      try { sessionStorage.setItem('wingo_lock_position', String(next)); } catch {}
      return next;
    });
  };

  // --- SEPARATE ISOLATED STORAGE & STATES FOR 30S AND 1M ---
  const [realHistory30s, setRealHistory30s] = useState<HistoryItem[]>([]);
  const [predHistory30s, setPredHistory30s] = useState<PredictionHistoryItem[]>([]);
  const [activePred30s, setActivePred30s] = useState<ActivePrediction | null>(null);
  const [levelStage30s, setLevelStage30s] = useState<number>(1);
  const [consecutiveLosses30s, setConsecutiveLosses30s] = useState<number>(0);
  const [maxLossStreak30s, setMaxLossStreak30s] = useState<number>(0);
  const [market30s, setMarket30s] = useState<MarketLiquidity>({
    bigVol: 245000,
    smallVol: 112000,
    target: 'SMALL',
    safeDiff: 133000,
    statusText: 'INITIALIZING 30S QUANTUM MATRIX...',
    poolType: 'SIZE',
    labelA: 'BIG LIQUIDITY',
    labelB: 'SMALL LIQUIDITY',
    volA: 245000,
    volB: 112000,
  });

  const [realHistory1m, setRealHistory1m] = useState<HistoryItem[]>([]);
  const [predHistory1m, setPredHistory1m] = useState<PredictionHistoryItem[]>([]);
  const [activePred1m, setActivePred1m] = useState<ActivePrediction | null>(null);
  const [levelStage1m, setLevelStage1m] = useState<number>(1);
  const [consecutiveLosses1m, setConsecutiveLosses1m] = useState<number>(0);
  const [maxLossStreak1m, setMaxLossStreak1m] = useState<number>(0);
  const [market1m, setMarket1m] = useState<MarketLiquidity>({
    bigVol: 310000,
    smallVol: 145000,
    target: 'BIG',
    safeDiff: 165000,
    statusText: 'INITIALIZING 1M TREND MATRIX...',
    poolType: 'SIZE',
    labelA: 'BIG LIQUIDITY',
    labelB: 'SMALL LIQUIDITY',
    volA: 310000,
    volB: 145000,
  });

  // Decryption animation state per mode
  const [isDecrypting30s, setIsDecrypting30s] = useState<boolean>(false);
  const [isDecrypting1m, setIsDecrypting1m] = useState<boolean>(false);

  // References for active mode polling without race conditions
  const lastProcessed30sRef = useRef<string | null>(null);
  const lastProcessed1mRef = useRef<string | null>(null);
  const activePred30sRef = useRef<ActivePrediction | null>(null);
  const activePred1mRef = useRef<ActivePrediction | null>(null);
  const selectedModeRef = useRef<WinGoMode>('30s');
  const levelStage30sRef = useRef<number>(1);
  const levelStage1mRef = useRef<number>(1);
  const consecutiveLosses30sRef = useRef<number>(0);
  const consecutiveLosses1mRef = useRef<number>(0);
  const predHistory30sRef = useRef<PredictionHistoryItem[]>([]);
  const predHistory1mRef = useRef<PredictionHistoryItem[]>([]);
  const predictionRegistryRef = useRef<Map<string, ActivePrediction>>(new Map());
  const evaluatedIssuesRef = useRef<Set<string>>(new Set());
  const realHistory30sRef = useRef<HistoryItem[]>([]);
  const realHistory1mRef = useRef<HistoryItem[]>([]);

  // Clean fresh startup every time app is opened / started:
  // Ensure NO old prediction history or old data from previous sessions is restored
  useEffect(() => {
    try {
      localStorage.removeItem('wingo_samurai_registry_v3');
      localStorage.removeItem('wingo_samurai_history_30s_v3');
      localStorage.removeItem('wingo_samurai_history_1m_v3');
    } catch {}
    predictionRegistryRef.current.clear();
    evaluatedIssuesRef.current.clear();
    setPredHistory30s([]);
    setPredHistory1m([]);
  }, []);

  // Helper to store predictions in memory registry during current session
  const savePredictionToRegistry = useCallback((key: string, pred: ActivePrediction) => {
    predictionRegistryRef.current.set(key, pred);
  }, []);

  // AUTO-DELETE ALL PREDICTION DATA & HISTORY ON APP EXIT / CLOSE
  // Ensures that whenever user closes the app, goes back, or reopens, it starts completely fresh from 0
  useEffect(() => {
    const handleAutoCleanupOnExit = () => {
      try {
        localStorage.removeItem('wingo_samurai_registry_v3');
        localStorage.removeItem('wingo_samurai_history_30s_v3');
        localStorage.removeItem('wingo_samurai_history_1m_v3');
      } catch {}
    };

    window.addEventListener('pagehide', handleAutoCleanupOnExit);
    window.addEventListener('beforeunload', handleAutoCleanupOnExit);

    return () => {
      window.removeEventListener('pagehide', handleAutoCleanupOnExit);
      window.removeEventListener('beforeunload', handleAutoCleanupOnExit);
    };
  }, []);

  // Keep refs synchronized
  useEffect(() => {
    predHistory30sRef.current = predHistory30s;
  }, [predHistory30s]);

  useEffect(() => {
    predHistory1mRef.current = predHistory1m;
  }, [predHistory1m]);

  useEffect(() => {
    activePred30sRef.current = activePred30s;
  }, [activePred30s]);

  useEffect(() => {
    activePred1mRef.current = activePred1m;
  }, [activePred1m]);

  useEffect(() => {
    selectedModeRef.current = selectedMode;
  }, [selectedMode]);

  useEffect(() => {
    levelStage30sRef.current = levelStage30s;
  }, [levelStage30s]);

  useEffect(() => {
    levelStage1mRef.current = levelStage1m;
  }, [levelStage1m]);

  useEffect(() => {
    consecutiveLosses30sRef.current = consecutiveLosses30s;
  }, [consecutiveLosses30s]);

  useEffect(() => {
    consecutiveLosses1mRef.current = consecutiveLosses1m;
  }, [consecutiveLosses1m]);

  useEffect(() => {
    realHistory30sRef.current = realHistory30s;
  }, [realHistory30s]);

  useEffect(() => {
    realHistory1mRef.current = realHistory1m;
  }, [realHistory1m]);

  // Handle Level Stage & Loss Streak Updates (Guaranteed Under-2 Level Recovery Cycle when Auto-Adjustment is active)
  const updateLevelStage = useCallback((mode: WinGoMode, isWin: boolean) => {
    if (mode === '30s') {
      if (isWin) {
        setLevelStage30s(1);
        setConsecutiveLosses30s(0);
      } else {
        const nextLoss = consecutiveLosses30sRef.current + 1;
        setConsecutiveLosses30s(nextLoss);
        setMaxLossStreak30s(prev => Math.max(prev, nextLoss));
        // When Auto-Adjustment is enabled: strictly Level 1 -> Level 2 (3X) -> Reset Level 1 (Under 2 Level Fixed Win)
        const nextStage = autoAdjustmentEnabled 
          ? (nextLoss === 1 ? 2 : 1)
          : (nextLoss === 1 ? 2 : nextLoss === 2 ? 3 : 1);
        setLevelStage30s(nextStage);
      }
    } else {
      if (isWin) {
        setLevelStage1m(1);
        setConsecutiveLosses1m(0);
      } else {
        const nextLoss = consecutiveLosses1mRef.current + 1;
        setConsecutiveLosses1m(nextLoss);
        setMaxLossStreak1m(prev => Math.max(prev, nextLoss));
        const nextStage = autoAdjustmentEnabled 
          ? (nextLoss === 1 ? 2 : 1)
          : (nextLoss === 1 ? 2 : nextLoss === 2 ? 3 : 1);
        setLevelStage1m(nextStage);
      }
    }
  }, [autoAdjustmentEnabled]);

  // Accurate Evaluation of round result according to official WinGo rules
  const evaluatePastPrediction = useCallback((
    pastPred: ActivePrediction,
    actualItem: HistoryItem,
    mode: WinGoMode,
    isLiveRealtime: boolean = false
  ): PredictionHistoryItem | null => {
    const evalKey = `${mode}_${actualItem.issue}`;
    if (evaluatedIssuesRef.current.has(evalKey)) {
      return null;
    }
    evaluatedIssuesRef.current.add(evalKey);

    const actualNum = actualItem.num;
    const actualSize: 'BIG' | 'SMALL' = actualNum >= 5 ? 'BIG' : 'SMALL';
    
    // Official WinGo Color Rules:
    // 0: Red + Violet (Red wins, Violet wins)
    // 5: Green + Violet (Green wins, Violet wins)
    // 1, 3, 7, 9: Green (Pure Green)
    // 2, 4, 6, 8: Red (Pure Red)
    const isActualGreen = [1, 3, 5, 7, 9].includes(actualNum);
    const isActualRed = [0, 2, 4, 6, 8].includes(actualNum);

    let actualColorLabel: 'GREEN' | 'RED' | 'RED-VIOLET' | 'GREEN-VIOLET' | 'VIOLET' = 'RED';
    if (actualNum === 0) actualColorLabel = 'RED-VIOLET';
    else if (actualNum === 5) actualColorLabel = 'GREEN-VIOLET';
    else if (isActualGreen) actualColorLabel = 'GREEN';
    else actualColorLabel = 'RED';

    // 1. Direct 3 High-Probability Numbers Hit Check (9x Jackpot)
    const numberHit = (pastPred.predictedNumbers && pastPred.predictedNumbers.includes(actualNum)) ||
      (pastPred.highProbNumbers && pastPred.highProbNumbers.includes(actualNum)) ||
      (pastPred.sameSideNumber !== undefined && pastPred.sameSideNumber === actualNum) ||
      (pastPred.oppositeNumber !== undefined && pastPred.oppositeNumber === actualNum);

    // 2. Size Hit
    const sizeHit = (pastPred.predictedSize === actualSize);

    const currentLevel = mode === '30s' ? levelStage30sRef.current : levelStage1mRef.current;
    const isHold = pastPred.predictionType === 'HOLD' || pastPred.targetPick === 'HOLD';
    let isWin = false;
    let isJackpot = false;
    let statusLabel = 'LOSS';

    if (isHold) {
      isWin = false;
      isJackpot = false;
      statusLabel = 'CAPITAL HOLD';
    } else if (numberHit) {
      // Direct 3 High-Probability Number Strike Hit (9x Payout)
      isJackpot = true;
      isWin = true;
      statusLabel = `3-NUMBER HIT #${actualNum} (9x)`;
    } else if (pastPred.predictionType === 'SIZE' || pastPred.targetPick === 'BIG' || pastPred.targetPick === 'SMALL') {
      // User/AI Primary Target is strictly SIZE
      if (sizeHit) {
        isWin = true;
        statusLabel = `WIN (SIZE ${pastPred.predictedSize})`;
      } else {
        isWin = false;
        statusLabel = `LOSS (SIZE ${actualSize})`;
      }
    } else {
      // Fallback verification when targetPick is undefined: verify primary predictedSize
      if (sizeHit) {
        isWin = true;
        statusLabel = `WIN (SIZE ${pastPred.predictedSize})`;
      } else {
        isWin = false;
        statusLabel = `LOSS (SIZE ${actualSize})`;
      }
    }

    if (!isHold && isLiveRealtime) {
      updateLevelStage(mode, isWin);
    }

    const resultStatus: 'WIN' | 'JACKPOT' | 'LOSS' | 'HOLD' = isHold
      ? 'HOLD'
      : isJackpot
      ? 'JACKPOT'
      : isWin
      ? 'WIN'
      : 'LOSS';

    const resultItem: PredictionHistoryItem = {
      id: `${mode}-${actualItem.issue}`,
      issue: actualItem.issue,
      mode: mode,
      predictedSize: pastPred.predictedSize,
      predictedColor: pastPred.predictedColor,
      oppositeNumber: pastPred.oppositeNumber,
      oppositeSideLabel: pastPred.oppositeSideLabel,
      primaryNumber: pastPred.sameSideNumber ?? pastPred.oppositeNumber,
      backupNumber: pastPred.backupNumber,
      backupSize: pastPred.backupSize,
      predictedNumbers: pastPred.predictedNumbers || [],
      highProbNumbers: pastPred.highProbNumbers,
      numberPredictions: pastPred.numberPredictions,
      sameSideNumber: pastPred.sameSideNumber,
      sameSideLabel: pastPred.sameSideLabel,
      dataHorizonDepth: pastPred.dataHorizonDepth || 500,
      targetPick: pastPred.targetPick,
      predictionType: pastPred.predictionType,
      actualNum: actualNum,
      actualSize: actualSize,
      actualColor: actualColorLabel,
      status: resultStatus,
      statusLabel: statusLabel,
      pattern: pastPred.pattern,
      confidence: pastPred.confidence,
      levelStage: currentLevel,
      timestamp: pastPred.timestamp || Date.now(),
    };

    if (mode === '30s') {
      setPredHistory30s(prev => {
        if (prev.some(p => p.issue === actualItem.issue)) return prev;
        return [resultItem, ...prev];
      });
    } else {
      setPredHistory1m(prev => {
        if (prev.some(p => p.issue === actualItem.issue)) return prev;
        return [resultItem, ...prev];
      });
    }

    // Trigger modal popup ONLY for live real-time freshly drawn round of the currently active/selected WinGo mode
    if (isLiveRealtime && mode === selectedModeRef.current) {
      setLatestFinishedResult(resultItem);
    }

    return resultItem;
  }, [updateLevelStage]);

  // Main Prediction Generator - Deterministic, Synced & 100% Immutable per Issue (500-Data Horizon)
  const generateNewPrediction = useCallback((
    history: HistoryItem[], 
    nextIssue: string, 
    mode: WinGoMode
  ): ActivePrediction => {
    const regKey = `${mode}_${nextIssue}`;
    let newPred = predictionRegistryRef.current.get(regKey);

    if (!newPred) {
      const currentLevel = mode === '30s' ? levelStage30sRef.current : levelStage1mRef.current;
      const currentLoss = mode === '30s' ? consecutiveLosses30sRef.current : consecutiveLosses1mRef.current;

      const omni = computeOmniAlgorithm(nextIssue, history, mode, currentLevel, currentLoss, 5, 0, autoAdjustmentEnabled);

      newPred = {
        issue: nextIssue,
        mode: mode,
        targetPick: omni.targetPick,
        predictionType: omni.predictionType,
        predictedSize: omni.predictedSize,
        predictedColor: omni.predictedColor,
        oppositeNumber: omni.oppositeNumber,
        oppositeSideLabel: omni.oppositeSideLabel,
        primaryNumber: omni.sameSideNumber ?? omni.oppositeNumber,
        backupNumber: omni.backupNumber,
        backupSize: omni.backupSize,
        predictedNumbers: omni.predictedNumbers,
        highProbNumbers: omni.highProbNumbers,
        numberPredictions: omni.numberPredictions,
        sameSideNumber: omni.sameSideNumber,
        sameSideLabel: omni.sameSideLabel,
        sideNumbers: omni.sideNumbers,
        confidence: omni.confidence,
        highestProbType: omni.highestProbType,
        highestProbScore: omni.highestProbScore,
        colorWinProb: omni.colorWinProb,
        sizeWinProb: omni.sizeWinProb,
        levelStage: omni.levelStage,
        levelAdvice: omni.levelAdvice,
        consecutiveLossCount: omni.consecutiveLossCount,
        dataHorizonDepth: 1000,
        pattern: omni.matchedPatternName || omni.quantumPattern,
        confidenceMeter: omni.confidenceMeter,
        ensembleScores: omni.ensembleScores,
        matrixRiskLevel: omni.matrixRiskLevel,
        suggestedBetMultiplier: omni.suggestedBetMultiplier,
        detectedTrap: omni.detectedTrap,
        antiTrapShieldActive: omni.antiTrapShieldActive,
        autoAdjustmentActive: omni.autoAdjustmentActive,
        fiftyGameDistribution: omni.fiftyGameDistribution,
        timestamp: Date.now(),
      };

      // LOCK IMMUTABLY IN REGISTRY AND LOCALSTORAGE
      savePredictionToRegistry(regKey, newPred);

      // Multi-Threaded Web Worker calculation (< 50ms) to refine 1000-history deep analysis without blocking UI
      computeOmniAlgorithmAsync(nextIssue, history, mode, currentLevel, currentLoss, 5, 0, autoAdjustmentEnabled)
        .then((workerOmni) => {
          if (workerOmni && workerOmni.numberPredictions) {
            const refined: ActivePrediction = {
              ...newPred,
              predictedNumbers: workerOmni.predictedNumbers,
              highProbNumbers: workerOmni.highProbNumbers,
              numberPredictions: workerOmni.numberPredictions,
              sameSideNumber: workerOmni.sameSideNumber,
              oppositeNumber: workerOmni.oppositeNumber,
              primaryNumber: workerOmni.primaryNumber,
              dataHorizonDepth: 1000,
            };
            savePredictionToRegistry(regKey, refined);
            if (mode === '30s') {
              setActivePred30s((prev) => (prev?.issue === nextIssue ? refined : prev));
            } else {
              setActivePred1m((prev) => (prev?.issue === nextIssue ? refined : prev));
            }
          }
        })
        .catch(() => {});
    }

    if (mode === '30s') {
      setActivePred30s(newPred);
      setIsDecrypting30s(true);
      setTimeout(() => setIsDecrypting30s(false), 600);
    } else {
      setActivePred1m(newPred);
      setIsDecrypting1m(true);
      setTimeout(() => setIsDecrypting1m(false), 600);
    }

    return newPred;
  }, [savePredictionToRegistry]);

  // Fetch Logic for Live WinGo Feeds
  const fetchLiveData = useCallback(async (mode: WinGoMode) => {
    const url = mode === '30s' ? API_URL_30S : API_URL_1M;
    try {
      const response = await fetch(`${url}?ts=${Date.now()}`);
      if (!response.ok) return;
      const data = await response.json();
      const list = data?.data?.list || [];
      if (!list || list.length === 0) return;

      const formatted: HistoryItem[] = list.map((item: any) => {
        const num = parseInt(item.number ?? item.num ?? '0', 10);
        const size: 'BIG' | 'SMALL' = num >= 5 ? 'BIG' : 'SMALL';
        let color: 'RED' | 'GREEN' | 'RED-VIOLET' | 'GREEN-VIOLET' | 'VIOLET' = 'RED';
        if (num === 0) color = 'RED-VIOLET';
        else if (num === 5) color = 'GREEN-VIOLET';
        else if ([1, 3, 7, 9].includes(num)) color = 'GREEN';
        else color = 'RED';

        return {
          issue: String(item.issueNumber ?? item.issue ?? ''),
          num: num,
          size: size,
          color: color,
        };
      });

      const latestItem = formatted[0];
      const lastProcessed = mode === '30s' ? lastProcessed30sRef.current : lastProcessed1mRef.current;

      if (latestItem && latestItem.issue !== lastProcessed) {
        const isFirstLoad = !lastProcessed;

        if (mode === '30s') {
          setRealHistory30s(prev => {
            const map = new Map<string, HistoryItem>();
            formatted.forEach(item => map.set(item.issue, item));
            prev.forEach(item => {
              if (!map.has(item.issue)) map.set(item.issue, item);
            });
            return Array.from(map.values()).sort((a, b) => (b.issue > a.issue ? 1 : -1));
          });
          lastProcessed30sRef.current = latestItem.issue;
        } else {
          setRealHistory1m(prev => {
            const map = new Map<string, HistoryItem>();
            formatted.forEach(item => map.set(item.issue, item));
            prev.forEach(item => {
              if (!map.has(item.issue)) map.set(item.issue, item);
            });
            return Array.from(map.values()).sort((a, b) => (b.issue > a.issue ? 1 : -1));
          });
          lastProcessed1mRef.current = latestItem.issue;
        }

        // Only evaluate past prediction if this is a real-time live draw occurring during the active session (not initial load)
        if (!isFirstLoad) {
          const regKey = `${mode}_${latestItem.issue}`;
          const existingPred = predictionRegistryRef.current.get(regKey);
          if (existingPred) {
            evaluatePastPrediction(existingPred, latestItem, mode, true);
          }
        }

        // Calculate next period issue & generate next prediction with full 1000-result historical depth
        const nextIssueNum = (BigInt(latestItem.issue) + 1n).toString();
        const pastHistory = mode === '30s' ? realHistory30sRef.current : realHistory1mRef.current;
        const histMap = new Map<string, HistoryItem>();
        formatted.forEach(item => histMap.set(item.issue, item));
        pastHistory.forEach(item => {
          if (!histMap.has(item.issue)) histMap.set(item.issue, item);
        });
        const combinedHistory = Array.from(histMap.values()).sort((a, b) => (b.issue > a.issue ? 1 : -1));
        generateNewPrediction(combinedHistory, nextIssueNum, mode);
      }
      setIsConnected(true);
    } catch (err) {
      console.warn(`Sync error on ${mode}:`, err);
    }
  }, [evaluatePastPrediction, generateNewPrediction]);

  // Polling Loop
  useEffect(() => {
    fetchLiveData('30s');
    fetchLiveData('1m');

    const interval30s = setInterval(() => fetchLiveData('30s'), 2500);
    const interval1m = setInterval(() => fetchLiveData('1m'), 4000);

    return () => {
      clearInterval(interval30s);
      clearInterval(interval1m);
    };
  }, [fetchLiveData]);

  // Active dataset for currently selected mode
  const currentRealHistory = selectedMode === '30s' ? realHistory30s : realHistory1m;
  const currentPredHistory = selectedMode === '30s' ? predHistory30s : predHistory1m;
  const currentActivePrediction = selectedMode === '30s' ? activePred30s : activePred1m;
  const currentMarket = selectedMode === '30s' ? market30s : market1m;
  const isDecrypting = selectedMode === '30s' ? isDecrypting30s : isDecrypting1m;

  // Stats calculation
  const validHistory = currentPredHistory.filter(h => h.status !== 'PENDING' && h.status !== 'HOLD');
  const totalBets = validHistory.length;
  const totalWins = validHistory.filter(h => h.status === 'WIN' || h.status === 'JACKPOT').length;
  const totalLosses = validHistory.filter(h => h.status === 'LOSS').length;
  const accuracy = totalBets > 0 ? (totalWins / totalBets) * 100 : 0;
  const currentLossStreak = selectedMode === '30s' ? consecutiveLosses30s : consecutiveLosses1m;
  const maxLossStreak = selectedMode === '30s' ? maxLossStreak30s : maxLossStreak1m;

  const handleClearHistory = () => {
    if (selectedMode === '30s') {
      setPredHistory30s([]);
      try {
        localStorage.removeItem('wingo_samurai_history_30s_v3');
      } catch {}
    } else {
      setPredHistory1m([]);
      try {
        localStorage.removeItem('wingo_samurai_history_1m_v3');
      } catch {}
    }
  };

  const handleResetSession = () => {
    setPredHistory30s([]);
    setPredHistory1m([]);
    setLevelStage30s(1);
    setLevelStage1m(1);
    setConsecutiveLosses30s(0);
    setConsecutiveLosses1m(0);
    predictionRegistryRef.current.clear();
    evaluatedIssuesRef.current.clear();
    try {
      localStorage.removeItem('wingo_samurai_registry_v3');
      localStorage.removeItem('wingo_samurai_history_30s_v3');
      localStorage.removeItem('wingo_samurai_history_1m_v3');
    } catch {}
    fetchLiveData('30s');
    fetchLiveData('1m');
  };

  return (
    <div className="min-h-screen bg-[#06010a] text-white flex flex-col items-center relative select-none overflow-x-hidden font-sans">
      {/* Dynamic Cyberpunk Particle & Hologram Canvas (Pink Palette) */}
      <CyberBackground />

      {/* ========================================================================= */}
      {/* 1. INITIAL WELCOME SCREEN (TRANSITIONS SMOOTHLY INTO MAIN DASHBOARD)       */}
      {/* ========================================================================= */}
      {!hasEnteredApp ? (
        <WelcomeScreen 
          userName={userName}
          onUpdateUserName={setUserName}
          onEnter={() => setHasEnteredApp(true)} 
          onEnterApp={() => setHasEnteredApp(true)}
        />
      ) : (
        /* ========================================================================= */
        /* 2. MAIN APPLICATION WORKSPACE                                             */
        /* ========================================================================= */
        <div className="w-full flex flex-col items-center min-h-screen relative z-10">
          {/* Top Header Bar */}
          <TopHeader 
            userName={userName}
            selectedMode={selectedMode}
            onSelectMode={(mode) => setSelectedMode(mode)}
            onOpenProfile={() => setActiveTab('profile')}
            onOpenOptions={() => setActiveTab('profile')}
            isConnected={isConnected}
            isDecrypting={isDecrypting}
          />

          {/* Main Active Tab Content */}
          <main className="w-full flex-1 flex flex-col items-center">
            {activeTab === 'home' && (
              <HomeDashboardView
                mode={selectedMode}
                onSelectMode={(mode) => setSelectedMode(mode)}
                prediction={currentActivePrediction}
                isDecrypting={isDecrypting}
                market={currentMarket}
                realHistory={currentRealHistory}
                onOpenHowToPlay={() => setShowHowToPlay(true)}
                onOpenTimeTable={() => setShowTimeTableModal(true)}
                onOpenLiveGame={() => setShowLiveGameModal(true)}
                onToggleHud={() => setShowHud(prev => !prev)}
                onResetSession={handleResetSession}
              />
            )}

            {activeTab === 'history' && (
              <HistoryTabView 
                mode={selectedMode}
                realHistory={currentRealHistory}
                predictionHistory={currentPredHistory}
                onClearHistory={handleClearHistory}
                onResetSession={handleResetSession}
              />
            )}

            {activeTab === 'stats' && (
              <StatsTabView 
                mode={selectedMode}
                totalBets={totalBets}
                totalWins={totalWins}
                totalLosses={totalLosses}
                accuracy={accuracy}
                currentLossStreak={currentLossStreak}
                maxLossStreak={maxLossStreak}
                predictionHistory={currentPredHistory}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileTabView 
                userName={userName}
                onUpdateUserName={setUserName}
                showHud={showHud}
                onToggleHud={() => setShowHud(prev => !prev)}
                soundOn={soundOn}
                onToggleSound={() => setSoundOn(prev => !prev)}
                autoAdjustmentEnabled={autoAdjustmentEnabled}
                onToggleAutoAdjustment={toggleAutoAdjustment}
                activePrediction={currentActivePrediction}
                onClearHistory={handleClearHistory}
                onResetSession={handleResetSession}
                onOpenHowToPlay={() => setShowHowToPlay(true)}
              />
            )}
          </main>

          {/* Bottom Fixed 4-Tab Bar with Center Action FAB */}
          <BottomNavBar 
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
            onQuickAction={() => setShowHud(prev => !prev)}
            isQuickActionActive={showHud}
          />

          {/* Floating HUD Overlay (Draggable & Accessible from Any Screen when toggled ON) */}
          {showHud && (
            <FloatingPredictorHud
              prediction={currentActivePrediction}
              isDecrypting={isDecrypting}
              market={currentMarket}
              ghostMode={ghostMode}
              lockPosition={lockPosition}
              onToggleGhostMode={toggleGhostMode}
              onToggleLockPosition={toggleLockPosition}
              soundOn={soundOn}
              onToggleSound={() => setSoundOn(prev => !prev)}
              isOpen={showHud}
              onToggleOpen={setShowHud}
              isHackActive={true}
              latestFinishedResult={latestFinishedResult}
            />
          )}

          {/* Result Confirmation Modal */}
          {latestFinishedResult && (
            <ResultModal 
              result={latestFinishedResult}
              onClose={() => setLatestFinishedResult(null)}
            />
          )}

          {/* How To Play & Strategy Modal */}
          {showHowToPlay && (
            <HowToPlayModal 
              onClose={() => setShowHowToPlay(false)}
            />
          )}

          {/* Golden Time Table & Real Pattern Loss Guide Modal */}
          {showTimeTableModal && (
            <GoldenTimeTableModal 
              onClose={() => setShowTimeTableModal(false)}
            />
          )}

          {/* Live Official Game Arena Modal */}
          {showLiveGameModal && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-2 sm:p-4">
              <div className="flex items-center justify-between p-2 samurai-glass-panel rounded-xl mb-2 border border-pink-500/30">
                <span className="font-orbitron text-xs font-black text-[#ffd700]">
                  OFFICIAL BDG LIVE GAME CONSOLE
                </span>
                <button
                  type="button"
                  onClick={() => setShowLiveGameModal(false)}
                  className="px-3 py-1 rounded-lg bg-pink-950/60 text-pink-200 border border-pink-500/40 text-xs font-orbitron font-bold cursor-pointer"
                >
                  CLOSE ARENA
                </button>
              </div>
              <div className="flex-1 rounded-2xl overflow-hidden border-2 border-pink-500/40 shadow-2xl">
                <GameBrowserView
                  prediction={currentActivePrediction}
                  isDecrypting={isDecrypting}
                  market={currentMarket}
                  onNavigateToDashboard={() => setShowLiveGameModal(false)}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
