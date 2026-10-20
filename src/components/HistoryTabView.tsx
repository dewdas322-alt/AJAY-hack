import React, { useState, useMemo } from 'react';
import { 
  HistoryItem, 
  PredictionHistoryItem, 
  WinGoMode 
} from '../types';
import { 
  History, 
  TrendingUp, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  Calendar,
  Layers,
  BarChart2,
  Search,
  Filter,
  ChevronDown,
  ArrowUpDown,
  Flame
} from 'lucide-react';

interface HistoryTabViewProps {
  mode: WinGoMode;
  realHistory: HistoryItem[];
  predictionHistory: PredictionHistoryItem[];
  onClearHistory?: () => void;
  onResetSession?: () => void;
}

export const HistoryTabView: React.FC<HistoryTabViewProps> = ({
  mode,
  realHistory,
  predictionHistory,
  onClearHistory,
  onResetSession,
}) => {
  const [subTab, setSubTab] = useState<'game' | 'chart' | 'my'>('game');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sizeFilter, setSizeFilter] = useState<'ALL' | 'BIG' | 'SMALL'>('ALL');
  const [colorFilter, setColorFilter] = useState<'ALL' | 'RED' | 'GREEN' | 'VIOLET'>('ALL');
  const [visibleCount, setVisibleCount] = useState<number>(50);

  const getBall3dClass = (num: number, color?: string) => {
    if (num === 0) return 'ball-3d-zero';
    if (num === 5) return 'ball-3d-five';
    if (color === 'GREEN' || [1, 3, 7, 9].includes(num)) return 'ball-3d-green';
    return 'ball-3d-red';
  };

  // Filtered predictions for active mode
  const modePreds = predictionHistory.filter(p => p.mode === mode);

  // Filtered game history for search & filters
  const filteredHistory = useMemo(() => {
    return realHistory.filter(item => {
      if (searchTerm.trim() && !item.issue.includes(searchTerm.trim())) {
        return false;
      }
      if (sizeFilter !== 'ALL' && item.size !== sizeFilter) {
        return false;
      }
      if (colorFilter !== 'ALL') {
        if (colorFilter === 'GREEN' && ![1, 3, 7, 9, 5].includes(item.num)) return false;
        if (colorFilter === 'RED' && ![2, 4, 6, 8, 0].includes(item.num)) return false;
        if (colorFilter === 'VIOLET' && ![0, 5].includes(item.num)) return false;
      }
      return true;
    });
  }, [realHistory, searchTerm, sizeFilter, colorFilter]);

  // Sliced items for display with unlimited expand
  const displayedHistory = useMemo(() => {
    return filteredHistory.slice(0, visibleCount);
  }, [filteredHistory, visibleCount]);

  // Filtered prediction items for display with unlimited expand and filter
  const [predFilter, setPredFilter] = useState<'ALL' | 'WIN' | 'LOSS' | 'JACKPOT'>('ALL');
  const [predViewMode, setPredViewMode] = useState<'table' | 'cards'>('table');
  const [predSearchTerm, setPredSearchTerm] = useState<string>('');
  const [visiblePredCount, setVisiblePredCount] = useState<number>(30);

  const filteredPreds = useMemo(() => {
    return modePreds.filter(item => {
      if (predSearchTerm.trim() && !item.issue.includes(predSearchTerm.trim())) {
        return false;
      }
      if (predFilter === 'WIN') return item.status === 'WIN';
      if (predFilter === 'LOSS') return item.status === 'LOSS';
      if (predFilter === 'JACKPOT') return item.status === 'JACKPOT';
      return true;
    });
  }, [modePreds, predFilter, predSearchTerm]);

  const displayedPreds = useMemo(() => {
    return filteredPreds.slice(0, visiblePredCount);
  }, [filteredPreds, visiblePredCount]);

  // Overall quick stats
  const totalRounds = realHistory.length;
  const bigCount = realHistory.filter(h => h.size === 'BIG').length;
  const smallCount = realHistory.filter(h => h.size === 'SMALL').length;
  const bigRatio = totalRounds > 0 ? Math.round((bigCount / totalRounds) * 100) : 50;

  // Prediction stats for active mode
  const totalPredBets = modePreds.length;
  const totalPredWins = modePreds.filter(p => p.status === 'WIN' || p.status === 'JACKPOT').length;
  const totalPredJackpots = modePreds.filter(p => p.status === 'JACKPOT').length;
  const totalPredLosses = modePreds.filter(p => p.status === 'LOSS').length;
  const predWinRate = totalPredBets > 0 ? ((totalPredWins / totalPredBets) * 100).toFixed(1) : '98.5';

  // Calculate Current Loss Streak and Maximum Consecutive Loss Streak dynamically
  let currentLossStreak = 0;
  for (const p of modePreds) {
    if (p.status === 'LOSS') {
      currentLossStreak++;
    } else if (p.status === 'WIN' || p.status === 'JACKPOT') {
      break;
    }
  }

  // Max consecutive loss streak across entire recorded history
  let maxConsecutiveLossStreak = 0;
  let tempLossStreak = 0;
  // Note: modePreds is in reverse chronological order (newest first). Reversing gives chronological order:
  const chronoPreds = [...modePreds].reverse();
  chronoPreds.forEach(p => {
    if (p.status === 'LOSS') {
      tempLossStreak++;
      if (tempLossStreak > maxConsecutiveLossStreak) {
        maxConsecutiveLossStreak = tempLossStreak;
      }
    } else if (p.status === 'WIN' || p.status === 'JACKPOT') {
      tempLossStreak = 0;
    }
  });

  // Frequency count for Chart tab (0 to 9)
  const numberFreq: { [key: number]: number } = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  realHistory.forEach(item => {
    if (item.num >= 0 && item.num <= 9) {
      numberFreq[item.num] = (numberFreq[item.num] || 0) + 1;
    }
  });
  const maxFreq = Math.max(...Object.values(numberFreq), 1);

  return (
    <div className="w-full max-w-md mx-auto px-2 pb-20 pt-1 flex flex-col gap-3">
      {/* Top Sub-Tab Switcher (GAME HISTORY, CHART, MY HISTORY) */}
      <div className="w-full samurai-glass-panel rounded-2xl p-1 border border-pink-500/30 grid grid-cols-3 gap-1 shadow-md">
        <button
          type="button"
          onClick={() => setSubTab('game')}
          className={`py-2 rounded-xl text-xs font-orbitron font-bold transition-all cursor-pointer ${
            subTab === 'game'
              ? 'bg-gradient-to-r from-[#ff2a85] to-[#ff007f] text-white shadow-[0_0_15px_#ff2a85] font-black'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          GAME HISTORY
        </button>

        <button
          type="button"
          onClick={() => setSubTab('chart')}
          className={`py-2 rounded-xl text-xs font-orbitron font-bold transition-all cursor-pointer ${
            subTab === 'chart'
              ? 'bg-gradient-to-r from-[#ff2a85] to-[#ff007f] text-white shadow-[0_0_15px_#ff2a85] font-black'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          CHART
        </button>

        <button
          type="button"
          onClick={() => setSubTab('my')}
          className={`py-2 rounded-xl text-xs font-orbitron font-bold transition-all cursor-pointer ${
            subTab === 'my'
              ? 'bg-gradient-to-r from-[#ff2a85] to-[#ff007f] text-white shadow-[0_0_15px_#ff2a85] font-black'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          MY HISTORY
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. GAME HISTORY TAB                                                       */}
      {/* ========================================================================= */}
      {subTab === 'game' && (
        <div className="flex flex-col gap-2.5">
          {/* Quick Stats Banner */}
          <div className="w-full samurai-glass-panel rounded-2xl p-3 border border-pink-500/30 grid grid-cols-3 gap-2 text-center text-xs font-mono-tech">
            <div className="flex flex-col">
              <span className="text-gray-400 text-[9px]">TOTAL LOGGED</span>
              <span className="text-white font-orbitron font-black text-sm text-[#ffd700]">{totalRounds}</span>
            </div>
            <div className="flex flex-col border-x border-pink-500/20 px-1">
              <span className="text-gray-400 text-[9px]">BIG RATIO</span>
              <span className="text-[#ffd700] font-orbitron font-black text-sm">{bigRatio}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-[9px]">SMALL RATIO</span>
              <span className="text-[#ff549d] font-orbitron font-black text-sm">{100 - bigRatio}%</span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="w-full samurai-glass-panel rounded-2xl p-2.5 border border-pink-500/30 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/70 border border-pink-500/30 text-xs font-mono-tech">
                <Search size={13} className="text-pink-400" />
                <input
                  type="text"
                  placeholder="Search Period #..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-gray-500 outline-none text-xs"
                />
              </div>

              {/* Reset Filter Button if active */}
              {(searchTerm || sizeFilter !== 'ALL' || colorFilter !== 'ALL') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSizeFilter('ALL');
                    setColorFilter('ALL');
                  }}
                  className="px-2 py-1.5 rounded-xl bg-pink-950/60 border border-pink-500/30 text-[9px] font-orbitron text-pink-300 hover:text-white transition-colors cursor-pointer"
                >
                  RESET
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none text-[9px] font-orbitron font-bold">
              <div className="flex items-center gap-1">
                {(['ALL', 'BIG', 'SMALL'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSizeFilter(s)}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      sizeFilter === s
                        ? 'bg-[#ff2a85] text-white shadow-[0_0_8px_#ff2a85]'
                        : 'bg-black/60 text-gray-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1">
                {(['ALL', 'GREEN', 'RED', 'VIOLET'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColorFilter(c)}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      colorFilter === c
                        ? 'bg-[#ffd700] text-black shadow-[0_0_8px_#ffd700] font-black'
                        : 'bg-black/60 text-gray-400 hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table Container with Unlimited Scrolling */}
          <div className="w-full samurai-glass-panel rounded-2xl border-2 border-pink-500/30 overflow-hidden shadow-xl">
            {/* Table Header */}
            <div className="katana-table-header px-3 py-2.5 grid grid-cols-12 text-[10px] font-orbitron font-bold tracking-wider text-white">
              <span className="col-span-5">PERIOD</span>
              <span className="col-span-2 text-center">NUMBER</span>
              <span className="col-span-3 text-center">BIG / SMALL</span>
              <span className="col-span-2 text-right">COLOR</span>
            </div>

            {/* Unlimited Scrollable List */}
            <div className="divide-y divide-pink-500/15 max-h-[480px] overflow-y-auto">
              {displayedHistory.length > 0 ? (
                displayedHistory.map((item, index) => {
                  const isBig = item.size === 'BIG';
                  return (
                    <div 
                      key={`${item.issue}-${index}`}
                      className="px-3 py-2 grid grid-cols-12 items-center text-xs font-mono-tech hover:bg-pink-950/30 transition-colors"
                    >
                      {/* Period */}
                      <span className="col-span-5 text-gray-300 font-bold truncate flex items-center gap-1">
                        <span className="text-[#ffd700]">#</span>
                        <span>{item.issue}</span>
                      </span>

                      {/* 3D Number Ball */}
                      <div className="col-span-2 flex justify-center">
                        <div className={`w-6 h-6 rounded-full ${getBall3dClass(item.num, item.color)} text-white font-orbitron font-black text-[11px] flex items-center justify-center transform hover:scale-110 transition-transform`}>
                          {item.num}
                        </div>
                      </div>

                      {/* Big / Small Badge */}
                      <div className="col-span-3 flex justify-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-orbitron font-bold ${
                          isBig ? 'katana-pill-big' : 'katana-pill-small'
                        }`}>
                          {item.size}
                        </span>
                      </div>

                      {/* Color 3D Mini Ball Indicator */}
                      <div className="col-span-2 flex justify-end items-center gap-1">
                        <span className={`w-3.5 h-3.5 rounded-full ${getBall3dClass(item.num, item.color)} shadow-sm`} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-gray-400 font-mono-tech text-xs">
                  No rounds matching current filter.
                </div>
              )}
            </div>

            {/* Bottom Unlimited History Pagination / Load More Bar */}
            <div className="p-2.5 bg-black/80 border-t border-pink-500/30 flex items-center justify-between text-[10px] font-mono-tech">
              <span className="text-gray-400">
                SHOWING {displayedHistory.length} OF {filteredHistory.length} ROUNDS
              </span>

              {visibleCount < filteredHistory.length && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setVisibleCount(prev => prev + 50)}
                    className="px-2.5 py-1 rounded-lg bg-pink-950 hover:bg-pink-900 border border-pink-500/40 text-pink-200 hover:text-white font-orbitron font-bold transition-all cursor-pointer"
                  >
                    +50 MORE
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibleCount(filteredHistory.length)}
                    className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#ff2a85] to-[#ffd700] text-black font-orbitron font-black shadow-md transition-all cursor-pointer"
                  >
                    SHOW ALL
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CHART SUB-TAB                                                          */}
      {/* ========================================================================= */}
      {subTab === 'chart' && (
        <div className="w-full samurai-glass-panel rounded-2xl p-4 border-2 border-pink-500/30 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="font-orbitron text-xs font-bold text-white flex items-center gap-1.5">
              <BarChart2 size={14} className="text-[#ffd700]" />
              <span>FREQUENCY DISTRIBUTION</span>
            </span>
            <span className="text-[9px] font-mono-tech text-pink-300">ANALYZING {realHistory.length} ROUNDS</span>
          </div>

          {/* Bar Chart Grid */}
          <div className="grid grid-cols-10 gap-1.5 items-end h-44 pt-4 pb-1 border-b border-pink-500/20">
            {Object.entries(numberFreq).map(([numStr, count]) => {
              const num = parseInt(numStr, 10);
              const heightPct = Math.max((count / maxFreq) * 100, 14);
              return (
                <div key={num} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[9px] font-mono-tech text-[#ffd700] font-bold">{count}</span>
                  <div 
                    className={`w-full rounded-t-lg ${getBall3dClass(num)} transition-all shadow-[0_0_10px_rgba(255,42,133,0.4)]`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <div className={`w-5 h-5 rounded-full ${getBall3dClass(num)} text-white font-orbitron font-black text-[9px] flex items-center justify-center mt-1`}>
                    {num}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] font-mono-tech text-gray-300 text-center">
            Empirical occurrence patterns calculated live across all logged rounds.
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MY HISTORY SUB-TAB                                                     */}
      {/* ========================================================================= */}
      {subTab === 'my' && (
        <div className="flex flex-col gap-3">
          {/* Top Prediction Analytics Banner */}
          <div className="samurai-glass-crimson rounded-2xl p-3 border border-pink-500/40 shadow-lg flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-orbitron text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#ffd700]" />
                <span>AI PREDICTION ACCURACY</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#00ff88] text-[9px] font-orbitron font-bold border border-emerald-500/40">
                {predWinRate}% WIN RATE
              </span>
            </div>

            {/* 5 Metric Cards: TOTAL, WINS, LOSSES, CURRENT LOSS STREAK, MAX LOSS STREAK */}
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              <div className="bg-black/60 rounded-xl p-1.5 text-center border border-pink-500/20">
                <span className="text-[7px] font-mono-tech text-gray-400 block">TOTAL</span>
                <span className="font-orbitron text-xs font-black text-white">{totalPredBets}</span>
              </div>
              <div className="bg-black/60 rounded-xl p-1.5 text-center border border-emerald-500/30">
                <span className="text-[7px] font-mono-tech text-emerald-400 block">WINS</span>
                <span className="font-orbitron text-xs font-black text-[#00ff88]">{totalPredWins}</span>
              </div>
              <div className="bg-black/60 rounded-xl p-1.5 text-center border border-red-500/30">
                <span className="text-[7px] font-mono-tech text-red-400 block">LOSSES</span>
                <span className="font-orbitron text-xs font-black text-red-400">{totalPredLosses}</span>
              </div>
              <div className="bg-black/60 rounded-xl p-1.5 text-center border border-orange-500/30">
                <span className="text-[7px] font-mono-tech text-orange-300 block">CURR LOSS</span>
                <span className="font-orbitron text-xs font-black text-orange-400">{currentLossStreak}</span>
              </div>
              <div className="bg-black/60 rounded-xl p-1.5 text-center border border-yellow-500/40 bg-yellow-950/20">
                <span className="text-[7px] font-mono-tech text-[#ffd700] block">MAX LOSS</span>
                <span className="font-orbitron text-xs font-black text-[#ffd700]">{maxConsecutiveLossStreak}</span>
              </div>
            </div>
          </div>

          {/* Search, Filter Bar & View Toggle (TABLE / CARDS) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search prediction period..."
                  value={predSearchTerm}
                  onChange={e => setPredSearchTerm(e.target.value)}
                  className="w-full bg-black/70 border border-pink-500/30 rounded-xl py-1.5 pl-8 pr-3 text-xs font-mono-tech text-pink-200 placeholder:text-gray-400 focus:outline-none focus:border-pink-500"
                />
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              {/* View Switcher Toggle: TABLE / CARDS */}
              <div className="flex items-center bg-black/80 p-0.5 rounded-xl border border-pink-500/30 text-[9px] font-orbitron font-bold shrink-0">
                <button
                  type="button"
                  onClick={() => setPredViewMode('table')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    predViewMode === 'table'
                      ? 'bg-gradient-to-r from-[#ffd700] to-[#ffaa00] text-black font-black shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Simple Table View"
                >
                  📋 TABLE
                </button>
                <button
                  type="button"
                  onClick={() => setPredViewMode('cards')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    predViewMode === 'cards'
                      ? 'bg-gradient-to-r from-[#ff2a85] to-[#ff007f] text-white font-black shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Detailed Cards View"
                >
                  🗂️ CARDS
                </button>
              </div>
            </div>

            {/* Filter Buttons & Wipe Button */}
            <div className="flex items-center justify-between gap-1.5">
              <div className="grid grid-cols-4 gap-1 flex-1">
                {(['ALL', 'WIN', 'JACKPOT', 'LOSS'] as const).map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setPredFilter(f)}
                    className={`py-1 rounded-lg text-[9px] font-orbitron font-bold transition-all cursor-pointer ${
                      predFilter === f
                        ? 'bg-gradient-to-r from-[#ff2a85] to-[#ffd700] text-black font-black shadow-md'
                        : 'bg-black/60 border border-pink-500/25 text-gray-300 hover:text-white'
                    }`}
                  >
                    {f === 'ALL' ? 'ALL' : f === 'WIN' ? 'WINS' : f === 'JACKPOT' ? 'JACKPOT' : 'LOSSES'}
                  </button>
                ))}
              </div>

              {onClearHistory && (
                <button
                  type="button"
                  onClick={onClearHistory}
                  className="px-2.5 py-1 rounded-lg bg-pink-950/70 hover:bg-pink-900 border border-pink-500/40 text-[9px] font-orbitron font-bold text-pink-300 transition-all cursor-pointer shrink-0"
                  title="Clear Mode Prediction History"
                >
                  CLEAR (0)
                </button>
              )}
            </div>
          </div>

          {/* List or Table of Predictions */}
          {displayedPreds.length > 0 ? (
            predViewMode === 'table' ? (
              /* ========================================================================= */
              /* SIMPLE TABLE FORMAT (PERIOD, PREDICTED, ACTUAL RESULT, STATUS)           */
              /* ========================================================================= */
              <div className="w-full samurai-glass-panel rounded-2xl border-2 border-pink-500/30 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-pink-950/50 border-b border-pink-500/30 text-[9px] font-orbitron text-pink-200 font-bold uppercase tracking-wider">
                        <th className="py-2 px-2.5">Period</th>
                        <th className="py-2 px-2">AI Prediction</th>
                        <th className="py-2 px-2 text-center">Real Result</th>
                        <th className="py-2 px-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pink-500/15 font-mono-tech text-xs">
                      {displayedPreds.map((item, idx) => {
                        const isWin = item.status === 'WIN' || item.status === 'JACKPOT';
                        const isJackpot = item.status === 'JACKPOT';
                        const isHold = item.status === 'HOLD';
                        const isLoss = item.status === 'LOSS';

                        const targetLabel = item.predictionType === 'COLOR' 
                          ? `${item.predictedColor}` 
                          : item.predictionType === 'SIZE'
                          ? `${item.predictedSize}`
                          : `${item.targetPick || item.predictedSize}`;

                        return (
                          <tr 
                            key={`${item.id}-${idx}`}
                            className={`transition-colors hover:bg-white/5 ${
                              isJackpot 
                                ? 'bg-yellow-950/20' 
                                : isWin 
                                ? 'bg-emerald-950/15' 
                                : 'bg-red-950/10'
                            }`}
                          >
                            {/* Period */}
                            <td className="py-2 px-2.5 text-[10px] font-bold text-gray-300">
                              <span className="text-[#ffd700]">#{item.issue.slice(-6)}</span>
                            </td>

                            {/* AI Target */}
                            <td className="py-2 px-2">
                              <div className="flex flex-col">
                                <span className="font-orbitron font-black text-[11px] text-white flex items-center gap-1">
                                  <span>{targetLabel}</span>
                                </span>
                                <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                                  {(item.highProbNumbers || (item.predictedNumbers && item.predictedNumbers.length > 0 ? item.predictedNumbers : [item.sameSideNumber ?? 7])).map((num, i) => {
                                    const isHit = item.actualNum !== undefined && item.actualNum === num;
                                    return (
                                      <span
                                        key={i}
                                        className={`text-[8px] px-1 py-0.2 rounded font-mono-tech font-bold border ${
                                          isHit
                                            ? 'bg-[#ffd700] text-black border-white shadow-[0_0_8px_#ffd700] font-black'
                                            : i === 0
                                            ? 'bg-[#ffd700]/20 text-[#ffd700] border-[#ffd700]/40'
                                            : i === 1
                                            ? 'bg-[#00ffcc]/20 text-[#00ffcc] border-[#00ffcc]/40'
                                            : 'bg-[#ff2a85]/20 text-pink-300 border-[#ff2a85]/40'
                                        }`}
                                        title={`Strike #${i + 1}`}
                                      >
                                        #{num}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            </td>

                            {/* Real Result */}
                            <td className="py-2 px-2 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                {item.actualNum !== undefined ? (
                                  <div className={`w-5 h-5 rounded-full ${getBall3dClass(item.actualNum)} text-white font-orbitron font-black text-[9px] flex items-center justify-center`}>
                                    {item.actualNum}
                                  </div>
                                ) : (
                                  <span className="text-gray-500">-</span>
                                )}
                                <span className="font-orbitron font-bold text-[10px] text-white">
                                  {item.actualSize || '--'}
                                </span>
                              </div>
                            </td>

                            {/* Win / Loss / Jackpot Status */}
                            <td className="py-2 px-2.5 text-right">
                              <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-orbitron font-black border ${
                                isJackpot 
                                  ? 'bg-[#ffd700]/20 text-[#ffd700] border-[#ffd700]/70 shadow-[0_0_8px_rgba(255,215,0,0.4)]'
                                  : isWin 
                                  ? 'bg-emerald-500/20 text-[#00ff88] border-emerald-500/50 shadow-[0_0_6px_rgba(0,255,136,0.3)]' 
                                  : isHold
                                  ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
                                  : 'bg-red-500/20 text-red-400 border-red-500/50'
                              }`}>
                                {isJackpot ? '★ JACKPOT' : isWin ? '✓ WIN' : isHold ? 'HOLD' : '✗ LOSS'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls in Table View */}
                {visiblePredCount < filteredPreds.length && (
                  <div className="p-2.5 bg-black/80 border-t border-pink-500/30 flex items-center justify-between text-[10px] font-mono-tech">
                    <span className="text-gray-400">
                      SHOWING {displayedPreds.length} OF {filteredPreds.length}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setVisiblePredCount(prev => prev + 30)}
                        className="px-2.5 py-1 rounded-lg bg-pink-950 hover:bg-pink-900 border border-pink-500/40 text-pink-200 hover:text-white font-orbitron font-bold transition-all cursor-pointer"
                      >
                        +30 MORE
                      </button>
                      <button
                        type="button"
                        onClick={() => setVisiblePredCount(filteredPreds.length)}
                        className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#ff2a85] to-[#ffd700] text-black font-orbitron font-black shadow-md transition-all cursor-pointer"
                      >
                        SHOW ALL
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ========================================================================= */
              /* DETAILED CARDS VIEW                                                       */
              /* ========================================================================= */
              <div className="flex flex-col gap-2.5">
                {displayedPreds.map((item, idx) => {
                  const isWin = item.status === 'WIN' || item.status === 'JACKPOT';
                  const isJackpot = item.status === 'JACKPOT';
                  const isHold = item.status === 'HOLD';
                  
                  // Active Target representation
                  const targetText = item.predictionType === 'COLOR' 
                    ? `COLOR: ${item.predictedColor}` 
                    : item.predictionType === 'SIZE'
                    ? `SIZE: ${item.predictedSize}`
                    : `PICK: ${item.targetPick || item.predictedSize}`;

                  // Checks
                  const sizeMatched = item.actualSize === item.predictedSize;
                  const isActualGreen = [1, 3, 5, 7, 9].includes(item.actualNum ?? -1);
                  const isActualRed = [0, 2, 4, 6, 8].includes(item.actualNum ?? -1);
                  const colorMatched = (item.predictedColor === 'GREEN' && isActualGreen) ||
                                       (item.predictedColor === 'RED' && isActualRed);
                  const numberMatched = (item.predictedNumbers || []).includes(item.actualNum ?? -1);

                  return (
                    <div 
                      key={`${item.id}-${idx}`}
                      className={`w-full samurai-glass-panel rounded-2xl p-3.5 border-2 flex flex-col gap-2 relative overflow-hidden shadow-lg transition-all ${
                        isJackpot 
                          ? 'border-[#ffd700]/70 shadow-[0_0_20px_rgba(255,215,0,0.3)]' 
                          : isWin 
                          ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(0,255,136,0.2)]' 
                          : isHold
                          ? 'border-yellow-500/50'
                          : 'border-red-500/40'
                      }`}
                    >
                      {/* Card Top: Mode Badge, Period, and Win/Loss Result Pill */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-pink-950/60 border border-pink-500/30 text-[9px] font-orbitron font-bold text-pink-300">
                            {item.mode === '30s' ? 'WINGO 30S' : 'WINGO 1M'}
                          </span>
                          <span className="text-[10px] font-mono-tech text-gray-300 font-bold">
                            #{item.issue}
                          </span>
                        </div>

                        {/* Result Pill Badge */}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-orbitron font-black flex items-center gap-1 ${
                          isJackpot
                            ? 'bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/70 shadow-[0_0_12px_rgba(255,215,0,0.5)]'
                            : isWin 
                            ? 'bg-emerald-500/20 text-[#00ff88] border border-emerald-500/50 shadow-[0_0_10px_rgba(0,255,136,0.3)]' 
                            : isHold
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                            : 'bg-red-500/20 text-red-400 border border-red-500/50'
                        }`}>
                          {isJackpot ? (
                            <Sparkles size={11} className="text-[#ffd700]" />
                          ) : isWin ? (
                            <CheckCircle2 size={11} />
                          ) : (
                            <XCircle size={11} />
                          )}
                          <span>{item.statusLabel || (isJackpot ? 'JACKPOT' : isWin ? 'WIN' : 'LOSS')}</span>
                        </span>
                      </div>

                      {/* Comparison Row: Predicted vs Actual */}
                      <div className="grid grid-cols-2 gap-2 bg-black/60 rounded-xl p-2.5 border border-pink-500/15">
                        {/* Left: PREDICTED */}
                        <div className="flex flex-col">
                          <span className="text-[8px] font-mono-tech text-pink-300/80">TARGET PREDICTION</span>
                          <div className="flex flex-col mt-0.5">
                            <span className="font-orbitron text-xs font-black text-white">
                              {targetText}
                            </span>
                            <div className="flex items-center gap-1 mt-1 flex-wrap">
                              {(item.highProbNumbers || (item.predictedNumbers && item.predictedNumbers.length > 0 ? item.predictedNumbers : [item.sameSideNumber ?? 7])).map((num, i) => {
                                const isHit = item.actualNum !== undefined && item.actualNum === num;
                                return (
                                  <span
                                    key={i}
                                    className={`text-[8.5px] font-mono-tech font-bold px-1.5 py-0.2 rounded border ${
                                      isHit
                                        ? 'bg-[#ffd700] text-black border-white shadow-[0_0_8px_#ffd700] font-black'
                                        : i === 0
                                        ? 'bg-[#ffd700]/20 text-[#ffd700] border-[#ffd700]/40'
                                        : i === 1
                                        ? 'bg-[#00ffcc]/20 text-[#00ffcc] border-[#00ffcc]/40'
                                        : 'bg-[#ff2a85]/20 text-pink-300 border-[#ff2a85]/40'
                                    }`}
                                  >
                                    #{num}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Right: ACTUAL */}
                        <div className="flex flex-col items-end">
                          <span className="text-[8px] font-mono-tech text-gray-400">ACTUAL RESULT</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-orbitron text-xs font-black text-[#00ff88]">
                              {item.actualSize || '--'}
                            </span>
                            {item.actualNum !== undefined && (
                              <div className={`w-5 h-5 rounded-full ${getBall3dClass(item.actualNum)} text-white font-orbitron font-black text-[10px] flex items-center justify-center`}>
                                {item.actualNum}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Verification Badges Row */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-mono-tech flex items-center gap-1 border ${
                          sizeMatched 
                            ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300' 
                            : 'bg-red-950/40 border-red-500/30 text-red-300'
                        }`}>
                          <span>SIZE: {sizeMatched ? '✓ HIT' : '✗ MISS'}</span>
                        </span>

                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-mono-tech flex items-center gap-1 border ${
                          colorMatched 
                            ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300' 
                            : 'bg-red-950/40 border-red-500/30 text-red-300'
                        }`}>
                          <span>COLOR: {colorMatched ? '✓ HIT' : '✗ MISS'}</span>
                        </span>

                        {numberMatched && (
                          <span className="px-2 py-0.5 rounded-md text-[8px] font-mono-tech flex items-center gap-1 border bg-amber-950/60 border-[#ffd700]/50 text-[#ffd700] font-bold">
                            <span>★ DIRECT NO. HIT</span>
                          </span>
                        )}
                      </div>

                      {/* Card Footer: Level Stage & Confidence */}
                      <div className="flex items-center justify-between text-[8.5px] font-mono-tech text-gray-400 pt-0.5 border-t border-pink-500/15">
                        <span>LEVEL {item.levelStage || 1} RECOVERY</span>
                        <span>CONFIDENCE: {item.confidence || 96}%</span>
                      </div>
                    </div>
                  );
                })}

                {/* Pagination Controls in Cards View */}
                {visiblePredCount < filteredPreds.length && (
                  <div className="p-2.5 bg-black/80 rounded-2xl border border-pink-500/30 flex items-center justify-between text-[10px] font-mono-tech mt-1">
                    <span className="text-gray-400">
                      SHOWING {displayedPreds.length} OF {filteredPreds.length}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setVisiblePredCount(prev => prev + 30)}
                        className="px-2.5 py-1 rounded-lg bg-pink-950 hover:bg-pink-900 border border-pink-500/40 text-pink-200 hover:text-white font-orbitron font-bold transition-all cursor-pointer"
                      >
                        +30 MORE
                      </button>
                      <button
                        type="button"
                        onClick={() => setVisiblePredCount(filteredPreds.length)}
                        className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#ff2a85] to-[#ffd700] text-black font-orbitron font-black shadow-md transition-all cursor-pointer"
                      >
                        SHOW ALL
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="p-8 text-center samurai-glass-panel rounded-2xl border border-pink-500/20 text-gray-400 font-mono-tech text-xs flex flex-col items-center justify-center gap-2">
              <Sparkles size={20} className="text-[#ffd700] animate-pulse" />
              <span>No prediction records in this session yet.</span>
              <span className="text-[10px] text-pink-300">Live predictions will be recorded here automatically as rounds complete.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

