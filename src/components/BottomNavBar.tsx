import React from 'react';
import { 
  Home, 
  History, 
  BarChart2, 
  User, 
  Zap, 
  Sparkles 
} from 'lucide-react';

export type BottomTabType = 'home' | 'history' | 'stats' | 'profile';

interface BottomNavBarProps {
  activeTab: BottomTabType;
  onTabChange: (tab: BottomTabType) => void;
  onQuickAction: () => void;
  isQuickActionActive?: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  onQuickAction,
  isQuickActionActive = false,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-3 pb-3 pt-1 pointer-events-auto">
      <div 
        id="bottom-tab-bar"
        className="w-full samurai-glass-panel rounded-2xl px-2 py-1.5 flex items-center justify-between border-2 border-[#ff2a85]/50 shadow-[0_4px_30px_rgba(255,42,133,0.4)] backdrop-blur-2xl relative"
      >
        {/* Tab 1: HOME */}
        <button
          id="nav-tab-home"
          type="button"
          onClick={() => onTabChange('home')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'text-[#ff2a85] font-bold'
              : 'text-gray-400 hover:text-pink-200'
          }`}
        >
          <Home size={18} className={activeTab === 'home' ? 'stroke-[2.5] drop-shadow-[0_0_8px_#ff2a85]' : ''} />
          <span className="text-[9px] font-orbitron mt-0.5 tracking-wider">HOME</span>
        </button>

        {/* Tab 2: HISTORY */}
        <button
          id="nav-tab-history"
          type="button"
          onClick={() => onTabChange('history')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'text-[#ff2a85] font-bold'
              : 'text-gray-400 hover:text-pink-200'
          }`}
        >
          <History size={18} className={activeTab === 'history' ? 'stroke-[2.5] drop-shadow-[0_0_8px_#ff2a85]' : ''} />
          <span className="text-[9px] font-orbitron mt-0.5 tracking-wider">HISTORY</span>
        </button>

        {/* Center Floating Quick Action Button (HUD / Scan Trigger) */}
        <div className="flex-1 flex items-center justify-center relative -top-3">
          <button
            id="center-fab-btn"
            type="button"
            onClick={onQuickAction}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ff2a85] via-[#ff007f] to-[#ffd700] p-0.5 shadow-[0_0_25px_rgba(255,42,133,0.85)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer katana-hover-slash"
            title="Toggle Floating Samurai HUD"
          >
            <div className="w-full h-full rounded-[14px] bg-[#14041a] flex items-center justify-center border border-pink-400/50">
              <Zap size={22} className="text-[#ffd700] fill-[#ffd700] animate-pulse" />
            </div>
          </button>
        </div>

        {/* Tab 3: STATS */}
        <button
          id="nav-tab-stats"
          type="button"
          onClick={() => onTabChange('stats')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'stats'
              ? 'text-[#ff2a85] font-bold'
              : 'text-gray-400 hover:text-pink-200'
          }`}
        >
          <BarChart2 size={18} className={activeTab === 'stats' ? 'stroke-[2.5] drop-shadow-[0_0_8px_#ff2a85]' : ''} />
          <span className="text-[9px] font-orbitron mt-0.5 tracking-wider">STATS</span>
        </button>

        {/* Tab 4: PROFILE */}
        <button
          id="nav-tab-profile"
          type="button"
          onClick={() => onTabChange('profile')}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'text-[#ff2a85] font-bold'
              : 'text-gray-400 hover:text-pink-200'
          }`}
        >
          <User size={18} className={activeTab === 'profile' ? 'stroke-[2.5] drop-shadow-[0_0_8px_#ff2a85]' : ''} />
          <span className="text-[9px] font-orbitron mt-0.5 tracking-wider">PROFILE</span>
        </button>
      </div>
    </nav>
  );
};
