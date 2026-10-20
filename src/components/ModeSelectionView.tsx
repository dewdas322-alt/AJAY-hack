import React from 'react';
import { WinGoMode } from '../types';
import { 
  Zap, 
  Clock, 
  Flame, 
  ShieldCheck, 
  Sword, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  Target,
  BarChart3
} from 'lucide-react';

interface ModeSelectionViewProps {
  onSelectMode: (mode: WinGoMode) => void;
}

export const ModeSelectionView: React.FC<ModeSelectionViewProps> = ({ onSelectMode }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-3 py-6 sm:py-10 flex flex-col items-center select-none">
      {/* Title & Badge */}
      <div className="text-center mb-6 relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff1a40]/15 border border-[#ff1a40]/40 text-[#ff1a40] text-xs font-orbitron font-bold tracking-widest mb-2 shadow-[0_0_15px_rgba(255,26,64,0.3)]">
          <Sword size={14} className="text-[#ff1a40]" />
          <span>MANUAL WINGO ARENA SELECTOR</span>
        </div>
        
        <h1 
          className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black tracking-[4px] sm:tracking-[8px] uppercase relative"
          style={{
            background: 'linear-gradient(180deg, #ffffff 15%, #ff2a55 70%, #d90429 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 24px rgba(255, 26, 64, 0.85))',
          }}
        >
          SAMURAI WARRIOR
        </h1>
        
        <p className="font-mono-tech text-xs sm:text-sm tracking-widest text-[#ffd700] mt-2">
          QUANTUM NEURAL PREDICTION MATRIX • HIGH WINNING MIX ENGINE
        </p>

        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="h-[1.5px] w-16 bg-gradient-to-r from-transparent to-[#ff1a40]" />
          <span className="text-[11px] font-orbitron text-gray-300 tracking-wider">
            PLEASE SELECT WINGO TIMER TO START PREDICTION
          </span>
          <span className="h-[1.5px] w-16 bg-gradient-to-l from-transparent to-[#ff1a40]" />
        </div>
      </div>

      {/* 2 Primary Mode Choice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl mb-6">
        {/* MODE 1: WinGo 30S */}
        <div 
          id="mode-card-30s"
          onClick={() => onSelectMode('30s')}
          className="samurai-glass-crimson rounded-3xl p-5 sm:p-6 border-2 border-[#ff1a40]/60 hover:border-[#ff1a40] hover:shadow-[0_0_35px_rgba(255,26,64,0.65)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer relative group flex flex-col justify-between"
        >
          {/* Floating Top Tag */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 bg-[#ff1a40]/25 text-[#ff4d6d] px-3 py-1 rounded-full border border-[#ff1a40]/50 font-orbitron text-[11px] font-black tracking-wider">
              <Zap size={13} className="text-[#ff1a40] animate-pulse" />
              <span>HYPER 30 SEC</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] shadow-[0_0_10px_#00ff88] animate-ping" />
          </div>

          <div>
            <div className="font-orbitron text-2xl sm:text-3xl font-black text-white group-hover:text-[#ffd700] transition-colors mb-1 flex items-center gap-2">
              <span>WINGO 30 SEC</span>
              <Clock size={22} className="text-[#ff1a40]" />
            </div>

            <p className="font-mono-tech text-xs text-gray-300 leading-relaxed mb-4">
              Real-time 30-second rapid fire draws with instant micro-pattern recognition, high-speed Dragon streaks, and smart liquidity targeting.
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs font-mono-tech text-gray-200">
                <Target size={13} className="text-[#ffd700] shrink-0" />
                <span><strong className="text-white">Mix Mode:</strong> Dynamic Size / Color Highest Probability</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono-tech text-gray-200">
                <ShieldCheck size={13} className="text-[#00ff88] shrink-0" />
                <span><strong className="text-white">Level Strategy:</strong> 3-Stage Martingale Safe Cap</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono-tech text-gray-200">
                <BarChart3 size={13} className="text-[#00ffcc] shrink-0" />
                <span><strong className="text-white">API Sync:</strong> draw.ar-lottery01.com WinGo_30S</span>
              </div>
            </div>
          </div>

          <button
            id="start-30s-btn"
            onClick={(e) => {
              e.stopPropagation();
              onSelectMode('30s');
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ff1a40] via-[#d90429] to-[#800f2f] text-white font-orbitron text-xs sm:text-sm font-black tracking-widest shadow-[0_0_20px_rgba(255,26,64,0.65)] group-hover:shadow-[0_0_30px_rgba(255,26,64,0.9)] flex items-center justify-center gap-2 transition-all katana-hover-slash"
          >
            <span>ENTER WINGO 30S MATRIX</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* MODE 2: WinGo 1 MIN (1M) */}
        <div 
          id="mode-card-1m"
          onClick={() => onSelectMode('1m')}
          className="samurai-glass-gold rounded-3xl p-5 sm:p-6 border-2 border-[#ffd700]/60 hover:border-[#ffd700] hover:shadow-[0_0_35px_rgba(255,215,0,0.65)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer relative group flex flex-col justify-between"
        >
          {/* Floating Top Tag */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 bg-[#ffd700]/25 text-[#ffd700] px-3 py-1 rounded-full border border-[#ffd700]/50 font-orbitron text-[11px] font-black tracking-wider">
              <Flame size={13} className="text-[#ffd700] animate-bounce" />
              <span>TREND MASTER 1 MIN</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] shadow-[0_0_10px_#00ff88] animate-ping" />
          </div>

          <div>
            <div className="font-orbitron text-2xl sm:text-3xl font-black text-white group-hover:text-[#ffd700] transition-colors mb-1 flex items-center gap-2">
              <span>WINGO 1 MIN (1M)</span>
              <Clock size={22} className="text-[#ffd700]" />
            </div>

            <p className="font-mono-tech text-xs text-gray-300 leading-relaxed mb-4">
              Deep 60-second harmonic cycle analysis with extensive Markov Chain depth, Color-Red/Green streak transitions, and maximum win reliability.
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs font-mono-tech text-gray-200">
                <Target size={13} className="text-[#ffd700] shrink-0" />
                <span><strong className="text-white">Mix Mode:</strong> Color (Red/Green Side) or Size Matrix</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono-tech text-gray-200">
                <ShieldCheck size={13} className="text-[#00ff88] shrink-0" />
                <span><strong className="text-white">Level Strategy:</strong> Maximum Win Under 3-Level Stages</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono-tech text-gray-200">
                <BarChart3 size={13} className="text-[#00ffcc] shrink-0" />
                <span><strong className="text-white">Live Official:</strong> WinGo_1M GetHistoryIssuePage</span>
              </div>
            </div>
          </div>

          <button
            id="start-1m-btn"
            onClick={(e) => {
              e.stopPropagation();
              onSelectMode('1m');
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ffd700] via-[#ffaa00] to-[#e67e00] text-black font-orbitron text-xs sm:text-sm font-black tracking-widest shadow-[0_0_20px_rgba(255,215,0,0.65)] group-hover:shadow-[0_0_30px_rgba(255,215,0,0.9)] flex items-center justify-center gap-2 transition-all katana-hover-slash"
          >
            <span>ENTER WINGO 1 MIN MATRIX</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Feature Highlights Matrix */}
      <div className="w-full max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="samurai-glass-panel rounded-xl p-3 text-center">
          <div className="font-orbitron text-sm font-black text-[#ffd700]">MIX ENGINE</div>
          <div className="text-[10px] font-mono-tech text-gray-300">Size OR Color Highest Prob</div>
        </div>

        <div className="samurai-glass-panel rounded-xl p-3 text-center">
          <div className="font-orbitron text-sm font-black text-[#00ff88]">ISOLATED DATA</div>
          <div className="text-[10px] font-mono-tech text-gray-300">30S & 1M Separate History</div>
        </div>

        <div className="samurai-glass-panel rounded-xl p-3 text-center">
          <div className="font-orbitron text-sm font-black text-[#ff1a40]">LEVEL GUARD</div>
          <div className="text-[10px] font-mono-tech text-gray-300">3-Stage Martingale Safe Cap</div>
        </div>

        <div className="samurai-glass-panel rounded-xl p-3 text-center">
          <div className="font-orbitron text-sm font-black text-[#00d4ff]">FLOATING HUD</div>
          <div className="text-[10px] font-mono-tech text-gray-300">Advanced Real Game Overlay</div>
        </div>
      </div>
    </div>
  );
};
