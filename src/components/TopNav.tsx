import React from 'react';
import { 
  Activity, 
  RefreshCw, 
  Cpu, 
  Gamepad2, 
  Layers, 
  Zap, 
  Clock, 
  LayoutGrid 
} from 'lucide-react';
import { MainTabType, WinGoMode } from '../types';

interface TopNavProps {
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  selectedMode: WinGoMode | null;
  onSwitchMode: () => void;
  onSelectMode: (mode: WinGoMode) => void;
  isConnected: boolean;
  isDecrypting: boolean;
  soundOn?: boolean;
  onToggleSound?: () => void;
  onRefresh: () => void;
  showHud: boolean;
  onToggleHud: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onTabChange,
  selectedMode,
  onSwitchMode,
  onSelectMode,
  isConnected,
  isDecrypting,
  soundOn: _soundOn,
  onToggleSound: _onToggleSound,
  onRefresh,
  showHud,
  onToggleHud,
}) => {
  return (
    <header className="w-full max-w-3xl mx-auto mb-3 px-2 pt-2">
      {/* Top Bar status and controls */}
      <div 
        id="top-nav-bar"
        className="flex items-center justify-between px-3.5 py-2 bg-[rgba(10,12,22,0.78)] backdrop-blur-xl rounded-2xl border border-[rgba(255,42,85,0.45)] shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
      >
        {/* Status Indicator & Current Mode Chip */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <span 
              className={`w-2.5 h-2.5 rounded-full ${
                isConnected 
                  ? 'bg-[#00ff88] shadow-[0_0_12px_#00ff88] animate-pulse' 
                  : 'bg-[#ff1a40] shadow-[0_0_12px_#ff1a40]'
              }`} 
            />
            {isDecrypting && (
              <span className="absolute w-4 h-4 rounded-full border border-[#ff1a40] animate-ping opacity-75" />
            )}
          </div>
          <span 
            id="apiStatus" 
            className="text-[11px] sm:text-xs font-orbitron font-bold tracking-wider"
            style={{ color: isConnected ? '#00ff88' : '#ff1a40' }}
          >
            {isDecrypting ? 'KATANA SCANNING...' : isConnected ? 'SERVER: SYNCED' : 'RECONNECTING...'}
          </span>

          {/* Current Active Mode Badge */}
          {selectedMode && (
            <div className="hidden sm:flex items-center gap-1 ml-1 px-2 py-0.5 rounded-lg bg-[#ff1a40]/20 border border-[#ff1a40]/40 text-[#ffd700] text-[10px] font-orbitron font-black">
              <Clock size={11} className="text-[#ff1a40]" />
              <span>{selectedMode === '30s' ? 'WINGO 30S' : 'WINGO 1 MIN'}</span>
            </div>
          )}
        </div>

        {/* Mode Switcher, Refresh & HUD buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick 30S / 1M Mode Switcher */}
          {selectedMode && (
            <div className="flex items-center bg-black/60 rounded-xl p-0.5 border border-white/10 text-[10px] font-orbitron font-bold">
              <button
                id="quick-switch-30s"
                onClick={() => onSelectMode('30s')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  selectedMode === '30s'
                    ? 'bg-[#ff1a40] text-white shadow-[0_0_10px_#ff1a40]'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Switch to WinGo 30S"
              >
                30S
              </button>
              <button
                id="quick-switch-1m"
                onClick={() => onSelectMode('1m')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  selectedMode === '1m'
                    ? 'bg-[#ffd700] text-black shadow-[0_0_10px_#ffd700]'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Switch to WinGo 1 Min"
              >
                1M
              </button>
            </div>
          )}

          {/* Change Mode Arena Button */}
          {selectedMode && (
            <button
              id="change-mode-hub-btn"
              onClick={onSwitchMode}
              title="Return to WinGo Mode Selector"
              className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-[#ffd700] hover:border-[#ffd700] transition-all text-[10px] font-orbitron font-bold flex items-center gap-1 katana-hover-slash cursor-pointer"
            >
              <LayoutGrid size={12} className="text-[#ffd700]" />
              <span className="hidden sm:inline">ARENA</span>
            </button>
          )}

          <button
            id="manual-refresh-btn"
            onClick={onRefresh}
            title="Force Matrix Sync"
            className="p-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,42,85,0.35)] text-[#ff1a40] hover:bg-[rgba(255,42,85,0.25)] transition-all katana-hover-slash cursor-pointer"
          >
            <RefreshCw size={14} className={isDecrypting ? 'animate-spin' : ''} />
          </button>

          {activeTab === 'live_game' && (
            <button
              id="hud-toggle-btn"
              onClick={onToggleHud}
              title="Toggle Floating Predictor HUD"
              className={`px-2.5 py-1 rounded-lg text-[10px] font-orbitron font-bold border transition-all flex items-center gap-1 katana-hover-slash cursor-pointer ${
                showHud 
                  ? 'bg-gradient-to-r from-[#ff1a40] to-[#d90429] text-white border-[#ff4d6d] shadow-[0_0_16px_rgba(255,26,64,0.7)]' 
                  : 'bg-[rgba(255,42,85,0.15)] text-[#ff1a40] border-[rgba(255,42,85,0.4)]'
              }`}
            >
              <Zap size={11} />
              <span>HUD</span>
            </button>
          )}
        </div>
      </div>

      {/* 2 MAIN APP TABS (Only shown once a mode is selected) */}
      {selectedMode && (
        <div className="grid grid-cols-2 gap-2 mt-2.5">
          <button
            id="tab-btn-dashboard"
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-orbitron text-xs sm:text-sm font-bold tracking-wider transition-all duration-300 katana-hover-slash cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-[#ff1a40] via-[#d90429] to-[#800f2f] text-white border border-[#ff4d6d] shadow-[0_0_24px_rgba(255,26,64,0.65)] scale-[1.01]'
                : 'samurai-glass-panel text-gray-300 border border-[rgba(255,255,255,0.1)] hover:text-[#ff1a40] hover:border-[rgba(255,42,85,0.5)]'
            }`}
          >
            <Layers size={15} />
            <span>SAMURAI MATRIX</span>
          </button>

          <button
            id="tab-btn-live-game"
            onClick={() => onTabChange('live_game')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-orbitron text-xs sm:text-sm font-bold tracking-wider transition-all duration-300 relative katana-hover-slash cursor-pointer ${
              activeTab === 'live_game'
                ? 'bg-gradient-to-r from-[#ffd700] via-[#ffaa00] to-[#e67e00] text-black border border-[#ffd700] shadow-[0_0_24px_rgba(255,215,0,0.65)] scale-[1.01]'
                : 'samurai-glass-panel text-gray-300 border border-[rgba(255,255,255,0.1)] hover:text-[#ffd700] hover:border-[rgba(255,215,0,0.5)]'
            }`}
          >
            <Gamepad2 size={15} />
            <span>REAL GAME LIVE</span>
            <span className="w-2 h-2 rounded-full bg-[#ff1a40] animate-ping absolute top-1.5 right-2" />
          </button>
        </div>
      )}
    </header>
  );
};
