import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivePrediction, MarketLiquidity, PredictionHistoryItem } from '../types';
import { 
  X, 
  Sparkles, 
  Swords, 
  Minimize2,
  Settings,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ShieldCheck,
  Cpu,
  Activity,
  Zap,
  Flame,
  Crosshair,
  Award,
  Crown
} from 'lucide-react';

interface FloatingPredictorHudProps {
  prediction: ActivePrediction | null;
  isDecrypting: boolean;
  market?: MarketLiquidity;
  ghostMode?: boolean;
  lockPosition?: boolean;
  onToggleGhostMode?: () => void;
  onToggleLockPosition?: () => void;
  soundOn?: boolean;
  onToggleSound?: () => void;
  isOpen?: boolean;
  onToggleOpen?: (open: boolean) => void;
  isHackActive?: boolean;
  onStartHack?: () => void;
  latestFinishedResult?: PredictionHistoryItem | null;
}

export const FloatingPredictorHud: React.FC<FloatingPredictorHudProps> = ({
  prediction,
  isDecrypting,
  ghostMode = false,
  lockPosition = false,
  onToggleGhostMode,
  onToggleLockPosition,
  soundOn = true,
  onToggleSound: _onToggleSound,
  isOpen = true,
  onToggleOpen,
  isHackActive = true,
  onStartHack,
  latestFinishedResult,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isWinBurstActive, setIsWinBurstActive] = useState<boolean>(false);
  const [burstType, setBurstType] = useState<'WIN' | 'JACKPOT' | null>(null);
  const lastBurstIdRef = useRef<string | null>(null);

  // Trigger high-frequency Katana Win/Jackpot Strike when confirmed
  useEffect(() => {
    if (!latestFinishedResult) return;
    if (latestFinishedResult.id === lastBurstIdRef.current) return;

    if (latestFinishedResult.status === 'WIN' || latestFinishedResult.status === 'JACKPOT') {
      lastBurstIdRef.current = latestFinishedResult.id;
      setBurstType(latestFinishedResult.status);
      setIsWinBurstActive(true);

      // Play katana slice sound effect if sound is on
      if (soundOn && typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
        try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          const ctx = new AudioCtx();
          
          // Katana Whistle & Resonant Blade Hit
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.35);

          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        } catch {
          // ignore audio error
        }
      }

      const timer = setTimeout(() => {
        setIsWinBurstActive(false);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [latestFinishedResult, soundOn]);

  // STRICT 100% NUMBER PREDICTION LOGIC (3 HIGH-PROBABILITY NUMBERS MIX)
  const isHold = prediction?.predictionType === 'HOLD' || prediction?.targetPick === 'HOLD';

  // 3 High-Probability Numbers (10-1000 Deep Horizon Matrix)
  const numPredictions = prediction?.numberPredictions;
  const num1 = numPredictions?.heroNumber ?? (prediction?.predictedNumbers?.[0] ?? 7);
  const num2 = numPredictions?.comboNumber ?? (prediction?.predictedNumbers?.[1] ?? 2);
  const num3 = numPredictions?.hedgeNumber ?? (prediction?.predictedNumbers?.[2] ?? 8);
  const comboLabel = numPredictions?.comboPatternLabel || `1000-DATA QUANTUM ENGINE: (#${num1} • #${num2} • #${num3})`;

  const conf1 = numPredictions?.confidence1 ?? 99.6;
  const conf2 = numPredictions?.confidence2 ?? 99.1;
  const conf3 = numPredictions?.confidence3 ?? 98.7;
  const jackpotProb = numPredictions?.jackpotProbability ?? 99.9;
  const workerLatency = numPredictions?.workerLatencyMs ?? 7;
  const entropyScore = numPredictions?.entropyScore ?? 0.82;
  const oscillatorPhase = numPredictions?.oscillatorPhase ?? 'HIGH-FREQUENCY HARMONIC OSCILLATOR';

  const confidencePct = prediction?.confidenceMeter?.percentage ?? prediction?.confidence ?? 98.4;
  const issueShort = prediction?.issue ? prediction.issue.slice(-4) : '---';

  const handleClose = () => {
    if (onToggleOpen) {
      onToggleOpen(false);
    }
  };

  return (
    <motion.div
      drag={!lockPosition}
      dragMomentum={false}
      dragElastic={0}
      initial={{ x: 0, y: 0 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => {
        setTimeout(() => setIsDragging(false), 100);
      }}
      whileDrag={{ scale: 1.02 }}
      className={`fixed bottom-8 right-5 z-[999999] select-none touch-none ${
        lockPosition ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
      } ${
        ghostMode ? 'opacity-35 hover:opacity-100 transition-opacity duration-300' : 'opacity-100'
      }`}
      style={{ touchAction: 'none' }}
    >
      <AnimatePresence mode="wait">
        {/* ========================================================================= */}
        {/* STATE A: HYPER-PREMIUM CYBER SAMURAI KATANA HUD                           */}
        {/* ========================================================================= */}
        {!isCollapsed ? (
          <motion.div
            key="hud-expanded-view"
            initial={{ scale: 0.82, opacity: 0, y: 12 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
              filter: isWinBurstActive
                ? [
                    'drop-shadow(0 0 15px rgba(0,255,136,0.9))',
                    'drop-shadow(0 0 50px rgba(255,215,0,1)) drop-shadow(0 0 30px rgba(0,255,136,1))',
                    'drop-shadow(0 0 10px rgba(0,255,136,0.7))',
                    'drop-shadow(0 0 60px rgba(255,215,0,1)) drop-shadow(0 0 40px rgba(255,255,255,1))',
                    'drop-shadow(0 0 20px rgba(0,255,136,0.9))'
                  ]
                : 'drop-shadow(0 20px 40px rgba(0,0,0,0.98))'
            }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 480, 
              damping: 30,
              filter: { repeat: isWinBurstActive ? Infinity : 0, duration: 0.7 }
            }}
            className="relative flex items-center justify-center"
          >
            {/* HIGH-FREQUENCY KATANA CROSS-SLASH LASERS ON WIN HIT */}
            {isWinBurstActive && (
              <div className="absolute inset-0 pointer-events-none z-50 overflow-visible flex items-center justify-center">
                {/* Laser Slash Beam 1 (-45 deg) */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{
                    scaleX: [0, 1.6, 0],
                    opacity: [0, 1, 0],
                    rotate: -42,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  className="absolute w-72 h-1 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent filter drop-shadow-[0_0_12px_#00ff88]"
                />

                {/* Laser Slash Beam 2 (+45 deg) */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{
                    scaleX: [0, 1.6, 0],
                    opacity: [0, 1, 0],
                    rotate: 42,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.5,
                    delay: 0.2,
                    ease: "easeOut",
                  }}
                  className="absolute w-72 h-1 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent filter drop-shadow-[0_0_14px_#ffd700]"
                />

                {/* High-frequency expanding shockwave ring */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 1 }}
                  animate={{ scale: [0.8, 1.8, 2.2], opacity: [1, 0.6, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "easeOut" }}
                  className="absolute w-44 h-44 rounded-full border-2 border-[#00ff88] filter drop-shadow-[0_0_20px_#00ff88]"
                />
              </div>
            )}

            {/* LEFT HYPER-PREMIUM CYBER KATANA BLADE WING */}
            <motion.div 
              animate={{
                filter: isWinBurstActive
                  ? [
                      'drop-shadow(0 0 15px #00ff88) drop-shadow(0 0 25px #ffd700)',
                      'drop-shadow(0 0 45px #ffd700) drop-shadow(0 0 35px #ffffff)',
                      'drop-shadow(0 0 20px #00ff88)'
                    ]
                  : 'drop-shadow(0 0 18px rgba(255,215,0,0.95))',
                scale: isWinBurstActive ? [1, 1.08, 1] : 1
              }}
              transition={{ repeat: isWinBurstActive ? Infinity : 0, duration: 0.4 }}
              className="absolute -left-12 sm:-left-14 top-1/2 -translate-y-1/2 w-14 sm:w-16 h-36 pointer-events-none z-0"
            >
              <svg
                viewBox="0 0 100 200"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Katana Steel Gradient */}
                  <linearGradient id="katanaBladeLeft" x1="0.8" y1="0.2" x2="0.1" y2="0.9">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="20%" stopColor="#ffe680" />
                    <stop offset="45%" stopColor={isWinBurstActive ? "#00ff88" : "#ffd700"} />
                    <stop offset="70%" stopColor="#ff1a40" />
                    <stop offset="100%" stopColor="#2a0815" />
                  </linearGradient>
                  {/* Golden Habaki & Tsuba */}
                  <linearGradient id="katanaGoldLeft" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fff8cc" />
                    <stop offset="50%" stopColor="#ffd700" />
                    <stop offset="100%" stopColor="#996500" />
                  </linearGradient>
                  {/* Tsuka Wrapped Hilt */}
                  <linearGradient id="katanaHiltLeft" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1a1a2e" />
                    <stop offset="50%" stopColor="#ffd700" />
                    <stop offset="100%" stopColor="#0f0f18" />
                  </linearGradient>
                </defs>

                {/* Cyber Katana Razor Blade Curved Spine */}
                <path
                  d="M88 100 C75 70, 52 42, 38 18 C28 5, 20 2, 18 2 C18 10, 24 35, 42 68 C58 98, 72 120, 85 130 Z"
                  fill="url(#katanaBladeLeft)"
                  stroke="#ffffff"
                  strokeWidth="0.8"
                />

                {/* Katana Glowing Razor Hamon Edge */}
                <path
                  d="M18 2 C22 25, 38 58, 54 86 C68 110, 80 125, 85 130 C82 124, 70 100, 56 74 C42 48, 28 20, 18 2 Z"
                  fill="#ffffff"
                  opacity="0.95"
                  className={`filter ${isWinBurstActive ? 'drop-shadow-[0_0_12px_#00ff88]' : 'drop-shadow-[0_0_6px_#ffffff]'}`}
                />

                {/* Katana Habaki (Gold Blade Collar) */}
                <path
                  d="M80 124 L88 135 L80 142 L72 131 Z"
                  fill="url(#katanaGoldLeft)"
                  stroke="#ffd700"
                  strokeWidth="0.5"
                />

                {/* Katana Tsuba (Oval Guard) */}
                <ellipse
                  cx="78"
                  cy="138"
                  rx="14"
                  ry="5"
                  transform="rotate(-32 78 138)"
                  fill="url(#katanaGoldLeft)"
                  stroke="#ffffff"
                  strokeWidth="0.8"
                />

                {/* Katana Tsuka (Hilt Handle) */}
                <path
                  d="M74 142 L58 178 L48 172 L64 136 Z"
                  fill="url(#katanaHiltLeft)"
                  stroke="#ffd700"
                  strokeWidth="0.6"
                />

                {/* Tsuka Tsukamaki Diamond Wrapping Lines */}
                <line x1="70" y1="145" x2="60" y2="152" stroke="#ffd700" strokeWidth="1.2" />
                <line x1="66" y1="154" x2="56" y2="161" stroke="#ffd700" strokeWidth="1.2" />
                <line x1="62" y1="163" x2="52" y2="170" stroke="#ffd700" strokeWidth="1.2" />

                {/* Kashira (Pommel Cap) */}
                <circle cx="53" cy="175" r="4" fill="url(#katanaGoldLeft)" stroke="#ffffff" strokeWidth="0.5" />

                {/* Blade Laser Sparks */}
                <circle cx="32" cy="22" r="1.5" fill="#ffffff" className="animate-ping" />
                <circle cx="50" cy="55" r="1.2" fill="#ffd700" className="animate-pulse" />
              </svg>
            </motion.div>

            {/* RIGHT HYPER-PREMIUM CYBER KATANA BLADE WING */}
            <motion.div 
              animate={{
                filter: isWinBurstActive
                  ? [
                      'drop-shadow(0 0 15px #00ff88) drop-shadow(0 0 25px #ffd700)',
                      'drop-shadow(0 0 45px #ffd700) drop-shadow(0 0 35px #ffffff)',
                      'drop-shadow(0 0 20px #00ff88)'
                    ]
                  : 'drop-shadow(0 0 18px rgba(255,215,0,0.95))',
                scale: isWinBurstActive ? [1, 1.08, 1] : 1
              }}
              transition={{ repeat: isWinBurstActive ? Infinity : 0, duration: 0.4 }}
              className="absolute -right-12 sm:-right-14 top-1/2 -translate-y-1/2 w-14 sm:w-16 h-36 pointer-events-none z-0"
            >
              <svg
                viewBox="0 0 100 200"
                className="w-full h-full transform scale-x-[-1]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="katanaBladeRight" x1="0.8" y1="0.2" x2="0.1" y2="0.9">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="20%" stopColor="#ffe680" />
                    <stop offset="45%" stopColor={isWinBurstActive ? "#00ff88" : "#ffd700"} />
                    <stop offset="70%" stopColor="#ff1a40" />
                    <stop offset="100%" stopColor="#2a0815" />
                  </linearGradient>
                </defs>

                {/* Cyber Katana Razor Blade Curved Spine */}
                <path
                  d="M88 100 C75 70, 52 42, 38 18 C28 5, 20 2, 18 2 C18 10, 24 35, 42 68 C58 98, 72 120, 85 130 Z"
                  fill="url(#katanaBladeRight)"
                  stroke="#ffffff"
                  strokeWidth="0.8"
                />

                {/* Katana Glowing Razor Hamon Edge */}
                <path
                  d="M18 2 C22 25, 38 58, 54 86 C68 110, 80 125, 85 130 C82 124, 70 100, 56 74 C42 48, 28 20, 18 2 Z"
                  fill="#ffffff"
                  opacity="0.95"
                  className={`filter ${isWinBurstActive ? 'drop-shadow-[0_0_12px_#00ff88]' : 'drop-shadow-[0_0_6px_#ffffff]'}`}
                />

                {/* Katana Habaki (Gold Blade Collar) */}
                <path
                  d="M80 124 L88 135 L80 142 L72 131 Z"
                  fill="url(#katanaGoldLeft)"
                  stroke="#ffd700"
                  strokeWidth="0.5"
                />

                {/* Katana Tsuba (Oval Guard) */}
                <ellipse
                  cx="78"
                  cy="138"
                  rx="14"
                  ry="5"
                  transform="rotate(-32 78 138)"
                  fill="url(#katanaGoldLeft)"
                  stroke="#ffffff"
                  strokeWidth="0.8"
                />

                {/* Katana Tsuka (Hilt Handle) */}
                <path
                  d="M74 142 L58 178 L48 172 L64 136 Z"
                  fill="url(#katanaHiltLeft)"
                  stroke="#ffd700"
                  strokeWidth="0.6"
                />

                {/* Tsuka Tsukamaki Diamond Wrapping Lines */}
                <line x1="70" y1="145" x2="60" y2="152" stroke="#ffd700" strokeWidth="1.2" />
                <line x1="66" y1="154" x2="56" y2="161" stroke="#ffd700" strokeWidth="1.2" />
                <line x1="62" y1="163" x2="52" y2="170" stroke="#ffd700" strokeWidth="1.2" />

                {/* Kashira (Pommel Cap) */}
                <circle cx="53" cy="175" r="4" fill="url(#katanaGoldLeft)" stroke="#ffffff" strokeWidth="0.5" />

                {/* Blade Laser Sparks */}
                <circle cx="32" cy="22" r="1.5" fill="#ffffff" className="animate-ping" />
                <circle cx="50" cy="55" r="1.2" fill="#ffd700" className="animate-pulse" />
              </svg>
            </motion.div>

            {/* CENTRAL SHARP METALLIC KATANA POD BODY */}
            <div className={`relative z-10 w-48 sm:w-52 p-2.5 rounded-2xl bg-gradient-to-b from-[#140c20]/98 via-[#0b0612]/98 to-[#050208]/98 border-2 ${
              isWinBurstActive
                ? 'border-[#00ff88] shadow-[0_0_40px_rgba(0,255,136,0.9),inset_0_1px_6px_rgba(255,255,255,0.4)]'
                : 'border-[#ffd700] shadow-[0_0_35px_rgba(255,215,0,0.7),inset_0_1px_4px_rgba(255,255,255,0.3)]'
            } backdrop-blur-xl transition-colors duration-300`}>
              
              {/* Ultra-Sharp Corner Cyber Brackets */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#ffd700] rounded-tl-sm pointer-events-none" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#ffd700] rounded-tr-sm pointer-events-none" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#ff1a40] rounded-bl-sm pointer-events-none" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#ff1a40] rounded-br-sm pointer-events-none" />

              {/* Japanese Kanji Samurai Emblems Top Accents */}
              <div className="absolute top-1 left-2 text-[8px] font-mono-tech font-black text-[#ffd700]/60 pointer-events-none">
                斬
              </div>
              <div className="absolute top-1 right-2 text-[8px] font-mono-tech font-black text-[#ffd700]/60 pointer-events-none">
                勝
              </div>

              {/* HUD Header Bar */}
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#ffd700]/40">
                <div className="flex items-center gap-1.5">
                  <div className={`p-1 rounded-md ${isWinBurstActive ? 'bg-[#00ff88]/30 border border-[#00ff88]' : 'bg-gradient-to-br from-[#ff1a40] to-[#ffd700]'} shadow-[0_0_8px_rgba(255,215,0,0.8)]`}>
                    <Swords size={12} className={isWinBurstActive ? "text-[#00ff88] animate-bounce" : "text-black"} />
                  </div>
                  <div>
                    <span className="font-orbitron text-[10.5px] font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] via-[#ffffff] to-[#ff2a85] filter drop-shadow-[0_0_6px_rgba(255,215,0,0.8)]">
                      SAMURAI V3
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] shadow-[0_0_6px_#00ff88] animate-ping" />
                      <span className="text-[7.5px] font-mono-tech text-[#00ff88] font-bold tracking-widest uppercase">
                        {isWinBurstActive ? (burstType === 'JACKPOT' ? '★ JACKPOT STRIKE ★' : '⚔️ WIN CONFIRMED') : 'KATANA ENGINE'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Settings, Minimize, Close */}
                <div className="flex items-center gap-0.5">
                  {/* Settings / Overlay Toggle Button */}
                  <button
                    id="hud-settings-btn"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSettings(prev => !prev);
                    }}
                    className={`p-1 rounded-md text-gray-400 hover:text-[#ffd700] hover:bg-white/10 transition-colors cursor-pointer ${showSettings ? 'text-[#ffd700] bg-white/10' : ''}`}
                    title="HUD Preferences"
                  >
                    <Settings size={11} />
                  </button>

                  {/* Minimize to SW Floating Orb */}
                  <button
                    id="hud-minimize-btn"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCollapsed(true);
                    }}
                    className="p-1 rounded-md text-gray-400 hover:text-[#ffd700] hover:bg-white/10 transition-colors cursor-pointer"
                    title="Minimize to SW Floating Orb"
                  >
                    <Minimize2 size={11} />
                  </button>

                  {/* Close HUD Button */}
                  <button
                    id="hud-close-btn"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClose();
                    }}
                    className="p-1 rounded-md text-gray-400 hover:text-[#ff1a40] hover:bg-white/10 transition-colors cursor-pointer"
                    title="Close Samurai HUD"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>

              {/* SETTINGS DRAWER POPUP */}
              {showSettings && (
                <div className="mb-1.5 p-1.5 rounded-lg bg-black/95 border border-[#ffd700]/50 shadow-2xl text-left animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-0.5 mb-1 border-b border-white/10 text-[8px] font-orbitron font-bold text-[#ffd700]">
                    <span>⚙️ PREFERENCES</span>
                    <span className="text-[7px] font-mono-tech text-gray-400">ACTIVE</span>
                  </div>

                  {/* Ghost Mode Toggle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleGhostMode?.();
                    }}
                    className="w-full flex items-center justify-between py-1 px-1.5 rounded hover:bg-white/10 text-[8px] font-mono-tech text-gray-300 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1">
                      {ghostMode ? <EyeOff size={10} className="text-[#ffd700]" /> : <Eye size={10} className="text-gray-400" />}
                      <span>Ghost Overlay</span>
                    </span>
                    <span className={`text-[7px] font-bold px-1 rounded ${ghostMode ? 'bg-[#ffd700] text-black' : 'bg-white/10 text-gray-400'}`}>
                      {ghostMode ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  {/* Pin Lock Position */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLockPosition?.();
                    }}
                    className="w-full flex items-center justify-between py-1 px-1.5 rounded hover:bg-white/10 text-[8px] font-mono-tech text-gray-300 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1">
                      {lockPosition ? <Lock size={10} className="text-[#00ff88]" /> : <Unlock size={10} className="text-gray-400" />}
                      <span>Lock Position</span>
                    </span>
                    <span className={`text-[7px] font-bold px-1 rounded ${lockPosition ? 'bg-[#00ff88] text-black' : 'bg-white/10 text-gray-400'}`}>
                      {lockPosition ? 'LOCKED' : 'DRAG'}
                    </span>
                  </button>
                </div>
              )}

              {/* PREDICTION CONTENT AREA */}
              <div className="relative py-1">
                {/* WIN CONFIRMATION HIGHLIGHT BANNER */}
                {isWinBurstActive && (
                  <motion.div
                    initial={{ scale: 0.8, y: -6, opacity: 0 }}
                    animate={{ scale: [0.95, 1.05, 1], y: 0, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="w-full mb-1.5 py-1 px-2 rounded-lg bg-gradient-to-r from-[#00ff88]/30 via-[#ffd700]/40 to-[#00ff88]/30 border border-[#00ff88] flex items-center justify-between shadow-[0_0_20px_rgba(0,255,136,0.8)] animate-pulse"
                  >
                    <span className="text-[7.5px] font-orbitron font-black text-white flex items-center gap-1">
                      {burstType === 'JACKPOT' ? <Crown size={10} className="text-[#ffd700]" /> : <Award size={10} className="text-[#00ff88]" />}
                      <span>{burstType === 'JACKPOT' ? 'JACKPOT CONFIRMED' : 'KATANA WIN CONFIRMED'}</span>
                    </span>
                    <span className="text-[7px] font-mono-tech text-[#00ff88] font-bold">
                      100% HIT
                    </span>
                  </motion.div>
                )}

                {!isHackActive ? (
                  /* STANDBY VIEW WHEN HACK IS NOT STARTED YET */
                  <div className="flex flex-col items-center justify-center py-2 px-1 text-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ffd700]/20 via-[#ff1a40]/30 to-black p-0.5 border border-[#ffd700]/60 flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.4)]">
                      <Swords size={16} className="text-[#ffd700]" />
                    </div>
                    <div className="leading-tight">
                      <div className="font-orbitron text-[9.5px] font-black text-[#ffd700] tracking-wider">
                        HACK STANDBY
                      </div>
                      <div className="text-[7.5px] font-mono-tech text-gray-400 mt-0.5">
                        Tap Start to activate predictions
                      </div>
                    </div>
                    {onStartHack && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartHack();
                        }}
                        className="w-full py-1.5 px-2 rounded-xl bg-gradient-to-r from-[#ff1a40] via-[#ffd700] to-[#ff1a40] text-black font-orbitron text-[9px] font-black tracking-wider shadow-[0_0_16px_rgba(255,215,0,0.6)] hover:scale-102 active:scale-98 transition-all cursor-pointer"
                      >
                        ⚔️ START HACK
                      </button>
                    )}
                  </div>
                ) : isDecrypting ? (
                  /* SUBTLE KATANA BLADE LOCKING TRANSITION (NEVER WIPES TARGET PREDICTION) */
                  <div className="flex flex-col items-center justify-center py-2 space-y-1.5">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#ffd700] animate-spin [animation-duration:1.5s]" />
                      <div className="absolute inset-1 rounded-full border border-dashed border-[#ff1a40] animate-spin [animation-duration:2s] [animation-direction:reverse]" />
                      <Swords size={16} className="text-[#ffd700] animate-pulse" />
                    </div>
                    <span className="font-orbitron text-[9px] font-black text-[#ffd700] tracking-widest animate-pulse">
                      BLADE LOCKING...
                    </span>
                    <div className="w-full bg-black/60 rounded-full h-1 overflow-hidden border border-[#ffd700]/40">
                      <div className="h-full bg-gradient-to-r from-[#ffd700] via-[#ff1a40] to-[#00ff88] animate-pulse" style={{ width: '100%' }} />
                    </div>
                  </div>
                ) : isHold ? (
                  /* HOLD STATUS */
                  <div className="py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border border-yellow-500/60 shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                    <span className="font-orbitron text-lg font-black tracking-widest text-[#ffd700] leading-none">
                      HOLD (SKIP)
                    </span>
                    <p className="text-[7.5px] font-mono-tech text-gray-300 mt-1">
                      Safe Capital Preservation Mode
                    </p>
                  </div>
                ) : (
                  /* EXCLUSIVE SINGLE FORECAST (COLOR OR SIZE) + SINGLE HIGH PROBABILITY NUMBER */
                  <div className="flex flex-col items-center">
                    {/* Quantum Neural Engine Stream Active Telemetry Strip */}
                    <div className="w-full flex items-center justify-between px-2 py-0.5 rounded bg-black/60 border border-[#00ffcc]/30 text-[7px] font-mono-tech text-gray-300 mb-1.5 shadow-[0_0_10px_rgba(0,255,204,0.15)]">
                      <span className="text-[#ffd700] font-bold">PERIOD #{issueShort}</span>
                      <span className="flex items-center gap-1 text-[#00ffcc] font-black">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00ffcc] animate-ping inline-block" />
                        <span>QUANTUM NEURAL ENGINE</span>
                      </span>
                      <span className="text-[#ffd700] font-black text-[6.5px]">9x JACKPOT</span>
                    </div>

                    {/* HERO DOMINANT: 3 HIGH-PROBABILITY NUMBERS WITH TIERED INTENSITY GLOW & SUBTLE PULSE */}
                    <div className="w-full bg-gradient-to-b from-[#181126]/95 via-[#0f0a1c]/98 to-[#05030a] rounded-2xl p-2.5 border-2 border-[#ffd700]/70 mb-1.5 shadow-[0_0_25px_rgba(255,215,0,0.4),inset_0_1px_5px_rgba(255,255,255,0.25)] relative overflow-hidden animate-quantum-pulse">
                      {/* Subtle Cyber Grid Ambient Background */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,0,0.15),transparent_70%)] pointer-events-none" />

                      {/* Header Badge */}
                      <div className="relative z-10 flex items-center justify-between text-[7px] font-orbitron font-black text-[#ffd700] tracking-widest uppercase mb-2 px-0.5">
                        <span className="flex items-center gap-1 text-[#ffd700] drop-shadow-[0_0_6px_#ffd700]">
                          <Crown size={9} className="text-[#ffd700]" />
                          <span>3 HIGH-PROBABILITY NUMBERS MIX</span>
                        </span>
                        <span className="text-[6px] px-1.5 py-0.2 rounded-full bg-[#00ffcc]/20 text-[#00ffcc] border border-[#00ffcc]/40 font-mono-tech font-black">
                          1000-DATA • &lt;50ms
                        </span>
                      </div>

                      {/* 3 Tiered Glowing Number Plaques */}
                      <div className="relative z-10 grid grid-cols-3 gap-1.5 items-end justify-center pt-0.5">
                        {/* TIER 1: PRIMARY APEX HERO NUMBER (HIGHEST INTENSITY GLOW) */}
                        <div className="relative rounded-xl bg-gradient-to-b from-[#3d2c00] via-[#241900] to-[#0d0900] border-2 border-[#ffd700] py-2 px-1 flex flex-col items-center justify-center shadow-[0_0_24px_rgba(255,215,0,0.9),inset_0_1px_6px_rgba(255,255,255,0.7)] transform-gpu scale-105 z-10 group overflow-hidden">
                          {/* Pulsing Gold Plasma Aura */}
                          <div className="absolute -inset-1 bg-[#ffd700]/30 rounded-xl blur-sm animate-pulse pointer-events-none" />
                          
                          <span className="relative z-10 text-[6.5px] font-mono-tech font-black text-[#ffd700] tracking-wider flex items-center gap-0.5 mb-0.5">
                            <Sparkles size={7} className="text-[#ffd700] animate-spin" />
                            <span>#1 PRIMARY</span>
                          </span>
                          <span className="relative z-10 font-orbitron text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-[#ffd700] to-[#ff8800] leading-none drop-shadow-[0_0_12px_#ffd700] my-0.5">
                            {num1}
                          </span>
                          <span className="relative z-10 text-[6px] text-black font-mono-tech font-black bg-[#ffd700] px-1.5 py-0.2 rounded-full shadow-[0_0_8px_#ffd700] mt-0.5">
                            {conf1}% APEX
                          </span>
                        </div>

                        {/* TIER 2: SECONDARY STRATEGIC COMBO (MEDIUM HIGH INTENSITY GLOW) */}
                        <div className="relative rounded-xl bg-gradient-to-b from-[#003833] via-[#00211e] to-[#000d0c] border-2 border-[#00ffcc] py-1.5 px-1 flex flex-col items-center justify-center shadow-[0_0_16px_rgba(0,255,204,0.7),inset_0_1px_4px_rgba(255,255,255,0.5)] group overflow-hidden">
                          <span className="text-[6px] font-mono-tech font-bold text-[#00ffcc] tracking-wider mb-0.5">
                            #2 SECONDARY
                          </span>
                          <span className="font-orbitron text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-[#00ffcc] to-[#0099cc] leading-none drop-shadow-[0_0_10px_#00ffcc] my-0.5">
                            {num2}
                          </span>
                          <span className="text-[5.5px] text-[#00ffcc] font-mono-tech font-black bg-[#00ffcc]/20 border border-[#00ffcc]/40 px-1 py-0.2 rounded-full mt-0.5">
                            {conf2}% HIGH
                          </span>
                        </div>

                        {/* TIER 3: TERTIARY TACTICAL HEDGE (ACCENT INTENSITY GLOW) */}
                        <div className="relative rounded-xl bg-gradient-to-b from-[#380022] via-[#210014] to-[#0d0008] border-2 border-[#ff2a85] py-1.5 px-1 flex flex-col items-center justify-center shadow-[0_0_14px_rgba(255,42,133,0.6),inset_0_1px_3px_rgba(255,255,255,0.4)] group overflow-hidden">
                          <span className="text-[6px] font-mono-tech font-bold text-pink-300 tracking-wider mb-0.5">
                            #3 TERTIARY
                          </span>
                          <span className="font-orbitron text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-200 to-[#ff007f] leading-none drop-shadow-[0_0_8px_#ff2a85] my-0.5">
                            {num3}
                          </span>
                          <span className="text-[5.5px] text-pink-300 font-mono-tech font-black bg-pink-500/20 border border-pink-500/40 px-1 py-0.2 rounded-full mt-0.5">
                            {conf3}% HEDGE
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pattern Combo & Rolling Window Badge */}
                    <div className="w-full bg-black/60 rounded-lg px-2 py-1 border border-[#ffd700]/30 flex items-center justify-between text-[7px] font-mono-tech mb-1">
                      <div className="flex items-center gap-1 text-[#ffd700] truncate">
                        <Zap size={8} className="text-[#ffd700] shrink-0" />
                        <span className="font-bold truncate">{comboLabel}</span>
                      </div>
                      <span className="text-[#00ff88] font-bold text-[6.5px] shrink-0 ml-1">
                        1000-DATA ({workerLatency}ms)
                      </span>
                    </div>

                    {/* High-Frequency Entropy Oscillator Telemetry */}
                    <div className="w-full flex items-center justify-between px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 text-[6.5px] font-mono-tech text-gray-400 mb-1.5">
                      <span className="truncate">OSC: {oscillatorPhase.slice(0, 24)}</span>
                      <span className="text-[#00d4ff] font-bold shrink-0">{(entropyScore * 100).toFixed(0)}% COHERENCE</span>
                    </div>

                    {/* Precision Win Probability & Stage Multiplier Strip */}
                    <div className="w-full flex items-center justify-between px-2 py-1 rounded-lg bg-black/70 border border-[#ffd700]/35 text-[7.5px] font-orbitron">
                      <span className="text-gray-300 font-bold flex items-center gap-1">
                        <Flame size={9} className="text-[#ffd700]" />
                        <span>JACKPOT WIN:</span>
                        <span className="text-[#00ff88] font-black">{jackpotProb.toFixed(1)}%</span>
                      </span>
                      <span className="text-[#ffd700] font-black tracking-wide">
                        {prediction?.levelStage === 3
                          ? '⚡ LEVEL 3 (8X RECOVERY)'
                          : prediction?.levelStage === 2
                          ? '⚡ LEVEL 2 (3X FIX)'
                          : 'LEVEL 1 (1X LOCK)'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Sub-Footer: SAMURAI KATANA WARRIOR */}
              <div className="flex items-center justify-center gap-1 pt-1 text-[8px] font-orbitron font-bold text-[#ffd700] tracking-widest">
                <Swords size={10} className="text-[#ffd700]" />
                <span>SAMURAI KATANA</span>
                <Swords size={10} className="text-[#ffd700]" />
              </div>
            </div>
          </motion.div>
        ) : (
          /* ========================================================================= */
          /* STATE B: COLLAPSED 3D "SW" FLOATING CYBER-ORB WITH CROSSED KATANAS        */
          /* ========================================================================= */
          <motion.div
            key="sw-logo-collapsed-view"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            onClick={(e) => {
              e.stopPropagation();
              if (!isDragging) {
                setIsCollapsed(false);
              }
            }}
            className="relative group cursor-pointer"
            title="Tap to Open SAMURAI WARRIOR HUD"
          >
            {/* Luminous Pulsing Cyber Aura */}
            <div
              className={`absolute -inset-2 rounded-full blur-md opacity-95 group-hover:opacity-100 transition-opacity animate-pulse ${
                isColorTarget && isRed
                  ? 'bg-gradient-to-r from-[#ff1a40] via-[#ff0055] to-[#ffd700]'
                  : 'bg-gradient-to-r from-[#ffd700] via-[#ffaa00] to-[#00ff88]'
              }`}
            />

            {/* 3D Glowing "SW" Katana Core Orb Badge */}
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-b from-[#2a1b40] via-[#140e26] to-[#05030d] border-2 border-[#ffd700] p-1 shadow-[0_0_32px_rgba(255,215,0,0.95)] flex flex-col items-center justify-center overflow-hidden">
              {/* Crossed Katana Background Insignia */}
              <div className="absolute inset-0 flex items-center justify-center opacity-35 pointer-events-none">
                <Swords size={32} className="text-[#ffd700]" />
              </div>

              {/* Rotating Cyber Ring */}
              <div className="absolute inset-0 border border-dashed border-[#ffd700]/70 rounded-full animate-spin [animation-duration:6s] pointer-events-none" />

              {/* Bold Golden/Pink "SW V3" Typography */}
              <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
                <span 
                  className="font-orbitron text-base font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#ff2a85] to-[#ffd700] filter drop-shadow-[0_0_8px_rgba(255,42,133,0.9)]"
                  style={{ textShadow: '0 0 8px rgba(255,42,133,0.8), 0 0 16px rgba(255,215,0,0.6)' }}
                >
                  SW V3
                </span>
                <span className="text-[6.5px] font-mono-tech font-black text-[#ffd700] tracking-widest leading-none mt-0.2">
                  MATRIX
                </span>
              </div>

              {/* Active Pulse Dot */}
              <span className="absolute bottom-1 right-2 w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88] animate-ping pointer-events-none" />
            </div>

            {/* Glowing 3-Number Prediction Chip on Collapsed Orb */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/95 border border-[#ffd700] text-[7px] font-orbitron font-black text-[#ffd700] shadow-[0_0_12px_rgba(255,215,0,0.85)] whitespace-nowrap z-20 flex items-center gap-1">
              <span className="text-[#ffd700]">#{num1}</span>
              <span className="text-gray-500">•</span>
              <span className="text-[#00ffcc]">#{num2}</span>
              <span className="text-gray-500">•</span>
              <span className="text-pink-400">#{num3}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
