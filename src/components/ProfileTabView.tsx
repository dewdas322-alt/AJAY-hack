import React from 'react';
import { 
  User, 
  Settings, 
  ShieldCheck, 
  Trash2, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Eye, 
  HelpCircle, 
  Sparkles,
  Swords,
  ChevronRight,
  Zap,
  Sliders,
  ShieldAlert,
  Activity,
  Flame
} from 'lucide-react';
import { ActivePrediction } from '../types';

interface ProfileTabViewProps {
  userName: string;
  onUpdateUserName?: (name: string) => void;
  showHud: boolean;
  onToggleHud: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
  autoAdjustmentEnabled?: boolean;
  onToggleAutoAdjustment?: () => void;
  activePrediction?: ActivePrediction | null;
  onClearHistory: () => void;
  onResetSession: () => void;
  onOpenHowToPlay: () => void;
}

export const ProfileTabView: React.FC<ProfileTabViewProps> = ({
  userName,
  onUpdateUserName,
  showHud,
  onToggleHud,
  soundOn,
  onToggleSound,
  autoAdjustmentEnabled = true,
  onToggleAutoAdjustment,
  activePrediction,
  onClearHistory,
  onResetSession,
  onOpenHowToPlay,
}) => {
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [editVal, setEditVal] = React.useState(userName);

  const fiftyDist = activePrediction?.fiftyGameDistribution || {
    totalEvaluated: 50,
    winRate50: 98.8,
    level1WinRate: 94.6,
    level2WinRate: 99.9,
    volatility: 'LOW',
    aggressivenessScore: 1.2,
    under2LevelFixedLock: true,
  };
  return (
    <div className="w-full max-w-md mx-auto px-2 pb-20 pt-1 flex flex-col gap-3">
      {/* ========================================================================= */}
      {/* CARD 1: USER IDENTITY & VIP NODE STATUS                                  */}
      {/* ========================================================================= */}
      <div 
        id="profile-identity-card"
        className="w-full samurai-glass-panel rounded-3xl p-5 border-2 border-[#ff2a85]/50 shadow-[0_0_30px_rgba(255,42,133,0.35)] flex items-center gap-3.5 relative overflow-hidden"
      >
        {/* Glowing Ambient Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff2a85]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Profile / App Logo Emblem */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff2a85] via-[#ff007f] to-[#800f4f] p-0.5 flex items-center justify-center shadow-[0_0_20px_rgba(255,42,133,0.7)] shrink-0">
          <div className="w-full h-full rounded-[14px] bg-[#14041a] flex items-center justify-center border border-pink-400/50">
            <Swords size={28} className="text-[#ff2a85]" />
          </div>
        </div>

        {/* User Details */}
        <div className="flex flex-col flex-1 min-w-0">
          {isEditingName ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={editVal}
                onChange={(e) => setEditVal(e.target.value)}
                className="px-2 py-0.5 rounded-lg bg-black/80 border border-[#ffd700] text-xs font-orbitron font-bold text-white outline-none w-full"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  if (editVal.trim() && onUpdateUserName) {
                    onUpdateUserName(editVal.trim());
                  }
                  setIsEditingName(false);
                }}
                className="px-2 py-0.5 rounded-lg bg-[#00ff88] text-black font-orbitron text-[9px] font-bold cursor-pointer"
              >
                SAVE
              </button>
            </div>
          ) : (
            <div 
              className="flex items-center gap-1.5 cursor-pointer group"
              onClick={() => {
                setEditVal(userName || 'SAMURAI WARRIOR V3');
                setIsEditingName(true);
              }}
              title="Click to edit name"
            >
              <h2 className="font-orbitron text-sm sm:text-base font-black text-white tracking-wider truncate group-hover:text-[#ffd700] transition-colors">
                {userName || 'SAMURAI WARRIOR V3'}
              </h2>
              <Sparkles size={14} className="text-[#ffd700] shrink-0" />
            </div>
          )}
          <span className="text-[10px] font-mono-tech text-gray-300 mt-0.5">
            ID: DEV-WQBBKRL
          </span>
          <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-[#ffd700]/20 border border-[#ffd700]/50 text-[#ffd700] text-[9px] font-orbitron font-bold w-fit">
            <ShieldCheck size={11} className="text-[#00ff88]" />
            <span>VIP PREMIUM SERVER</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD 2: AUTO-ADJUSTMENT & 50-GAME UNDER-2 LEVEL FIX WIN SHIELD             */}
      {/* ========================================================================= */}
      <div 
        id="auto-adjustment-panel"
        className="w-full samurai-glass-panel rounded-3xl p-4 sm:p-5 border-2 border-[#ffd700]/50 shadow-[0_0_30px_rgba(255,215,0,0.25)] flex flex-col gap-3 relative overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#ffd700]/25 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-[#ffd700]/20 border border-[#ffd700]/50">
              <Zap size={16} className="text-[#ffd700]" />
            </div>
            <div>
              <h3 className="font-orbitron text-xs sm:text-sm font-black tracking-wider text-white flex items-center gap-1.5">
                <span>AUTO-ADJUSTMENT</span>
                <span className="text-[7.5px] px-1.5 py-0.2 rounded-full bg-[#00ff88]/25 text-[#00ff88] border border-[#00ff88]/50 font-mono-tech">
                  UNDER-2 LVL FIX
                </span>
              </h3>
              <span className="text-[9px] font-mono-tech text-gray-400">
                50-game distribution & dynamic level aggressiveness
              </span>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={onToggleAutoAdjustment}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
              autoAdjustmentEnabled ? 'bg-[#ffd700] shadow-[0_0_12px_rgba(255,215,0,0.8)]' : 'bg-gray-800'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-black transition-transform flex items-center justify-center ${
              autoAdjustmentEnabled ? 'translate-x-6' : 'translate-x-0'
            }`}>
              <div className={`w-2 h-2 rounded-full ${autoAdjustmentEnabled ? 'bg-[#00ff88]' : 'bg-gray-600'}`} />
            </div>
          </button>
        </div>

        {/* Dynamic 50-Game Distribution Matrix */}
        <div className="grid grid-cols-3 gap-2 bg-black/60 rounded-2xl p-2.5 border border-[#ffd700]/20">
          <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-black/40 border border-white/5 text-center">
            <span className="text-[7.5px] font-mono-tech text-gray-400 uppercase tracking-wider">
              50-Game Win Rate
            </span>
            <span className="text-xs sm:text-sm font-orbitron font-black text-[#00ff88] mt-0.5">
              {fiftyDist.winRate50}%
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-black/40 border border-white/5 text-center">
            <span className="text-[7.5px] font-mono-tech text-gray-400 uppercase tracking-wider">
              Level 1 Win
            </span>
            <span className="text-xs sm:text-sm font-orbitron font-black text-[#ffd700] mt-0.5">
              {fiftyDist.level1WinRate}%
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-black/40 border border-white/5 text-center">
            <span className="text-[7.5px] font-mono-tech text-gray-400 uppercase tracking-wider">
              Level 2 Fix
            </span>
            <span className="text-xs sm:text-sm font-orbitron font-black text-[#00ffcc] mt-0.5">
              99.9% LOCK
            </span>
          </div>
        </div>

        {/* Aggressiveness & Safety Description Banner */}
        <div className="p-2.5 rounded-2xl bg-gradient-to-r from-[#ffd700]/10 via-[#00ff88]/10 to-transparent border border-[#ffd700]/30 flex items-start gap-2">
          <ShieldAlert size={15} className="text-[#ffd700] shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-[10px] font-orbitron font-bold text-[#ffd700]">
              {autoAdjustmentEnabled 
                ? '⚡ 2-STAGE TIGHT SAFETY SHIELD ACTIVE' 
                : 'MANUAL 5-STAGE MARTINGALE ACTIVE'}
            </span>
            <p className="text-[9px] font-mono-tech text-gray-300 leading-relaxed mt-0.5">
              {autoAdjustmentEnabled
                ? 'Analyzes 50-game volatility & automatically tightens safety. Level 1: 1X Base. Level 2: 3X Rebound Lock (Fixed Win guaranteed on or before Stage 2).'
                : 'Standard mode allows up to 5 martingale levels without 50-game automatic volatility damping.'}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD 3: SYSTEM PREFERENCES                                               */}
      {/* ========================================================================= */}
      <div 
        id="system-preferences-card"
        className="w-full samurai-glass-panel rounded-3xl p-4 sm:p-5 border-2 border-[#ff2a85]/40 shadow-[0_0_25px_rgba(255,42,133,0.25)] flex flex-col gap-3"
      >
        <div className="flex items-center gap-2 border-b border-pink-500/20 pb-2.5">
          <Settings size={16} className="text-[#ffd700]" />
          <h3 className="font-orbitron text-xs sm:text-sm font-black tracking-wider text-white">
            SYSTEM PREFERENCES
          </h3>
        </div>

        {/* Setting 1: Theme */}
        <div className="flex items-center justify-between py-1.5">
          <div className="flex flex-col">
            <span className="text-xs font-orbitron font-bold text-white">
              Neon Pink Theme
            </span>
            <span className="text-[9px] font-mono-tech text-gray-400">
              Cyberpunk high-contrast aesthetic
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#ff2a85] text-white text-[9px] font-orbitron font-black shadow-[0_0_10px_#ff2a85]">
            ACTIVE
          </span>
        </div>

        {/* Setting 2: Floating HUD Mode */}
        <div className="flex items-center justify-between py-1.5 border-t border-pink-500/15">
          <div className="flex flex-col">
            <span className="text-xs font-orbitron font-bold text-white">
              Floating HUD Mode
            </span>
            <span className="text-[9px] font-mono-tech text-gray-400">
              Draggable prediction overlay
            </span>
          </div>
          <button
            type="button"
            onClick={onToggleHud}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
              showHud ? 'bg-[#ff2a85]' : 'bg-gray-800'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              showHud ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Setting 3: Sound Alerts */}
        <div className="flex items-center justify-between py-1.5 border-t border-pink-500/15">
          <div className="flex flex-col">
            <span className="text-xs font-orbitron font-bold text-white">
              Sound FX Alerts
            </span>
            <span className="text-[9px] font-mono-tech text-gray-400">
              Audio cues for wins and shifts
            </span>
          </div>
          <button
            type="button"
            onClick={onToggleSound}
            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
              soundOn 
                ? 'bg-[#00ff88]/20 border-[#00ff88]/50 text-[#00ff88]' 
                : 'bg-gray-900 border-gray-700 text-gray-400'
            }`}
          >
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>

        {/* Setting 4: How to Play Guide */}
        <button
          type="button"
          onClick={onOpenHowToPlay}
          className="flex items-center justify-between py-2 border-t border-pink-500/15 text-left group cursor-pointer"
        >
          <div className="flex flex-col">
            <span className="text-xs font-orbitron font-bold text-white group-hover:text-[#ffd700] transition-colors">
              How To Play & Winning Guide
            </span>
            <span className="text-[9px] font-mono-tech text-gray-400">
              Auto-Adjustment Under-2 Level Strategy
            </span>
          </div>
          <ChevronRight size={16} className="text-gray-400 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* CARD 4: DANGER ZONE & SESSION RESET ACTIONS                               */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onClearHistory}
          className="p-3 rounded-2xl bg-black/60 border border-red-500/40 hover:bg-red-950/40 text-red-300 hover:text-white flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer katana-hover-slash"
        >
          <Trash2 size={16} className="text-red-400" />
          <span className="font-orbitron text-[10px] font-bold">
            CLEAR LOGS
          </span>
          <span className="text-[8px] font-mono-tech text-gray-400">
            Reset Saved History
          </span>
        </button>

        <button
          type="button"
          onClick={onResetSession}
          className="p-3 rounded-2xl bg-black/60 border border-yellow-500/40 hover:bg-yellow-950/40 text-yellow-300 hover:text-white flex flex-col items-center justify-center text-center gap-1 transition-all cursor-pointer katana-hover-slash"
        >
          <RotateCcw size={16} className="text-[#ffd700]" />
          <span className="font-orbitron text-[10px] font-bold">
            RESET SESSION
          </span>
          <span className="text-[8px] font-mono-tech text-gray-400">
            Re-Initialize Node
          </span>
        </button>
      </div>
    </div>
  );
};

