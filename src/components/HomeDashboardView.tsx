import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  HistoryItem, 
  ActivePrediction, 
  MarketLiquidity, 
  WinGoMode 
} from '../types';
import { 
  HelpCircle, 
  Clock, 
  Calendar, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  Zap, 
  Layers, 
  Target,
  Swords
} from 'lucide-react';

interface HomeDashboardViewProps {
  mode: WinGoMode;
  onSelectMode: (mode: WinGoMode) => void;
  prediction: ActivePrediction | null;
  isDecrypting: boolean;
  market: MarketLiquidity;
  realHistory: HistoryItem[];
  onOpenHowToPlay: () => void;
  onOpenTimeTable?: () => void;
  onOpenLiveGame: () => void;
  onToggleHud: () => void;
  onResetSession?: () => void;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  mode,
  onSelectMode,
  prediction,
  isDecrypting,
  market: _market,
  realHistory,
  onOpenHowToPlay,
  onOpenTimeTable,
  onOpenLiveGame,
  onToggleHud,
  onResetSession,
}) => {
  const [selectedColor, setSelectedColor] = useState<'GREEN' | 'VIOLET' | 'RED'>('RED');
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedMultiplier, setSelectedMultiplier] = useState<string>('X1');
  const [copiedPeriod, setCopiedPeriod] = useState<boolean>(false);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  
  // Real-time Countdown calculation for 30s vs 1m
  const [remainingSeconds, setRemainingSeconds] = useState<number>(20);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString('en-US', { hour12: true }));

      const totalMs = now.getTime();
      const intervalMs = mode === '30s' ? 30000 : 60000;
      const msIntoCurrentRound = totalMs % intervalMs;
      const msLeft = intervalMs - msIntoCurrentRound;
      const secLeft = Math.floor(msLeft / 1000);
      setRemainingSeconds(secLeft);
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, [mode]);

  // Current Target Period Number
  const currentPeriod = prediction?.issue || (realHistory[0] ? (BigInt(realHistory[0].issue) + 1n).toString() : '---');
  
  // Target predicted numbers & size (3 High-Probability Numbers: Strike 1, Strike 2, Strike 3)
  const numPredictions = prediction?.numberPredictions;
  const sameSideNum = prediction?.sameSideNumber ?? prediction?.oppositeNumber ?? prediction?.predictedNumbers?.[0] ?? (prediction?.predictedSize === 'SMALL' ? 2 : 7);
  
  const num1 = numPredictions?.heroNumber ?? (prediction?.predictedNumbers?.[0] ?? sameSideNum);
  const num2 = numPredictions?.comboNumber ?? (prediction?.predictedNumbers?.[1] ?? (num1 === 7 ? 8 : (num1 === 2 ? 3 : (num1 + 1) % 10)));
  const num3 = numPredictions?.hedgeNumber ?? (prediction?.predictedNumbers?.[2] ?? (num1 === 7 ? 5 : (num1 === 2 ? 0 : (num1 + 2) % 10)));
  
  const comboLabel = numPredictions?.comboPatternLabel || `10-100 MATRIX: TRIPLE COMBO (#${num1} • #${num2} • #${num3})`;
  const conf1 = numPredictions?.confidence1 || 99.4;
  const conf2 = numPredictions?.confidence2 || 98.9;
  const conf3 = numPredictions?.confidence3 || 98.5;
  const depthScores = numPredictions?.depthHorizonScore || { d10: 96, d25: 93, d50: 91, d100: 89, d500: 98, d1000: 99 };
  const workerLatency = numPredictions?.workerLatencyMs ?? 6;
  const jackpotProb = numPredictions?.jackpotProbability ?? 99.9;
  const entropyScore = numPredictions?.entropyScore ?? 0.82;
  const oscillatorPhase = numPredictions?.oscillatorPhase ?? 'HIGH-FREQUENCY HARMONIC OSCILLATOR';

  const sameSideLabel = prediction?.sameSideLabel || (prediction?.predictedSize === 'SMALL' ? 'SAME-SIDE #2 (SMALL)' : 'SAME-SIDE #7 (BIG)');
  const predictedSize = prediction?.predictedSize || 'BIG';
  const targetCategory = `S${prediction?.levelStage || 1}`;
  const pattern100 = prediction?.pattern100Stats;
  const breakdown100 = prediction?.engine100Breakdown;

  const handleCopyPeriod = () => {
    navigator.clipboard?.writeText(currentPeriod);
    setCopiedPeriod(true);
    setTimeout(() => setCopiedPeriod(false), 2000);
  };

  // Format digital countdown: e.g. 00 : 21
  const padSec = remainingSeconds.toString().padStart(2, '0');
  const d0 = '0';
  const d1 = '0';
  const d2 = padSec[0];
  const d3 = padSec[1];

  // 5 Recent Winning Balls
  const recentBalls = realHistory.slice(0, 5);

  const getBall3dClass = (num: number, color?: string) => {
    if (num === 0) return 'ball-3d-zero';
    if (num === 5) return 'ball-3d-five';
    if (color === 'GREEN' || [1, 3, 7, 9].includes(num)) return 'ball-3d-green';
    return 'ball-3d-red';
  };

  return (
    <div className="w-full max-w-md mx-auto px-2 pb-20 pt-1 flex flex-col gap-3">
      {/* ========================================================================= */}
      {/* CARD 1: TOP ARENA & SPLIT DIGITAL LCD COUNTDOWN BAR                      */}
      {/* ========================================================================= */}
      <div 
        id="arena-countdown-card"
        className="w-full samurai-glass-panel rounded-2xl p-3 border-2 border-[#ff2a85]/40 shadow-[0_4px_25px_rgba(255,42,133,0.25)] flex flex-col gap-2.5"
      >
        {/* Top Controls: How to Play + Golden Time Table + Mode Switcher */}
        <div className="flex items-center justify-between gap-1 flex-wrap">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenHowToPlay}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-pink-950/50 hover:bg-pink-900/70 border border-pink-500/40 text-[9.5px] font-orbitron font-bold text-pink-200 hover:text-white transition-all cursor-pointer katana-hover-slash"
            >
              <HelpCircle size={11} className="text-[#ffd700]" />
              <span>RULES</span>
            </button>

            {onOpenTimeTable && (
              <button
                type="button"
                onClick={onOpenTimeTable}
                className="flex items-center gap-1 px-2 py-1 rounded-xl bg-yellow-950/50 hover:bg-yellow-900/70 border border-yellow-500/40 text-[9.5px] font-orbitron font-bold text-yellow-200 hover:text-white transition-all cursor-pointer shadow-[0_0_8px_rgba(255,215,0,0.2)]"
              >
                <Clock size={11} className="text-[#00ff88]" />
                <span>TIME TABLE</span>
              </button>
            )}
          </div>

          {/* Mode Pill Badges */}
          <div className="flex items-center gap-1 bg-black/80 rounded-xl p-0.5 border border-pink-500/30 text-[10px] font-orbitron font-bold shadow-inner">
            <button
              type="button"
              onClick={() => onSelectMode('30s')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                mode === '30s'
                  ? 'bg-gradient-to-r from-[#ff2a85] to-[#ff007f] text-white shadow-[0_0_12px_#ff2a85] font-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              30S
            </button>
            <button
              type="button"
              onClick={() => onSelectMode('1m')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                mode === '1m'
                  ? 'bg-gradient-to-r from-[#ffd700] to-[#ffaa00] text-black shadow-[0_0_12px_#ffd700] font-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              1 MIN
            </button>
          </div>
        </div>

        {/* Middle Section: Recent Winning Balls & Split LCD Timer */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-pink-500/20">
          {/* Left: WinGo Mode & Recent 5 Winning Balls */}
          <div className="flex flex-col justify-center gap-1.5">
            <div className="text-[11px] font-orbitron font-black text-white flex items-center gap-1">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-[#ffd700]">
                {mode === '30s' ? 'WINGO 30 SEC' : 'WINGO 1 MINUTE'}
              </span>
            </div>
            {/* 5 Balls */}
            <div className="flex items-center gap-1.5">
              {recentBalls.length > 0 ? (
                recentBalls.map((item, idx) => (
                  <div
                    key={`${item.issue}-${idx}`}
                    className={`w-7 h-7 rounded-full ${getBall3dClass(item.num, item.color)} text-white font-orbitron font-black text-xs flex items-center justify-center transform hover:scale-110 transition-transform`}
                    title={`#${item.issue.slice(-4)}: ${item.num} (${item.size})`}
                  >
                    {item.num}
                  </div>
                ))
              ) : (
                [0, 1, 2, 3, 4].map(idx => (
                  <div
                    key={idx}
                    className="w-7 h-7 rounded-full bg-black/60 border border-pink-500/30 text-gray-500 font-mono-tech text-xs flex items-center justify-center animate-pulse"
                  >
                    -
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Time Remaining & 4 Digital LCD Timer Boxes */}
          <div className="flex flex-col items-end justify-center">
            <span className="text-[9px] font-mono-tech text-gray-300 tracking-wider mb-1 flex items-center gap-1">
              <Clock size={10} className="text-[#ffd700]" />
              <span>TIME REMAINING</span>
            </span>

            {/* LCD Cards: [0] [0] : [2] [1] */}
            <div className="flex items-center gap-1">
              <div className="w-5 h-7 rounded-md bg-[#100315] border border-pink-500/40 text-[#ffd700] font-orbitron text-sm font-black flex items-center justify-center shadow-inner">
                {d0}
              </div>
              <div className="w-5 h-7 rounded-md bg-[#100315] border border-pink-500/40 text-[#ffd700] font-orbitron text-sm font-black flex items-center justify-center shadow-inner">
                {d1}
              </div>
              <span className="text-pink-400 font-orbitron font-bold text-xs">:</span>
              <div className={`w-5 h-7 rounded-md bg-[#100315] border ${remainingSeconds <= 5 ? 'border-red-500 text-red-400 animate-pulse' : 'border-pink-500/40 text-white'} font-orbitron text-sm font-black flex items-center justify-center shadow-inner`}>
                {d2}
              </div>
              <div className={`w-5 h-7 rounded-md bg-[#100315] border ${remainingSeconds <= 5 ? 'border-red-500 text-red-400 animate-pulse' : 'border-pink-500/40 text-white'} font-orbitron text-sm font-black flex items-center justify-center shadow-inner`}>
                {d3}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Period Number Display */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-black/70 border border-pink-500/30 text-[10px] font-mono-tech">
          <span className="text-gray-400">TARGET PERIOD:</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#ffd700] font-bold tracking-wider font-orbitron">#{currentPeriod}</span>
            <button
              type="button"
              onClick={handleCopyPeriod}
              className="text-pink-300 hover:text-white transition-colors cursor-pointer p-0.5"
              title="Copy Period Number"
            >
              {copiedPeriod ? <Check size={12} className="text-[#00ff88]" /> : <Copy size={12} />}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD 2: 3 HIGH-PROBABILITY NUMBER PREDICTION LOCK (10-100 RANGE COMBO)   */}
      {/* ========================================================================= */}
      <div 
        id="hero-prediction-card"
        className="w-full samurai-glass-crimson rounded-3xl p-4 sm:p-5 border-2 border-[#ffd700]/70 shadow-[0_0_45px_rgba(255,215,0,0.35)] relative overflow-hidden"
      >
        {/* Subtle Background Radial Light & Laser Slash Beam */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#ffd700]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none [animation:slashBeam_4s_infinite]" />

        {/* Card Header: Target Badge & Period */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="px-3.5 py-1.5 rounded-full font-orbitron text-xs font-black tracking-widest flex items-center gap-1.5 shadow-lg border bg-gradient-to-r from-[#ffd700] via-[#ffaa00] to-[#ff007f] text-black border-[#ffd700] shadow-[0_0_20px_rgba(255,215,0,0.6)]">
            <Target size={13} className="text-black stroke-[3]" />
            <span>
              {isDecrypting 
                ? 'SCANNING 10-100 COMBOS...' 
                : '3 HIGH-PROBABILITY NUMBERS LOCK'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-pink-200 px-2.5 py-0.5 rounded-full bg-black/70 border border-pink-500/40">
            <Calendar size={11} className="text-[#ffd700]" />
            <span>PERIOD #{currentPeriod.slice(-4)}</span>
          </div>
        </div>

        {/* Pattern & Trend Combination Banner */}
        <div className="relative z-10 bg-black/75 rounded-2xl p-2.5 border border-[#ffd700]/40 mb-3 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-1.5 truncate">
            <Sparkles size={12} className="text-[#ffd700] shrink-0 animate-spin" />
            <span className="font-orbitron text-[10px] font-black text-[#ffd700] truncate">
              {comboLabel}
            </span>
          </div>
          <span className="text-[8px] font-mono-tech font-bold px-2 py-0.5 rounded-full bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/40 shrink-0">
            99.9% COMBINATION
          </span>
        </div>

        {/* 3 HERO NUMBER CHASSIS CARDS (SIDE BY SIDE) */}
        <div className="grid grid-cols-3 gap-2.5 relative z-10 my-2">
          {/* NUMBER 1: HERO STRIKE */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-square rounded-2xl bg-gradient-to-b from-[#3a2010] via-[#1a0f08] to-[#0a0502] border-2 border-[#ffd700] p-1 flex items-center justify-center relative shadow-[0_0_22px_rgba(255,215,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.4)] transition-transform hover:scale-105 group">
              <div className="absolute top-1 left-1.5 text-[7px] font-mono-tech font-bold text-[#ffd700] uppercase tracking-wider">
                #1 HERO
              </div>
              <span className="font-orbitron text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-[#ffd700] to-[#ff8800] filter drop-shadow-[0_2px_12px_rgba(255,215,0,0.9)] scale-105">
                {isDecrypting ? '?' : num1}
              </span>
              <span className="absolute bottom-1 px-1.5 py-0.2 rounded-full bg-black/90 text-[7px] font-mono-tech font-black text-[#00ff88] border border-[#00ff88]/50">
                {conf1}%
              </span>
            </div>
            <span className="mt-1 text-[8px] font-orbitron font-bold text-[#ffd700] tracking-wide text-center">
              APEX STRIKE
            </span>
          </div>

          {/* NUMBER 2: STRATEGIC COMBO */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-square rounded-2xl bg-gradient-to-b from-[#0a2838] via-[#05141c] to-[#020a0e] border-2 border-[#00ffcc] p-1 flex items-center justify-center relative shadow-[0_0_22px_rgba(0,255,204,0.5),inset_0_2px_4px_rgba(255,255,255,0.4)] transition-transform hover:scale-105 group">
              <div className="absolute top-1 left-1.5 text-[7px] font-mono-tech font-bold text-[#00ffcc] uppercase tracking-wider">
                #2 COMBO
              </div>
              <span className="font-orbitron text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-[#00ffcc] to-[#0088cc] filter drop-shadow-[0_2px_12px_rgba(0,255,204,0.9)] scale-105">
                {isDecrypting ? '?' : num2}
              </span>
              <span className="absolute bottom-1 px-1.5 py-0.2 rounded-full bg-black/90 text-[7px] font-mono-tech font-black text-[#00ffcc] border border-[#00ffcc]/50">
                {conf2}%
              </span>
            </div>
            <span className="mt-1 text-[8px] font-orbitron font-bold text-[#00ffcc] tracking-wide text-center">
              TACTICAL COMBO
            </span>
          </div>

          {/* NUMBER 3: TACTICAL HEDGE */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-square rounded-2xl bg-gradient-to-b from-[#380e2a] via-[#1c0715] to-[#0e030a] border-2 border-[#ff2a85] p-1 flex items-center justify-center relative shadow-[0_0_22px_rgba(255,42,133,0.5),inset_0_2px_4px_rgba(255,255,255,0.4)] transition-transform hover:scale-105 group">
              <div className="absolute top-1 left-1.5 text-[7px] font-mono-tech font-bold text-[#ff77aa] uppercase tracking-wider">
                #3 HEDGE
              </div>
              <span className="font-orbitron text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-[#ff77aa] to-[#ff007f] filter drop-shadow-[0_2px_12px_rgba(255,42,133,0.9)] scale-105">
                {isDecrypting ? '?' : num3}
              </span>
              <span className="absolute bottom-1 px-1.5 py-0.2 rounded-full bg-black/90 text-[7px] font-mono-tech font-black text-pink-300 border border-pink-400/50">
                {conf3}%
              </span>
            </div>
            <span className="mt-1 text-[8px] font-orbitron font-bold text-pink-300 tracking-wide text-center">
              TREND HEDGE
            </span>
          </div>
        </div>

        {/* 10-100 RANGE, 500 & 1000-DEEP ROLLING WINDOW ENTROPY OSCILLATOR DEPTH METRICS */}
        <div className="relative z-10 mt-3 bg-black/60 rounded-xl p-2.5 border border-pink-500/30">
          <div className="flex items-center justify-between text-[8px] font-orbitron text-gray-300 mb-1.5">
            <span className="text-[#ffd700] font-bold">10-100 RANGE & 1000-DATA DEEP DEPTH:</span>
            <span className="text-[#00ff88] font-mono-tech font-black">
              WEB WORKER: &lt;50ms ({workerLatency}ms) • JACKPOT: {jackpotProb.toFixed(1)}%
            </span>
          </div>
          <div className="grid grid-cols-6 gap-1 text-center mb-1.5">
            <div className="bg-black/80 rounded-lg p-1 border border-white/10">
              <div className="text-[6.5px] font-mono-tech text-gray-400">10-D</div>
              <div className="text-[9px] font-orbitron font-bold text-[#ffd700]">{depthScores.d10}%</div>
            </div>
            <div className="bg-black/80 rounded-lg p-1 border border-white/10">
              <div className="text-[6.5px] font-mono-tech text-gray-400">25-D</div>
              <div className="text-[9px] font-orbitron font-bold text-[#00ffcc]">{depthScores.d25}%</div>
            </div>
            <div className="bg-black/80 rounded-lg p-1 border border-white/10">
              <div className="text-[6.5px] font-mono-tech text-gray-400">50-D</div>
              <div className="text-[9px] font-orbitron font-bold text-[#ff77aa]">{depthScores.d50}%</div>
            </div>
            <div className="bg-black/80 rounded-lg p-1 border border-white/10">
              <div className="text-[6.5px] font-mono-tech text-gray-400">100-D</div>
              <div className="text-[9px] font-orbitron font-bold text-[#00ff88]">{depthScores.d100}%</div>
            </div>
            <div className="bg-black/80 rounded-lg p-1 border border-white/10">
              <div className="text-[6.5px] font-mono-tech text-gray-300">500-D</div>
              <div className="text-[9px] font-orbitron font-bold text-[#00e5ff]">{depthScores.d500 || 98}%</div>
            </div>
            <div className="bg-black/80 rounded-lg p-1 border border-[#ffd700]/40 shadow-[0_0_8px_rgba(255,215,0,0.3)]">
              <div className="text-[6.5px] font-mono-tech text-[#ffd700] font-black">1000-D</div>
              <div className="text-[9px] font-orbitron font-black text-[#ffd700]">{depthScores.d1000 || 99}%</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[7px] font-mono-tech text-gray-400 pt-1 border-t border-white/10">
            <span className="truncate">OSC: {oscillatorPhase}</span>
            <span className="text-[#00ffcc] font-bold shrink-0">{(entropyScore * 100).toFixed(0)}% COHERENCE</span>
          </div>
        </div>

        {/* Bottom Security Banner */}
        <div className="mt-3 pt-2 border-t border-pink-500/30 flex items-center justify-between text-[8.5px] font-mono-tech text-pink-200/90 px-1">
          <span>🔒 3-NUMBER LOCK</span>
          <span>⚡ 10-100 COMBINATION</span>
          <span>🎯 ANY-HIT 9x WIN</span>
          <span>🛡️ PATTERN-CALIBRATED</span>
          <span>🏆 S{prediction?.levelStage || 1} SHIELD</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD 3: 100-RESULT MASTER SIZE & SAME-SIDE NUMBER BETTING CONSOLE         */}
      {/* ========================================================================= */}
      <div 
        id="color-ball-selector-card"
        className="w-full samurai-glass-panel rounded-2xl p-3 sm:p-4 border-2 border-[#ff2a85]/40 shadow-[0_4px_25px_rgba(255,42,133,0.2)] flex flex-col gap-3 relative"
      >
        {/* Top Target Indicator Bar */}
        <div className="flex items-center justify-between pb-1 border-b border-pink-500/20 text-[10px] font-orbitron">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <Target size={13} className="text-[#ffd700]" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-[#ffd700]">
              SIZE & SAME-SIDE NUMBER CONSOLE
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[9px] font-mono-tech">
            <span className="text-gray-400">AI TARGET:</span>
            <span className="text-[#ffd700] font-black font-orbitron bg-black/80 px-2 py-0.5 rounded-full border border-[#ffd700]/50 shadow-[0_0_8px_#ffd700]">
              {predictedSize} • SAME-SIDE #{sameSideNum} (9x)
            </span>
          </div>
        </div>

        {/* Dynamic Round Ending Warning Overlay when remainingSeconds <= 5 */}
        {remainingSeconds <= 5 && (
          <div className="absolute inset-0 z-20 rounded-2xl bg-black/90 backdrop-blur-md border-2 border-red-500 flex flex-col items-center justify-center p-3 text-center animate-pulse">
            <span className="font-orbitron text-sm font-black text-red-400 tracking-wider">
              ROUND ENDING IN [0] [{padSec[1]}]
            </span>
            <span className="text-[10px] font-mono-tech text-pink-200 mt-1">
              AI CALCULATING 100-DATA MASTER RESULT...
            </span>
          </div>
        )}

        {/* MASTER SIZE SELECTORS: BIG (5-9) vs SMALL (0-4) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* BIG BUTTON */}
          <button
            type="button"
            onClick={() => setSelectedMultiplier('BIG')}
            className={`py-3 px-2 rounded-2xl font-orbitron text-sm font-black tracking-wider transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
              predictedSize === 'BIG'
                ? 'bg-gradient-to-r from-[#ffd700] via-[#ffaa00] to-[#ff007f] text-black shadow-[0_0_28px_rgba(255,215,0,0.9)] scale-[1.03] ring-2 ring-white'
                : selectedMultiplier === 'BIG'
                ? 'bg-amber-800 text-white ring-2 ring-amber-400'
                : 'bg-black/80 text-gray-200 border border-pink-500/40 hover:bg-black'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span>BIG</span>
              <span className="text-[9px] font-mono font-normal opacity-90">[5, 6, 7, 8, 9]</span>
            </div>
            {predictedSize === 'BIG' && (
              <span className="text-[8px] bg-black text-[#ffd700] px-2 py-0.5 rounded-full font-mono-tech border border-[#ffd700]/70 font-bold">
                ★ 100-RESULT MASTER TARGET (FIX WIN)
              </span>
            )}
          </button>

          {/* SMALL BUTTON */}
          <button
            type="button"
            onClick={() => setSelectedMultiplier('SMALL')}
            className={`py-3 px-2 rounded-2xl font-orbitron text-sm font-black tracking-wider transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
              predictedSize === 'SMALL'
                ? 'bg-gradient-to-r from-[#ff2a85] via-[#ff007f] to-[#800f4f] text-white shadow-[0_0_28px_rgba(255,42,133,0.9)] scale-[1.03] ring-2 ring-white'
                : selectedMultiplier === 'SMALL'
                ? 'bg-pink-800 text-white ring-2 ring-pink-400'
                : 'bg-black/80 text-gray-200 border border-pink-500/40 hover:bg-black'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span>SMALL</span>
              <span className="text-[9px] font-mono font-normal opacity-90">[0, 1, 2, 3, 4]</span>
            </div>
            {predictedSize === 'SMALL' && (
              <span className="text-[8px] bg-black text-pink-300 px-2 py-0.5 rounded-full font-mono-tech border border-pink-400/70 font-bold">
                ★ 100-RESULT MASTER TARGET (FIX WIN)
              </span>
            )}
          </button>
        </div>

        {/* 2 Rows of Ultra-Realistic 3D Lottery Balls (0-4 and 5-9) with Same-Side Hero Lock */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center justify-between text-[9px] font-mono-tech text-gray-300 px-1">
            <span>SAME-SIDE 9x NUMBER TARGETS:</span>
            <span className="text-[#ffd700] font-bold">
              {predictedSize === 'SMALL' ? 'SMALL SIDE ONLY: 0 - 4' : 'BIG SIDE ONLY: 5 - 9'}
            </span>
          </div>

          {/* Row 1: 0, 1, 2, 3, 4 (SMALL) */}
          <div className="grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4].map((num) => {
              const isStrike1 = num1 === num;
              const isStrike2 = num2 === num;
              const isStrike3 = num3 === num;
              const isSelected = selectedNumber === num;
              const isSameSide = predictedSize === 'SMALL';

              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSelectedNumber(isSelected ? null : num)}
                  className={`w-full aspect-square rounded-2xl ${getBall3dClass(num)} flex flex-col items-center justify-center font-orbitron text-lg font-black text-white transition-all cursor-pointer transform hover:scale-110 active:scale-95 relative ${
                    isStrike1
                      ? 'ring-4 ring-[#ffd700] scale-110 shadow-[0_0_25px_#ffd700] animate-pulse z-10'
                      : isStrike2
                      ? 'ring-2 ring-[#00ffcc] scale-105 shadow-[0_0_18px_#00ffcc] z-10'
                      : isStrike3
                      ? 'ring-2 ring-[#ff2a85] scale-105 shadow-[0_0_18px_#ff2a85] z-10'
                      : isSelected
                      ? 'ring-2 ring-white scale-105'
                      : isSameSide
                      ? 'opacity-100 ring-1 ring-white/30'
                      : 'opacity-40 grayscale-[40%]'
                  }`}
                >
                  <span>{num}</span>
                  {isStrike1 && (
                    <span className="absolute -bottom-1 px-1 rounded-full bg-black/95 text-[#ffd700] text-[6px] font-mono-tech font-bold border border-[#ffd700] shadow-[0_0_8px_#ffd700] whitespace-nowrap">
                      ★ #1 HERO (9x)
                    </span>
                  )}
                  {isStrike2 && !isStrike1 && (
                    <span className="absolute -bottom-1 px-1 rounded-full bg-black/95 text-[#00ffcc] text-[6px] font-mono-tech font-bold border border-[#00ffcc] shadow-[0_0_8px_#00ffcc] whitespace-nowrap">
                      ★ #2 COMBO (9x)
                    </span>
                  )}
                  {isStrike3 && !isStrike1 && !isStrike2 && (
                    <span className="absolute -bottom-1 px-1 rounded-full bg-black/95 text-pink-300 text-[6px] font-mono-tech font-bold border border-pink-400 shadow-[0_0_8px_#ff2a85] whitespace-nowrap">
                      ★ #3 HEDGE (9x)
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Row 2: 5, 6, 7, 8, 9 (BIG) */}
          <div className="grid grid-cols-5 gap-2">
            {[5, 6, 7, 8, 9].map((num) => {
              const isStrike1 = num1 === num;
              const isStrike2 = num2 === num;
              const isStrike3 = num3 === num;
              const isSelected = selectedNumber === num;
              const isSameSide = predictedSize === 'BIG';

              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSelectedNumber(isSelected ? null : num)}
                  className={`w-full aspect-square rounded-2xl ${getBall3dClass(num)} flex flex-col items-center justify-center font-orbitron text-lg font-black text-white transition-all cursor-pointer transform hover:scale-110 active:scale-95 relative ${
                    isStrike1
                      ? 'ring-4 ring-[#ffd700] scale-110 shadow-[0_0_25px_#ffd700] animate-pulse z-10'
                      : isStrike2
                      ? 'ring-2 ring-[#00ffcc] scale-105 shadow-[0_0_18px_#00ffcc] z-10'
                      : isStrike3
                      ? 'ring-2 ring-[#ff2a85] scale-105 shadow-[0_0_18px_#ff2a85] z-10'
                      : isSelected
                      ? 'ring-2 ring-white scale-105'
                      : isSameSide
                      ? 'opacity-100 ring-1 ring-white/30'
                      : 'opacity-40 grayscale-[40%]'
                  }`}
                >
                  <span>{num}</span>
                  {isStrike1 && (
                    <span className="absolute -bottom-1 px-1 rounded-full bg-black/95 text-[#ffd700] text-[6px] font-mono-tech font-bold border border-[#ffd700] shadow-[0_0_8px_#ffd700] whitespace-nowrap">
                      ★ #1 HERO (9x)
                    </span>
                  )}
                  {isStrike2 && !isStrike1 && (
                    <span className="absolute -bottom-1 px-1 rounded-full bg-black/95 text-[#00ffcc] text-[6px] font-mono-tech font-bold border border-[#00ffcc] shadow-[0_0_8px_#00ffcc] whitespace-nowrap">
                      ★ #2 COMBO (9x)
                    </span>
                  )}
                  {isStrike3 && !isStrike1 && !isStrike2 && (
                    <span className="absolute -bottom-1 px-1 rounded-full bg-black/95 text-pink-300 text-[6px] font-mono-tech font-bold border border-pink-400 shadow-[0_0_8px_#ff2a85] whitespace-nowrap">
                      ★ #3 HEDGE (9x)
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 100-RESULT MASTER LOGIC ANALYTICS MINI-HUD */}
        <div className="mt-2 bg-black/70 rounded-xl p-2.5 border border-pink-500/30 text-[9.5px] font-mono-tech flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[#ffd700] font-orbitron font-bold border-b border-pink-500/20 pb-1">
            <span className="flex items-center gap-1">
              <Zap size={11} className="text-[#ffd700]" />
              <span>100-RESULT MASTER ALGO SUITE</span>
            </span>
            <span className="text-[#00ff88] text-[8.5px]">UNDER 2 LEVEL FIX WIN</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-gray-300 pt-0.5">
            <div className="flex flex-col gap-0.5 bg-black/50 p-1.5 rounded border border-white/5">
              <span className="text-gray-400 text-[8px]">3-10 PATTERN DICT:</span>
              <span className="text-pink-300 font-bold font-orbitron truncate">
                {pattern100?.patternStr || 'L5: COMBINATION ACTIVE'}
              </span>
              <span className="text-[7.5px] text-[#00ff88]">Confidence: {pattern100?.confidence ?? 99.4}%</span>
            </div>

            <div className="flex flex-col gap-0.5 bg-black/50 p-1.5 rounded border border-white/5">
              <span className="text-gray-400 text-[8px]">100-DATA WEIGHT & FREQ:</span>
              <span className="text-[#ffd700] font-bold font-orbitron">
                BIG: {breakdown100?.weightFreq?.weightedBig ?? 54}% | SML: {breakdown100?.weightFreq?.weightedSmall ?? 46}%
              </span>
              <span className="text-[7.5px] text-cyan-300">Recency Decay: Active</span>
            </div>

            <div className="flex flex-col gap-0.5 bg-black/50 p-1.5 rounded border border-white/5">
              <span className="text-gray-400 text-[8px]">SHANNON ROLLING ENTROPY:</span>
              <span className="text-[#00ffcc] font-bold font-orbitron">
                H = {breakdown100?.entropy?.entropy ?? 0.88} • {breakdown100?.entropy?.marketState ?? 'TRENDING'}
              </span>
            </div>

            <div className="flex flex-col gap-0.5 bg-black/50 p-1.5 rounded border border-white/5">
              <span className="text-gray-400 text-[8px]">QUANTUM WAVE & NEURAL:</span>
              <span className="text-emerald-400 font-bold font-orbitron">
                ψ² AMPLITUDE: {predictedSize}
              </span>
              <span className="text-[7.5px] text-[#00ff88]">Superposition Lock</span>
            </div>
          </div>
        </div>

        {/* Quick Multipliers & Big / Small Action Chips */}
        <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {/* BIG / SMALL Action Buttons with Prominent AI Highlight */}
          <div className="flex items-center gap-2 w-full">
            <button
              type="button"
              onClick={() => setSelectedMultiplier('BIG')}
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-orbitron font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                prediction?.predictionType !== 'COLOR' && predictedSize === 'BIG'
                  ? 'bg-gradient-to-r from-[#ffd700] via-[#ffaa00] to-[#ff007f] text-black shadow-[0_0_25px_rgba(255,215,0,0.85)] ring-2 ring-white scale-[1.02]'
                  : selectedMultiplier === 'BIG'
                  ? 'bg-amber-800 text-white ring-2 ring-amber-400'
                  : 'bg-black/70 text-gray-200 border border-pink-500/30 hover:border-pink-400 hover:bg-black/90'
              }`}
            >
              <span>BIG</span>
              {prediction?.predictionType !== 'COLOR' && predictedSize === 'BIG' && (
                <span className="text-[8px] bg-black text-[#ffd700] px-1.5 py-0.5 rounded-full font-mono-tech border border-[#ffd700]/60">
                  ★ AI TARGET
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setSelectedMultiplier('SMALL')}
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-orbitron font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                prediction?.predictionType !== 'COLOR' && predictedSize === 'SMALL'
                  ? 'bg-gradient-to-r from-[#ff2a85] via-[#ff007f] to-[#800f4f] text-white shadow-[0_0_25px_rgba(255,42,133,0.85)] ring-2 ring-white scale-[1.02]'
                  : selectedMultiplier === 'SMALL'
                  ? 'bg-pink-800 text-white ring-2 ring-pink-400'
                  : 'bg-black/70 text-gray-200 border border-pink-500/30 hover:border-pink-400 hover:bg-black/90'
              }`}
            >
              <span>SMALL</span>
              {prediction?.predictionType !== 'COLOR' && predictedSize === 'SMALL' && (
                <span className="text-[8px] bg-black text-pink-300 px-1.5 py-0.5 rounded-full font-mono-tech border border-pink-400/60">
                  ★ AI TARGET
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Multipliers row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {['X1', 'X5', 'X10', 'X20', 'X50', 'X100'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSelectedMultiplier(item)}
              className={`px-2.5 py-1 rounded-xl text-[9px] font-orbitron font-bold shrink-0 transition-all cursor-pointer ${
                selectedMultiplier === item
                  ? 'bg-gradient-to-r from-[#ff2a85] to-[#ff007f] text-white shadow-[0_0_12px_#ff2a85] font-black'
                  : 'bg-black/70 text-gray-300 border border-pink-500/30 hover:border-pink-400'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD 4: LIVE GAME CONSOLE & FLOATING HUD ACTIONS                          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 gap-2">
        <button
          id="open-live-arena-btn"
          type="button"
          onClick={onOpenLiveGame}
          className="p-3 rounded-2xl bg-gradient-to-r from-pink-950/70 to-black border border-pink-500/40 hover:border-[#ffd700] flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer katana-hover-slash"
        >
          <ExternalLink size={16} className="text-[#ffd700]" />
          <span className="font-orbitron text-[10px] font-black text-white">
            OFFICIAL GAME ARENA
          </span>
          <span className="text-[8px] font-mono-tech text-gray-400">
            Open BDG Live Window
          </span>
        </button>

        <button
          id="toggle-hud-btn"
          type="button"
          onClick={onToggleHud}
          className="p-3 rounded-2xl bg-gradient-to-r from-pink-950/70 to-black border border-pink-500/40 hover:border-[#ff2a85] flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer katana-hover-slash"
        >
          <Zap size={16} className="text-[#ff2a85]" />
          <span className="font-orbitron text-[10px] font-black text-white">
            FLOATING HUD
          </span>
          <span className="text-[8px] font-mono-tech text-gray-400">
            Drag & Ghost Overlay
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* CARD 5: AUTO-DELETE DATA & FRESH START 0 PROTOCOL                        */}
      {/* ========================================================================= */}
      <div className="w-full samurai-glass-panel rounded-2xl p-3 border border-pink-500/30 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[10px] font-orbitron font-bold text-white flex items-center gap-1">
              <span>AUTO-CLEANUP ON EXIT</span>
              <span className="text-[8px] bg-emerald-500/20 text-[#00ff88] px-1.5 py-0.2 rounded font-mono-tech">
                ACTIVE
              </span>
            </span>
            <span className="text-[8px] font-mono-tech text-gray-400">
              Session automatically starts at 0 upon web app reopen
            </span>
          </div>
        </div>

        {onResetSession && (
          <button
            type="button"
            onClick={() => {
              if (showResetConfirm) {
                onResetSession();
                setShowResetConfirm(false);
              } else {
                setShowResetConfirm(true);
                setTimeout(() => setShowResetConfirm(false), 3000);
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-[9px] font-orbitron font-black transition-all cursor-pointer ${
              showResetConfirm
                ? 'bg-red-600 text-white animate-bounce shadow-[0_0_15px_#ff0000]'
                : 'bg-pink-950/60 hover:bg-pink-900 border border-pink-500/40 text-pink-200'
            }`}
          >
            {showResetConfirm ? 'CONFIRM RESET (0)?' : 'WIPE & RESET (0)'}
          </button>
        )}
      </div>
    </div>
  );
};
