import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Flame, 
  TrendingUp, 
  ShieldAlert, 
  RefreshCw, 
  Radio, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Database,
  ExternalLink,
  Percent
} from 'lucide-react';
import { WinGoMode } from '../types';

interface TopStatsDrawerProps {
  mode: WinGoMode;
  onSwitchMode: (mode: WinGoMode) => void;
  totalBets: number;
  totalWins: number;
  totalLosses: number;
  maxLossStreak: number;
  currentLossStreak: number;
  accuracy: number;
  currentIssue: string;
  isSyncing: boolean;
  onManualSync: () => void;
  apiEndpoint?: string;
  onClose?: () => void;
}

export const TopStatsDrawer: React.FC<TopStatsDrawerProps> = ({
  mode,
  onSwitchMode,
  totalBets,
  totalWins,
  totalLosses,
  maxLossStreak,
  currentLossStreak,
  accuracy,
  currentIssue,
  isSyncing,
  onManualSync,
  apiEndpoint: _apiEndpoint,
  onClose,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [_showSettings, _setShowSettings] = useState(false);

  const _netWins = totalWins - totalLosses;

  return (
    <div 
      id="top-stats-drawer"
      className="w-full bg-[#0d091a]/95 border-b border-[#ffd700]/30 shadow-[0_8px_30px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-all duration-300 relative z-30 animate-in fade-in slide-in-from-top-4 duration-200"
    >
      {/* Top Banner Bar with Collapse Switch */}
      <div className="max-w-7xl mx-auto px-3 py-2 flex items-center justify-between gap-2 border-b border-white/5">
        {/* Left: Mode & Sync Live Tag */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#ffd700]/10 border border-[#ffd700]/40 px-2.5 py-1 rounded-lg">
            <Radio size={12} className="text-[#00ff88] animate-pulse" />
            <span className="font-orbitron text-[10px] font-black text-[#ffd700] tracking-wider">
              SAMURAI WARRIOR: {mode.toUpperCase()}
            </span>
          </div>

          <span className="text-[10px] font-mono-tech text-gray-400 hidden sm:inline-block">
            ISSUE #{currentIssue ? currentIssue.slice(-5) : '-----'}
          </span>
        </div>

        {/* Center: Quick Scannable Metrics on Header */}
        <div className="flex items-center gap-3 font-mono-tech text-[10px]">
          <div className="flex items-center gap-1">
            <span className="text-gray-400">WIN RATE:</span>
            <span className="font-bold text-[#00ff88] font-orbitron">
              {accuracy.toFixed(1)}%
            </span>
          </div>

          <div className="hidden xs:flex items-center gap-1">
            <span className="text-gray-400">MAX LOSS STREAK:</span>
            <span className="font-bold text-[#ff1a40] font-orbitron px-1.5 py-0.2 rounded bg-[#ff1a40]/15 border border-[#ff1a40]/30">
              {maxLossStreak}X
            </span>
          </div>
        </div>

        {/* Right: Manual Sync & Drawer Hide Toggle Button */}
        <div className="flex items-center gap-1.5">
          <button
            id="manual-sync-btn"
            onClick={onManualSync}
            disabled={isSyncing}
            className="p-1.5 rounded-lg bg-black/40 border border-white/10 hover:border-[#00ff88] text-gray-300 hover:text-[#00ff88] transition-all disabled:opacity-50 cursor-pointer"
            title="Real-Time Data Refresh"
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin text-[#00ff88]' : ''} />
          </button>

          {onClose ? (
            <button
              id="close-stats-drawer-btn"
              onClick={onClose}
              className="px-2.5 py-1 rounded-lg bg-[#ffd700]/15 border border-[#ffd700]/40 text-[#ffd700] hover:bg-[#ffd700]/25 font-mono-tech text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer"
              title="Hide Features & Stats"
            >
              <span>HIDE</span>
              <ChevronUp size={14} />
            </button>
          ) : (
            <button
              id="toggle-stats-drawer-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="px-2.5 py-1 rounded-lg bg-[#ffd700]/15 border border-[#ffd700]/40 text-[#ffd700] hover:bg-[#ffd700]/25 font-mono-tech text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer"
              title={isCollapsed ? 'Show Stats Drawer' : 'Hide Stats Drawer'}
            >
              <span>{isCollapsed ? 'STATS' : 'HIDE'}</span>
              {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Expandable Body */}
      {!isCollapsed && (
        <div className="max-w-7xl mx-auto p-3 transition-all animate-fadeIn">
          {/* Main 4-Grid Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            {/* Total Bets */}
            <div className="bg-black/60 border border-white/10 rounded-xl p-2.5 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono-tech text-gray-400 block">TOTAL BETS</span>
                <span className="font-orbitron text-base font-black text-white">{totalBets}</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-300">
                <Layers size={16} />
              </div>
            </div>

            {/* Wins & Losses */}
            <div className="bg-black/60 border border-white/10 rounded-xl p-2.5 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono-tech text-gray-400 block">WINS / LOSSES</span>
                <div className="flex items-center gap-1.5 font-orbitron text-sm font-black">
                  <span className="text-[#00ff88]">{totalWins}W</span>
                  <span className="text-gray-500">/</span>
                  <span className="text-[#ff1a40]">{totalLosses}L</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center text-[#00ff88]">
                <TrendingUp size={16} />
              </div>
            </div>

            {/* Maximum Loss Streak (Anti-Loss Counter) */}
            <div className="bg-black/60 border border-[#ff1a40]/30 rounded-xl p-2.5 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono-tech text-[#ff4d6d] block">MAX LOSS STREAK</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-orbitron text-base font-black text-[#ff1a40]">
                    {maxLossStreak}
                  </span>
                  <span className="text-[9px] font-mono-tech text-gray-400">
                    (Current: {currentLossStreak})
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[#ff1a40]/15 border border-[#ff1a40]/40 flex items-center justify-center text-[#ff1a40]">
                <ShieldAlert size={16} />
              </div>
            </div>

            {/* Win Rate Accuracy */}
            <div className="bg-black/60 border border-[#ffd700]/30 rounded-xl p-2.5 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono-tech text-[#ffd700] block">VOTE ACCURACY</span>
                <span className="font-orbitron text-base font-black text-[#ffd700]">
                  {accuracy.toFixed(1)}%
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[#ffd700]/15 border border-[#ffd700]/40 flex items-center justify-center text-[#ffd700]">
                <Percent size={16} />
              </div>
            </div>
          </div>

          {/* Real Game Sync Mode Selector & Live Endpoint Switch */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-[11px] font-mono-tech">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">SELECT GAME MODE:</span>
              <button
                id="select-mode-30s-btn"
                onClick={() => onSwitchMode('30s')}
                className={`px-3 py-1 rounded-lg font-orbitron text-xs font-black transition-all cursor-pointer ${
                  mode === '30s'
                    ? 'bg-[#ff1a40] text-white shadow-[0_0_12px_rgba(255,26,64,0.6)] border border-white/20'
                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                ⚡ WINGO 30 SEC
              </button>
              <button
                id="select-mode-1m-btn"
                onClick={() => onSwitchMode('1m')}
                className={`px-3 py-1 rounded-lg font-orbitron text-xs font-black transition-all cursor-pointer ${
                  mode === '1m'
                    ? 'bg-[#ffd700] text-black shadow-[0_0_12px_rgba(255,215,0,0.6)] border border-black/20'
                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                💎 WINGO 1 MIN
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <Database size={11} className="text-[#00ff88]" />
                <span>170×3 HYPER-VOTING MATRIX ARMED</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
