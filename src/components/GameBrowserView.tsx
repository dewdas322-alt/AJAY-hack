import React, { useState } from 'react';
import { 
  ExternalLink, 
  RotateCw, 
  Smartphone, 
  Monitor, 
  Shield, 
  Gamepad2,
  Sparkles
} from 'lucide-react';
import { ActivePrediction, MarketLiquidity } from '../types';

interface GameBrowserViewProps {
  prediction: ActivePrediction | null;
  isDecrypting: boolean;
  market: MarketLiquidity;
  onNavigateToDashboard: () => void;
}

const BDG_GAME_URL = 'https://bdgwin5.cc//#/register?invitationCode=613357406527';

export const GameBrowserView: React.FC<GameBrowserViewProps> = ({
  prediction: _prediction,
  isDecrypting: _isDecrypting,
  market: _market,
  onNavigateToDashboard: _onNavigateToDashboard,
}) => {
  const currentUrl = BDG_GAME_URL;
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [_iframeBlockedNotice, setIframeBlockedNotice] = useState<boolean>(false);

  const handleReload = () => {
    setIframeKey(prev => prev + 1);
    setHasLoaded(false);
  };

  const handleOpenExternal = () => {
    window.open(currentUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-12 px-2 sm:px-4">
      {/* Clean Game Control Bar */}
      <div className="samurai-glass-panel rounded-2xl p-2 sm:p-2.5 mb-3 backdrop-blur-xl shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2 px-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ffd700] to-[#ff1a40] p-0.5 flex items-center justify-center shadow-[0_0_10px_rgba(255,215,0,0.5)]">
            <Gamepad2 size={15} className="text-black" />
          </div>
          <div>
            <div className="font-orbitron text-xs sm:text-sm font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffd700] to-[#ff8800]">
              BDG GAME CONSOLE
            </div>
            <div className="text-[8px] font-mono-tech text-gray-400">
              OFFICIAL WINGO LIVE ARENA
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Reload Action */}
          <button
            type="button"
            onClick={handleReload}
            title="Reload Game Screen"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffd700] text-gray-300 hover:text-[#ffd700] text-xs font-orbitron font-bold flex items-center gap-1 transition-all katana-hover-slash"
          >
            <RotateCw size={13} />
            <span className="hidden sm:inline text-[10px]">RELOAD</span>
          </button>

          {/* Open Direct Window */}
          <button
            type="button"
            onClick={handleOpenExternal}
            title="Open in Direct Full Window / External Browser"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#ffd700]/15 border border-[#ffd700]/50 hover:bg-[#ffd700] hover:text-black text-[#ffd700] text-xs font-orbitron font-bold flex items-center gap-1 transition-all katana-hover-slash"
          >
            <ExternalLink size={13} />
            <span className="hidden sm:inline text-[10px]">DIRECT WINDOW</span>
          </button>

          {/* Viewport Switcher */}
          <div className="flex items-center gap-0.5 bg-black/60 rounded-xl p-0.5 border border-white/10 ml-1">
            <button
              type="button"
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 font-mono-tech transition-all ${
                viewMode === 'mobile'
                  ? 'bg-[#ff1a40] text-white shadow-[0_0_8px_#ff1a40]'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Mobile Portrait 9:16 Viewport"
            >
              <Smartphone size={13} />
              <span className="hidden sm:inline text-[9px]">9:16</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 font-mono-tech transition-all ${
                viewMode === 'desktop'
                  ? 'bg-[#ff1a40] text-white shadow-[0_0_8px_#ff1a40]'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Full Width Desktop Viewport"
            >
              <Monitor size={13} />
              <span className="hidden sm:inline text-[9px]">FULL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex justify-center w-full">
        <div 
          className={`relative bg-black rounded-2xl border-2 border-[rgba(0,255,204,0.35)] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.8)] transition-all duration-300 ${
            viewMode === 'mobile'
              ? 'w-full max-w-[430px] h-[740px]'
              : 'w-full h-[780px]'
          }`}
        >
          {/* Header Bar on Top of Frame */}
          <div className="bg-[rgba(10,14,24,0.95)] px-3 py-1.5 border-b border-white/10 flex items-center justify-between text-[11px] font-mono-tech text-gray-400">
            <div className="flex items-center gap-1.5 truncate max-w-[280px] sm:max-w-md">
              <Shield size={12} className="text-[#00ff88] shrink-0" />
              <span className="truncate text-gray-300 font-bold">BDG WINGO OFFICIAL ARENA</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-ping" />
              <span className="text-[#00ff88] font-bold">LIVE EMBED</span>
            </div>
          </div>

          {/* Loading Placeholder */}
          {!hasLoaded && (
            <div className="absolute inset-0 bg-[#060912] flex flex-col items-center justify-center p-6 text-center z-10">
              <div className="relative mb-4">
                <div className="w-14 h-14 rounded-full border-2 border-[#00ffcc] border-t-transparent animate-spin" />
                <Sparkles className="absolute inset-0 m-auto text-[#ffd700] animate-pulse" size={20} />
              </div>
              <div className="font-orbitron text-sm font-bold text-white mb-1">
                CONNECTING TO BDG GAME ARENA...
              </div>
              <p className="font-mono-tech text-xs text-gray-400 max-w-sm mb-4">
                Loading official BDG game environment
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleOpenExternal}
                  className="px-4 py-2 bg-gradient-to-r from-[#ffd700] to-[#ff9100] text-black font-orbitron text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(255,215,0,0.4)] flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink size={14} />
                  <span>OPEN IN DIRECT WINDOW</span>
                </button>
              </div>
            </div>
          )}

          {/* Actual Live Web Game Frame */}
          <iframe
            key={iframeKey}
            src={currentUrl}
            title="Real Game Live Screen"
            className="w-full h-[calc(100%-32px)] border-0 bg-white"
            allow="fullscreen; clipboard-read; clipboard-write; camera; microphone; payment"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-downloads"
            onLoad={() => {
              setHasLoaded(true);
            }}
            onError={() => {
              setIframeBlockedNotice(true);
            }}
          />
        </div>
      </div>
    </div>
  );
};
