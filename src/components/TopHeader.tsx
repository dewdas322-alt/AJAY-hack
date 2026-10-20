import React from 'react';
import { 
  User, 
  Menu, 
  Swords, 
  Clock, 
  Wifi, 
  ShieldCheck, 
  Sparkles,
  Zap
} from 'lucide-react';
import { WinGoMode, MainTabType } from '../types';

interface TopHeaderProps {
  userName: string;
  selectedMode: WinGoMode;
  onSelectMode: (mode: WinGoMode) => void;
  onOpenProfile: () => void;
  onOpenOptions: () => void;
  isConnected: boolean;
  isDecrypting: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  userName,
  selectedMode,
  onSelectMode,
  onOpenProfile,
  onOpenOptions,
  isConnected,
  isDecrypting,
}) => {
  return (
    <header className="w-full max-w-md mx-auto px-2 pt-2 pb-1.5 sticky top-0 z-40">
      <div 
        id="top-header-bar"
        className="w-full samurai-glass-panel rounded-2xl px-3 py-2 flex items-center justify-between border-2 border-[#ff2a85]/50 shadow-[0_4px_25px_rgba(255,42,133,0.3)] backdrop-blur-xl"
      >
        {/* Left: User Avatar & Quick Profile Trigger */}
        <button
          id="profile-avatar-btn"
          type="button"
          onClick={onOpenProfile}
          className="flex items-center gap-2 p-1 rounded-xl bg-pink-950/40 hover:bg-pink-900/60 border border-pink-500/30 transition-all cursor-pointer katana-hover-slash"
          title="Open User Profile & Settings"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff2a85] to-[#800f4f] p-0.5 flex items-center justify-center shadow-[0_0_10px_rgba(255,42,133,0.6)]">
            <User size={16} className="text-white" />
          </div>
          <div className="hidden xs:flex flex-col text-left pr-1">
            <span className="text-[10px] font-orbitron font-bold text-white truncate max-w-[80px]">
              {userName || 'SAMURAI'}
            </span>
            <span className="text-[8px] font-mono-tech text-[#ffd700]">VIP NODE</span>
          </div>
        </button>

        {/* Center: App Title Branding & Mode Selector */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <Swords size={15} className="text-[#ff2a85] animate-pulse" />
            <span className="font-orbitron text-xs sm:text-sm font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ff2a85] to-[#ffd700]">
              SAMURAI WARRIOR V3
            </span>
          </div>
          {/* Quick Mode Switcher Pills */}
          <div className="flex items-center gap-1 mt-0.5 bg-black/60 rounded-lg p-0.5 border border-pink-500/20 text-[9px] font-orbitron font-bold">
            <button
              type="button"
              onClick={() => onSelectMode('30s')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                selectedMode === '30s'
                  ? 'bg-[#ff2a85] text-white shadow-[0_0_8px_#ff2a85] font-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              30S
            </button>
            <button
              type="button"
              onClick={() => onSelectMode('1m')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                selectedMode === '1m'
                  ? 'bg-[#ffd700] text-black shadow-[0_0_8px_#ffd700] font-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              1M
            </button>
          </div>
        </div>

        {/* Right: Latency & Menu Button */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 border border-pink-500/20 text-[9px] font-mono-tech">
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-[#00ff88] animate-ping' : 'bg-red-500'}`} />
            <span className="text-[#00ff88] font-bold">{isDecrypting ? 'SCAN' : '12ms'}</span>
          </div>

          <button
            id="menu-options-btn"
            type="button"
            onClick={onOpenOptions}
            className="w-8 h-8 rounded-xl bg-pink-950/40 hover:bg-pink-900/60 border border-pink-500/30 flex items-center justify-center text-pink-200 hover:text-white transition-all cursor-pointer katana-hover-slash"
            title="Open Options Menu"
          >
            <Menu size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
