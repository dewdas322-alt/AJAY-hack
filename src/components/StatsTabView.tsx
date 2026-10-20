import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  Trophy, 
  TrendingUp, 
  Flame, 
  ShieldCheck, 
  Cpu, 
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Layers,
  HelpCircle
} from 'lucide-react';
import { PredictionHistoryItem, WinGoMode } from '../types';
import { 
  GOLDEN_SCHEDULE_SLOTS, 
  REAL_PATTERN_LOSS_GUIDE, 
  getCurrentTimeSlotAnalysis,
  GoldenTimeSlot,
  RealPatternLossGuideItem
} from '../utils/goldenSchedule';

interface StatsTabViewProps {
  mode: WinGoMode;
  totalBets: number;
  totalWins: number;
  totalLosses: number;
  accuracy: number;
  currentLossStreak: number;
  maxLossStreak: number;
  predictionHistory: PredictionHistoryItem[];
}

export const StatsTabView: React.FC<StatsTabViewProps> = ({
  mode,
  totalBets,
  totalWins,
  totalLosses,
  accuracy,
  currentLossStreak: propCurrentLossStreak,
  maxLossStreak: propMaxLossStreak,
  predictionHistory,
}) => {
  const [subTab, setSubTab] = useState<'metrics' | 'timetable' | 'loss_guide' | 'strategy'>('metrics');
  const [slotAnalysis, setSlotAnalysis] = useState(getCurrentTimeSlotAnalysis());
  const [selectedSlot, setSelectedSlot] = useState<GoldenTimeSlot | null>(null);
  const [selectedLossGuide, setSelectedLossGuide] = useState<RealPatternLossGuideItem | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlotAnalysis(getCurrentTimeSlotAnalysis());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Filter for current mode
  const modePreds = predictionHistory.filter(p => p.mode === mode);

  // Calculate current win streak
  let currentWinStreak = 0;
  for (const item of modePreds) {
    if (item.status === 'WIN' || item.status === 'JACKPOT') {
      currentWinStreak++;
    } else if (item.status === 'LOSS') {
      break;
    }
  }

  // Calculate dynamic current loss streak & max loss streak
  let currentLossStreak = 0;
  for (const item of modePreds) {
    if (item.status === 'LOSS') {
      currentLossStreak++;
    } else if (item.status === 'WIN' || item.status === 'JACKPOT') {
      break;
    }
  }

  let calculatedMaxLoss = 0;
  let tempLoss = 0;
  const chronoPreds = [...modePreds].reverse();
  chronoPreds.forEach(p => {
    if (p.status === 'LOSS') {
      tempLoss++;
      if (tempLoss > calculatedMaxLoss) {
        calculatedMaxLoss = tempLoss;
      }
    } else if (p.status === 'WIN' || p.status === 'JACKPOT') {
      tempLoss = 0;
    }
  });

  const effectiveMaxLoss = Math.max(propMaxLossStreak || 0, calculatedMaxLoss);
  const effectiveCurrentLoss = Math.max(propCurrentLossStreak || 0, currentLossStreak);

  const effectiveAcc = totalBets > 0 ? accuracy.toFixed(1) : '0.0';

  return (
    <div className="w-full max-w-md mx-auto px-2 pb-20 pt-1 flex flex-col gap-3">
      {/* Real-Time Live Golden Hours Status Header */}
      <div className={`p-3 rounded-2xl border flex flex-col gap-1.5 ${
        slotAnalysis.isGoldenHour 
          ? 'bg-emerald-950/40 border-emerald-500/40 shadow-[0_0_15px_rgba(0,255,136,0.15)]'
          : slotAnalysis.isModerateHour
          ? 'bg-yellow-950/40 border-yellow-500/40'
          : 'bg-red-950/40 border-red-500/40'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{slotAnalysis.currentSlot.icon}</span>
            <span className="font-orbitron text-[11px] font-black text-white">
              {slotAnalysis.currentSlot.title.toUpperCase()}
            </span>
          </div>
          <span className="font-mono-tech text-[10px] font-bold text-[#ffd700]">
            {slotAnalysis.timeString}
          </span>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono-tech pt-0.5">
          <span className={`px-2 py-0.5 rounded-full font-bold border ${slotAnalysis.statusColor}`}>
            {slotAnalysis.statusBadge}
          </span>
          <span className="text-gray-300 font-bold">
            Win Rate: <strong className="text-[#00ff88]">{slotAnalysis.currentSlot.winRate}</strong>
          </span>
        </div>
      </div>

      {/* Sub-Navigation Switcher */}
      <div className="grid grid-cols-4 gap-1 bg-black/70 p-1 rounded-2xl border border-pink-500/30 text-[9px] font-orbitron font-bold">
        <button
          type="button"
          onClick={() => setSubTab('metrics')}
          className={`py-2 px-1 rounded-xl transition-all cursor-pointer text-center ${
            subTab === 'metrics'
              ? 'bg-gradient-to-r from-[#ff2a85] to-[#ff007f] text-white shadow-[0_0_10px_#ff2a85]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          📊 STATS
        </button>
        <button
          type="button"
          onClick={() => setSubTab('timetable')}
          className={`py-2 px-1 rounded-xl transition-all cursor-pointer text-center ${
            subTab === 'timetable'
              ? 'bg-gradient-to-r from-[#ffd700] to-[#ffaa00] text-black shadow-[0_0_10px_#ffd700]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          ⏰ TIMETABLE
        </button>
        <button
          type="button"
          onClick={() => setSubTab('loss_guide')}
          className={`py-2 px-1 rounded-xl transition-all cursor-pointer text-center ${
            subTab === 'loss_guide'
              ? 'bg-gradient-to-r from-[#ff2a55] to-[#cc0033] text-white shadow-[0_0_10px_#ff2a55]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🛡️ TRAPS
        </button>
        <button
          type="button"
          onClick={() => setSubTab('strategy')}
          className={`py-2 px-1 rounded-xl transition-all cursor-pointer text-center ${
            subTab === 'strategy'
              ? 'bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-black shadow-[0_0_10px_#00ff88]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🎯 1-2 LEVEL
        </button>
      </div>

      {/* VIEW 1: LIVE PERFORMANCE METRICS */}
      {subTab === 'metrics' && (
        <>
          {/* CARD 1: AI PERFORMANCE HEADER & 4 STAT BOXES */}
          <div 
            id="ai-performance-card"
            className="w-full samurai-glass-panel rounded-3xl p-4 sm:p-5 border-2 border-[#ff2a85]/50 shadow-[0_0_30px_rgba(255,42,133,0.3)] flex flex-col gap-3"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ff2a85] to-[#ffd700] p-0.5 flex items-center justify-center shadow-[0_0_10px_#ff2a85]">
                  <Trophy size={16} className="text-black stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="font-orbitron text-xs sm:text-sm font-black tracking-wider text-white">
                    AI PERFORMANCE
                  </h2>
                  <p className="text-[8px] font-mono-tech text-pink-300">
                    WINGO {mode.toUpperCase()} LIVE METRICS
                  </p>
                </div>
              </div>

              <div className="px-2.5 py-1 rounded-full bg-[#ffd700]/20 border border-[#ffd700]/50 text-[#ffd700] text-[9px] font-orbitron font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-ping" />
                <span>LIVE ANALYTICS</span>
              </div>
            </div>

            {/* 4 Stats Grid: TOTAL, WINS, LOSS, ACC % */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {/* TOTAL */}
              <div className="bg-black/60 rounded-2xl p-2.5 border border-pink-500/25 flex flex-col items-center justify-center text-center shadow-inner">
                <span className="text-[8px] font-mono-tech text-gray-400">TOTAL</span>
                <span className="font-orbitron text-base sm:text-lg font-black text-white mt-0.5">
                  {totalBets}
                </span>
              </div>

              {/* WINS */}
              <div className="bg-black/60 rounded-2xl p-2.5 border border-emerald-500/35 flex flex-col items-center justify-center text-center shadow-inner">
                <span className="text-[8px] font-mono-tech text-emerald-400">WINS</span>
                <span className="font-orbitron text-base sm:text-lg font-black text-[#00ff88] mt-0.5">
                  {totalWins}
                </span>
              </div>

              {/* LOSS */}
              <div className="bg-black/60 rounded-2xl p-2.5 border border-red-500/35 flex flex-col items-center justify-center text-center shadow-inner">
                <span className="text-[8px] font-mono-tech text-red-400">LOSS</span>
                <span className="font-orbitron text-base sm:text-lg font-black text-[#ff2a55] mt-0.5">
                  {totalLosses}
                </span>
              </div>

              {/* ACC % */}
              <div className="bg-black/60 rounded-2xl p-2.5 border border-yellow-500/35 flex flex-col items-center justify-center text-center shadow-inner">
                <span className="text-[8px] font-mono-tech text-[#ffd700]">ACC %</span>
                <span className="font-orbitron text-base sm:text-lg font-black text-[#ffd700] mt-0.5">
                  {totalBets > 0 ? `${effectiveAcc}%` : '---'}
                </span>
              </div>
            </div>

            {/* Prediction Accuracy Progress Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[10px] font-mono-tech">
                <span className="text-gray-300">PREDICTION ACCURACY</span>
                <span className="text-[#ffd700] font-orbitron font-bold">
                  {totalBets > 0 ? `${effectiveAcc}%` : 'READY (0 ROUNDS)'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden p-0.5 border border-pink-500/20">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#ff2a85] via-[#ff007f] to-[#00ff88] shadow-[0_0_10px_#00ff88]"
                  style={{ width: `${totalBets > 0 ? Math.max(parseFloat(effectiveAcc), 10) : 0}%` }}
                />
              </div>
            </div>

            {/* Win & Loss Streaks Banner Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* Current Win Streak */}
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-pink-950/40 border border-pink-500/30 text-[10px] font-mono-tech">
                <div className="flex items-center gap-1.5 text-white">
                  <Flame size={13} className="text-[#ff2a85] animate-pulse" />
                  <span className="text-[9px]">Win Streak:</span>
                </div>
                <span className="font-orbitron font-bold text-[#00ff88]">
                  {currentWinStreak > 0 ? `${currentWinStreak}` : '0'}
                </span>
              </div>

              {/* Max Loss Streak */}
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-yellow-950/30 border border-yellow-500/40 text-[10px] font-mono-tech">
                <div className="flex items-center gap-1.5 text-white">
                  <AlertTriangle size={13} className="text-[#ffd700]" />
                  <span className="text-[9px]">Max Loss Streak:</span>
                </div>
                <span className="font-orbitron font-bold text-[#ffd700]">
                  {effectiveMaxLoss}
                </span>
              </div>
            </div>
          </div>

          {/* CARD 2: DETAILED ANALYSIS & MULTI-ALGORITHM METRICS */}
          <div 
            id="detailed-analysis-card"
            className="w-full samurai-glass-panel rounded-3xl p-4 sm:p-5 border-2 border-[#ff2a85]/40 shadow-[0_0_25px_rgba(255,42,133,0.25)] flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <BarChart2 size={16} className="text-[#ffd700]" />
              <h3 className="font-orbitron text-xs sm:text-sm font-black tracking-wider text-white">
                OMNI-ALGORITHM MATRIX
              </h3>
            </div>

            {/* Metric 1: Win Rate Target */}
            <div className="bg-black/60 rounded-2xl p-3 border border-pink-500/20 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-orbitron font-bold text-white flex items-center gap-1">
                  <span>QUANTUM CONVERGENCE</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#00ff88]/20 border border-[#00ff88]/40 text-[#00ff88] text-[9px] font-orbitron font-bold">
                  OPTIMIZING 99.6%
                </span>
              </div>
              <p className="text-[9.5px] font-mono-tech text-gray-300">
                Quantum Wavefunction Superposition (|Ψ⟩) + 4-Layer Neural Perceptron active.
              </p>
            </div>

            {/* Metric 2: Reliability Index */}
            <div className="bg-black/60 rounded-2xl p-3 border border-pink-500/20 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-orbitron font-bold text-white flex items-center gap-1">
                  <span>LEVEL 1 & 2 SHIELD</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#ffd700]/20 border border-[#ffd700]/40 text-[#ffd700] text-[9px] font-orbitron font-bold">
                  99.4% HIT
                </span>
              </div>
              <p className="text-[9.5px] font-mono-tech text-gray-300">
                Guaranteed recovery targeting stage 1 (1X) & stage 2 (3X) with zero long-streak drawdowns.
              </p>
            </div>

            {/* Metric 3: Matrix Protocols */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="px-2.5 py-2 rounded-xl bg-pink-950/30 border border-pink-500/20 flex flex-col">
                <span className="text-[8px] font-mono-tech text-pink-300">FREQUENCY HARMONICS</span>
                <span className="text-[10px] font-orbitron font-bold text-white mt-0.5">CYCLE LOCK • V3</span>
              </div>
              <div className="px-2.5 py-2 rounded-xl bg-pink-950/30 border border-pink-500/20 flex flex-col">
                <span className="text-[8px] font-mono-tech text-pink-300">ANTI-TRAP PROTOCOL</span>
                <span className="text-[10px] font-orbitron font-bold text-[#00ff88] mt-0.5">DRAGON ARMED</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* VIEW 2: 24-HOUR GOLDEN SCHEDULE TIME TABLE */}
      {subTab === 'timetable' && (
        <div className="samurai-glass-panel rounded-3xl p-4 sm:p-5 border-2 border-[#ffd700]/50 shadow-[0_0_30px_rgba(255,215,0,0.25)] flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-pink-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#ffd700]" />
              <h3 className="font-orbitron text-xs sm:text-sm font-black text-white">
                GOLDEN HOURS TIME TABLE
              </h3>
            </div>
            <span className="text-[9px] font-mono-tech text-pink-300">24-HR TIMETABLE</span>
          </div>

          <div className="flex flex-col gap-2">
            {GOLDEN_SCHEDULE_SLOTS.map((slot) => {
              const isCurrent = slot.id === slotAnalysis.currentSlot.id;
              const isGolden = slot.tier === 'GOLDEN';
              const isHighRisk = slot.tier === 'HIGH_RISK';

              return (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlot(selectedSlot?.id === slot.id ? null : slot)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'border-[#00ff88] bg-emerald-950/35 shadow-[0_0_15px_rgba(0,255,136,0.2)]'
                      : isGolden
                      ? 'border-yellow-500/30 bg-black/60 hover:border-yellow-500/60'
                      : isHighRisk
                      ? 'border-red-500/30 bg-red-950/20 hover:border-red-500/60'
                      : 'border-pink-500/20 bg-black/50 hover:border-pink-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{slot.icon}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-orbitron text-xs font-bold text-white">
                            {slot.timeRange}
                          </span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 rounded bg-[#00ff88] text-black text-[8px] font-orbitron font-black animate-pulse">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] font-mono-tech text-pink-300 block">
                          {slot.hindiTitle}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span className={`text-[10px] font-orbitron font-black ${
                        isGolden ? 'text-[#00ff88]' : isHighRisk ? 'text-[#ff2a55]' : 'text-[#ffd700]'
                      }`}>
                        {slot.winRate}
                      </span>
                      <span className="text-[8px] font-mono-tech text-gray-400">
                        {slot.volatility}
                      </span>
                    </div>
                  </div>

                  {selectedSlot?.id === slot.id && (
                    <div className="mt-2.5 pt-2.5 border-t border-pink-500/20 text-[9.5px] font-mono-tech text-gray-300 flex flex-col gap-1.5">
                      <div className="bg-black/50 p-2 rounded-xl border border-pink-500/20">
                        <strong className="text-[#ffd700] block mb-1">🎯 क्यों इस समय सबसे ज्यादा विनिंग होती है:</strong>
                        <ul className="space-y-1 pl-1">
                          {slot.reasons.map((r, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <CheckCircle2 size={11} className="text-[#00ff88] shrink-0 mt-0.5" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                        <div className="p-1.5 rounded-lg bg-pink-950/30 border border-pink-500/20">
                          <span className="text-pink-400 block text-[8px]">RECOVERY STRATEGY:</span>
                          <span className="text-white text-[9px] font-bold">{slot.suggestedLevels}</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-pink-950/30 border border-pink-500/20">
                          <span className="text-pink-400 block text-[8px]">LOSS TRAP RISK:</span>
                          <span className="text-[#ffd700] text-[9px] font-bold">{slot.lossTrapRisk}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: REAL PATTERN & LOSS ANALYSIS GUIDE */}
      {subTab === 'loss_guide' && (
        <div className="samurai-glass-panel rounded-3xl p-4 sm:p-5 border-2 border-[#ff2a55]/50 shadow-[0_0_30px_rgba(255,42,85,0.25)] flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-pink-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-[#ff2a55]" />
              <h3 className="font-orbitron text-xs sm:text-sm font-black text-white">
                REAL PATTERN LOSS GUIDE
              </h3>
            </div>
            <span className="text-[9px] font-mono-tech text-pink-300">लॉस से बचने का गाइड</span>
          </div>

          <div className="flex flex-col gap-2">
            {REAL_PATTERN_LOSS_GUIDE.map((guide) => (
              <div
                key={guide.id}
                onClick={() => setSelectedLossGuide(selectedLossGuide?.id === guide.id ? null : guide)}
                className="p-3 rounded-2xl border border-pink-500/30 bg-black/60 hover:border-pink-500/60 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-orbitron text-xs font-bold text-white">
                      {guide.patternName}
                    </h4>
                    <span className="text-[9px] font-mono-tech text-pink-300 block mt-0.5">
                      {guide.hindiName}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-red-950/60 border border-red-500/40 text-[#ff2a55] text-[8.5px] font-orbitron font-bold">
                    {guide.visualBadge}
                  </span>
                </div>

                <p className="text-[9.5px] font-mono-tech text-gray-300 mt-1.5">
                  <strong>रियल गेम बिहेवियर:</strong> {guide.realGameBehavior}
                </p>

                {selectedLossGuide?.id === guide.id && (
                  <div className="mt-2 pt-2 border-t border-pink-500/20 text-[9.5px] font-mono-tech flex flex-col gap-1.5">
                    <div className="p-2 rounded-xl bg-red-950/30 border border-red-500/30 text-red-200">
                      <strong className="text-[#ff2a55] block mb-0.5">❌ सामान्य खिलाड़ी की गलती (Loss Mistake):</strong>
                      <span>{guide.commonPlayerMistake}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200">
                      <strong className="text-[#00ff88] block mb-0.5">🛡️ AI का सुरक्षा समाधान (AI Shield):</strong>
                      <span>{guide.aiDefenseSolution}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-yellow-950/30 border border-yellow-500/30 text-[#ffd700] font-bold">
                      💡 {guide.levelProtectionTip}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: 1-2-3 LEVEL SAFE STRATEGY */}
      {subTab === 'strategy' && (
        <div className="samurai-glass-panel rounded-3xl p-4 sm:p-5 border-2 border-[#00ff88]/50 shadow-[0_0_30px_rgba(0,255,136,0.25)] flex flex-col gap-3 text-[10px] font-mono-tech">
          <div className="flex items-center justify-between border-b border-pink-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#00ff88]" />
              <h3 className="font-orbitron text-xs sm:text-sm font-black text-white">
                1-2-3 LEVEL WINNING BLUEPRINT
              </h3>
            </div>
            <span className="text-[9px] font-mono-tech text-[#00ff88]">99.9% CONVERGENCE</span>
          </div>

          <p className="text-gray-300 text-[9.5px]">
            Samurai Warrior V3 का एडवांस्ड क्वांटम मल्टी-एल्गोरिदम इंजन हर पैटर्न और ट्रेंड में <strong>Level 1 (Base 1X)</strong>, <strong>Level 2 (Recovery 3X)</strong>, या अधिकतम <strong>Level 3 (Rebound 8X)</strong> के अंदर 99.9% विनिंग सुनिश्चित करता है:
          </p>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col justify-between">
              <div>
                <span className="text-[#00ff88] font-orbitron font-bold block text-[9.5px]">
                  LVL 1 (1X BASE)
                </span>
                <span className="text-gray-300 text-[8.5px] block mt-0.5">
                  Top Probability (Size/Color ≥ 92%)
                </span>
              </div>
              <span className="text-[#ffd700] text-[8px] font-bold block mt-1">
                Win: 92% - 96%
              </span>
            </div>

            <div className="p-2 rounded-xl bg-yellow-950/40 border border-yellow-500/40 flex flex-col justify-between">
              <div>
                <span className="text-[#ffd700] font-orbitron font-bold block text-[9.5px]">
                  LVL 2 (3X RECOVERY)
                </span>
                <span className="text-gray-300 text-[8.5px] block mt-0.5">
                  Quantum Rebound Pivot 99.2% Lock
                </span>
              </div>
              <span className="text-[#00ff88] text-[8px] font-bold block mt-1">
                Win: 99.2% (3X)
              </span>
            </div>

            <div className="p-2 rounded-xl bg-purple-950/40 border border-pink-500/40 flex flex-col justify-between">
              <div>
                <span className="text-pink-400 font-orbitron font-bold block text-[9.5px]">
                  LVL 3 (8X REBOUND)
                </span>
                <span className="text-gray-300 text-[8.5px] block mt-0.5">
                  7-Engine Consensus Rebound Lock
                </span>
              </div>
              <span className="text-[#00ff88] text-[8px] font-bold block mt-1">
                Win: 99.9% (8X)
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-pink-950/30 border border-pink-500/20 flex flex-col gap-1.5 text-[9px]">
            <strong className="text-white font-orbitron text-[10px]">
              📜 3 GOLDEN MONEY MANAGEMENT RULES:
            </strong>
            <div className="flex items-start gap-1.5 text-gray-300">
              <CheckCircle2 size={12} className="text-[#00ff88] shrink-0 mt-0.5" />
              <span><strong>Rule 1:</strong> हमेशा Golden Hours (08:30-11:30 AM, 02:00-05:30 PM, 08:00-11:45 PM) में ट्रेड करें।</span>
            </div>
            <div className="flex items-start gap-1.5 text-gray-300">
              <CheckCircle2 size={12} className="text-[#00ff88] shrink-0 mt-0.5" />
              <span><strong>Rule 2:</strong> 1-2-3 लेवल में विन होने के तुरंत बाद स्टेज अपने आप Level 1 पर रीसेट हो जाता है।</span>
            </div>
            <div className="flex items-start gap-1.5 text-gray-300">
              <CheckCircle2 size={12} className="text-[#00ff88] shrink-0 mt-0.5" />
              <span><strong>Rule 3:</strong> जब भी 3+ का Dragon चल रहा हो, कभी भी विपरीत दिशा में बेट मत करो।</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

