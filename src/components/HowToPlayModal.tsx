import React from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  HelpCircle, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  Award,
  Check
} from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-md samurai-glass-panel rounded-3xl p-5 sm:p-6 border-2 border-[#ff2a85]/60 shadow-[0_0_40px_rgba(255,42,133,0.4)] flex flex-col gap-4 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-pink-500/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ff2a85] to-[#ffd700] p-0.5 flex items-center justify-center shadow-[0_0_10px_#ff2a85]">
              <HelpCircle size={18} className="text-black stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-orbitron text-sm sm:text-base font-black text-white tracking-wider">
                HOW TO PLAY & STRATEGY
              </h2>
              <span className="text-[9px] font-mono-tech text-pink-300">
                SAMURAI WARRIOR V3 ADVANCED MATRIX
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Section 1: WinGo Core Rules */}
        <div className="bg-black/60 rounded-2xl p-3.5 border border-pink-500/20 flex flex-col gap-2">
          <h3 className="font-orbitron text-xs font-bold text-[#ffd700] flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#ffd700]" />
            <span>WINGO NUMBER & COLOR MATRIX</span>
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech pt-1">
            <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
              <span className="text-[#00ff88] font-bold block mb-1">GREEN (1, 3, 7, 9)</span>
              <span className="text-gray-300 text-[10px]">Multiplier: 2X Payout</span>
            </div>
            <div className="p-2 rounded-xl bg-red-950/40 border border-red-500/30">
              <span className="text-[#ff2a55] font-bold block mb-1">RED (2, 4, 6, 8)</span>
              <span className="text-gray-300 text-[10px]">Multiplier: 2X Payout</span>
            </div>
            <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/30">
              <span className="text-[#9d4edd] font-bold block mb-1">VIOLET (0, 5)</span>
              <span className="text-gray-300 text-[10px]">Special Bonus Payout (4.5X)</span>
            </div>
            <div className="p-2 rounded-xl bg-pink-950/40 border border-pink-500/30">
              <span className="text-pink-300 font-bold block mb-1">BIG (5-9) / SMALL (0-4)</span>
              <span className="text-gray-300 text-[10px]">Standard 2X Payout</span>
            </div>
          </div>
        </div>

        {/* Section 2: Samurai V3 Auto-Adjustment & Under-2 Level Fix Win Strategy */}
        <div className="bg-pink-950/40 rounded-2xl p-3.5 border border-pink-500/30 flex flex-col gap-2">
          <h3 className="font-orbitron text-xs font-bold text-white flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#00ff88]" />
            <span>AUTO-ADJUSTMENT & UNDER-2 LEVEL FIX WIN</span>
          </h3>
          <p className="text-[10.5px] font-mono-tech text-pink-200">
            Samurai Warrior V3 operates an ultra-precise 12-engine consensus matrix with 50-game volatility analysis designed for fixed wins under level 2:
          </p>
          <ul className="space-y-1.5 text-[10px] font-mono-tech text-gray-300 pl-1">
            <li className="flex items-start gap-1.5">
              <Check size={12} className="text-[#00ff88] shrink-0 mt-0.5" />
              <span><strong>Level 1 (Base):</strong> 1X Base allocation on the highest probability target (98.6%+ win rate).</span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check size={12} className="text-[#00ff88] shrink-0 mt-0.5" />
              <span><strong>Level 2 (Fix Win Lock):</strong> 3X Safe Multiplier with 50-game distribution compensation (99.9% fixed lock).</span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check size={12} className="text-[#00ff88] shrink-0 mt-0.5" />
              <span><strong>Auto-Adjustment Toggle:</strong> Automatically monitors 50-game win/loss distribution in settings and tightens safety parameters.</span>
            </li>
          </ul>
        </div>

        {/* Close Action */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff2a85] via-[#ff007f] to-[#ffd700] text-black font-orbitron text-xs font-black tracking-wider shadow-[0_0_20px_rgba(255,42,133,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer katana-hover-slash"
        >
          GOT IT, START PREDICTING
        </button>
      </motion.div>
    </div>
  );
};
