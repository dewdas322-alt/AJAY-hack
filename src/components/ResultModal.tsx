import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Crown, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  X, 
  ShieldCheck,
  Zap,
  ArrowRight,
  Flame,
  Timer
} from 'lucide-react';
import { PredictionHistoryItem } from '../types';

interface ResultModalProps {
  result: PredictionHistoryItem | null;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  result,
  onClose,
}) => {
  const [countdown, setCountdown] = useState<number>(3);
  const [progressPct, setProgressPct] = useState<number>(100);

  useEffect(() => {
    if (!result) return;

    setCountdown(3);
    setProgressPct(100);

    const startTime = Date.now();
    const duration = 3000; // 3 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingMs = Math.max(0, duration - elapsed);
      const remainingSec = Math.ceil(remainingMs / 1000);
      setCountdown(remainingSec);
      setProgressPct((remainingMs / duration) * 100);

      if (remainingMs <= 0) {
        clearInterval(interval);
        onClose();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [result, onClose]);

  if (!result) return null;

  const isWin = result.status === 'WIN' || result.status === 'JACKPOT';
  const isJackpot = result.status === 'JACKPOT';

  const getBall3dClass = (num: number) => {
    if (num === 0) return 'ball-3d-zero';
    if (num === 5) return 'ball-3d-five';
    if ([1, 3, 7, 9].includes(num)) return 'ball-3d-green';
    return 'ball-3d-red';
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
        className={`w-full max-w-sm samurai-glass-crimson rounded-3xl p-5 border-2 ${
          isJackpot 
            ? 'border-[#ffd700] shadow-[0_0_50px_rgba(255,215,0,0.6)]' 
            : isWin 
            ? 'border-[#00ff88] shadow-[0_0_40px_rgba(0,255,136,0.4)]' 
            : 'border-[#ff2a85] shadow-[0_0_40px_rgba(255,42,133,0.35)]'
        } flex flex-col items-center text-center relative overflow-hidden`}
      >
        {/* Subtle background radial glow */}
        <div 
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 blur-3xl pointer-events-none rounded-full ${
            isJackpot ? 'bg-[#ffd700]/30' : isWin ? 'bg-[#00ff88]/25' : 'bg-[#ff2a85]/20'
          }`} 
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer z-20"
        >
          <X size={16} />
        </button>

        {/* Auto Dismiss Timer Chip */}
        <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/70 border border-pink-500/30 text-[9px] font-mono-tech text-pink-200 mb-2 z-10">
          <Timer size={11} className="text-[#ffd700] animate-spin [animation-duration:3s]" />
          <span>CLOSING IN {countdown}S</span>
        </div>

        {/* Dynamic WinGo Mode Banner Header */}
        <div className="mb-2 z-10">
          {result.mode === '30s' ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-amber-500/20 border border-amber-400/60 shadow-[0_0_15px_rgba(255,191,0,0.3)]">
              <Zap size={13} className="text-[#ffd700] fill-[#ffd700]" />
              <span className="font-orbitron text-xs font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] via-white to-[#ffaa00]">
                WIN GO 30 SECONDS
              </span>
              <span className="text-[8px] bg-black/80 text-amber-300 px-1.5 py-0.2 rounded font-mono-tech border border-amber-500/40">
                FAST 30S
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-500/20 via-pink-500/20 to-cyan-500/20 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,255,255,0.3)]">
              <Timer size={13} className="text-cyan-400" />
              <span className="font-orbitron text-xs font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-400">
                WIN GO 1 MINUTE
              </span>
              <span className="text-[8px] bg-black/80 text-cyan-300 px-1.5 py-0.2 rounded font-mono-tech border border-cyan-500/40">
                CLASSIC 1M
              </span>
            </div>
          )}
        </div>

        {/* Crown / Trophy Icon Box */}
        <div className={`w-16 h-16 rounded-2xl p-0.5 flex items-center justify-center mb-2 z-10 ${
          isJackpot 
            ? 'bg-gradient-to-br from-[#ffd700] via-[#ffaa00] to-[#ff007f] shadow-[0_0_30px_rgba(255,215,0,0.9)] animate-bounce' 
            : isWin 
            ? 'bg-gradient-to-br from-[#00ff88] via-[#00cc66] to-[#ffd700] shadow-[0_0_25px_rgba(0,255,136,0.8)]' 
            : 'bg-gradient-to-br from-[#ff2a85] via-[#ff007f] to-[#800f4f] shadow-[0_0_20px_rgba(255,42,133,0.6)]'
        }`}>
          <div className="w-full h-full rounded-[14px] bg-[#14041a] flex items-center justify-center border border-white/20">
            {isJackpot ? (
              <Sparkles size={32} className="text-[#ffd700] fill-[#ffd700]" />
            ) : (
              <Crown size={32} className={isWin ? 'text-[#00ff88] fill-[#00ff88]' : 'text-[#ff2a85]'} />
            )}
          </div>
        </div>

        {/* Win / Loss / Jackpot Title */}
        <h2 className={`font-orbitron text-2xl sm:text-3xl font-black tracking-widest uppercase z-10 ${
          isJackpot || isWin
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] via-white to-[#00ff88] drop-shadow-[0_0_20px_rgba(255,215,0,0.9)]'
            : 'text-[#ff2a55] drop-shadow-[0_0_15px_#ff2a55]'
        }`}>
          {isJackpot || isWin ? '★ JACKPOT WIN ★' : '- LOSS -'}
        </h2>

        <p className="text-[10px] font-mono-tech text-pink-200/90 flex items-center gap-1 mt-0.5 mb-3 z-10">
          <Sparkles size={11} className="text-[#ffd700]" />
          <span>QUANTUM NEURAL ENGINE (9x PAYOUT)</span>
          <Sparkles size={11} className="text-[#ffd700]" />
        </p>

        {/* Details Grid */}
        <div className="w-full bg-black/70 rounded-2xl p-3 border border-pink-500/30 flex flex-col gap-1.5 text-left text-xs font-mono-tech mb-3 z-10">
          <div className="flex items-center justify-between text-gray-300">
            <span>PERIOD:</span>
            <span className="text-[#ffd700] font-bold">#{result.issue}</span>
          </div>
          <div className="flex items-center justify-between text-gray-300">
            <span>MODE:</span>
            <span className="text-white font-bold px-2 py-0.5 rounded bg-pink-950/80 border border-pink-500/40">
              {result.mode === '30s' ? '⚡ Win Go 30 Seconds' : '⏱️ Win Go 1 Minute'}
            </span>
          </div>
          <div className="flex items-center justify-between text-gray-300">
            <span>JACKPOT STATUS:</span>
            <span className={`font-bold ${isJackpot || isWin ? 'text-[#ffd700]' : 'text-[#ff2a55]'}`}>
              {result.statusLabel || (isJackpot || isWin ? 'JACKPOT WIN (9x)' : 'LOSS')}
            </span>
          </div>
        </div>

        {/* Side-by-Side Comparison: PREDICTION vs ACTUAL */}
        <div className="w-full grid grid-cols-2 gap-2 mb-3 z-10">
          {/* Prediction Box */}
          <div className="bg-pink-950/70 rounded-2xl p-3 border border-pink-500/40 flex flex-col items-center text-center shadow-inner">
            <span className="text-[8.5px] font-mono-tech text-[#ffd700] font-bold">
              3-NUMBER JACKPOT LOCK
            </span>
            <div className="flex items-center gap-1 mt-2 flex-wrap justify-center">
              {(result.highProbNumbers || (result.predictedNumbers && result.predictedNumbers.length > 0 ? result.predictedNumbers : [result.sameSideNumber ?? 7])).map((num, i) => {
                const isHit = result.actualNum !== undefined && result.actualNum === num;
                return (
                  <span
                    key={i}
                    className={`text-[10px] font-mono-tech font-bold px-2 py-1 rounded-lg border ${
                      isHit
                        ? 'bg-[#ffd700] text-black border-white shadow-[0_0_15px_#ffd700] animate-bounce font-black scale-105'
                        : i === 0
                        ? 'bg-[#ffd700]/25 text-[#ffd700] border-[#ffd700]/50'
                        : i === 1
                        ? 'bg-[#00ffcc]/25 text-[#00ffcc] border-[#00ffcc]/50'
                        : 'bg-[#ff2a85]/25 text-pink-300 border-[#ff2a85]/50'
                    }`}
                  >
                    #{num}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Actual Box */}
          <div className="bg-black/80 rounded-2xl p-3 border border-pink-500/30 flex flex-col items-center text-center shadow-inner">
            <span className="text-[8.5px] font-mono-tech text-gray-400">DRAWN NUMBER</span>
            {result.actualNum !== undefined ? (
              <div className="flex flex-col items-center gap-1 mt-1.5">
                <div className={`w-8 h-8 rounded-full ${getBall3dClass(result.actualNum)} text-white font-orbitron font-black text-sm flex items-center justify-center shadow-lg`}>
                  {result.actualNum}
                </div>
                <span className="text-[9px] font-mono-tech text-[#ffd700] font-bold">
                  {isJackpot || isWin ? '★ 9x STRIKE' : 'MISSED'}
                </span>
              </div>
            ) : (
              <span className="text-gray-500 mt-2">-</span>
            )}
          </div>
        </div>

        {/* Manual Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff2a85] via-[#ff007f] to-[#ffd700] text-black font-orbitron text-xs font-black tracking-wider shadow-[0_0_20px_rgba(255,42,133,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer katana-hover-slash z-10"
        >
          CLOSE RESULT
        </button>

        {/* 3-Second Countdown Progress Bar Line at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#ffd700] via-[#ff2a85] to-[#00ff88] transition-all duration-75"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </motion.div>
    </div>
  );
};

