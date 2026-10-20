import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  Cpu, 
  Sparkles, 
  ArrowRight,
  Terminal,
  Activity,
  Swords
} from 'lucide-react';

interface WelcomeScreenProps {
  userName: string;
  onUpdateUserName?: (name: string) => void;
  onEnter?: () => void;
  onEnterApp?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  userName,
  onUpdateUserName,
  onEnter,
  onEnterApp,
}) => {
  const [progress, setProgress] = useState<number>(16);
  const [statusText, setStatusText] = useState<string>('INITIALIZING VIP SERVER NODE...');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setStatusText('VIP NODE READY • SYSTEM CONNECTED');
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 18) + 8;
        if (next > 40 && next < 70) {
          setStatusText('CONNECTING QUANTUM NEURAL MATRIX...');
        } else if (next >= 70 && next < 95) {
          setStatusText('SYNCING LIVE WINGO 30S & 1M DATA FEED...');
        } else if (next >= 95) {
          setStatusText('VIP NODE READY • SYSTEM CONNECTED');
        }
        return Math.min(next, 100);
      });
    }, 280);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onEnterApp) {
      onEnterApp();
    } else if (onEnter) {
      onEnter();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#070209]/95 backdrop-blur-xl overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md samurai-glass-panel rounded-3xl p-6 sm:p-8 border-2 border-[#ff2a85]/60 shadow-[0_0_45px_rgba(255,42,133,0.35)] relative overflow-hidden"
      >
        {/* Cyber Neon Pink Decorative Accents */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#ff2a85]/25 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#ffd700]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Top App Icon & Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#ff2a85] via-[#ff007f] to-[#590230] p-1 shadow-[0_0_30px_rgba(255,42,133,0.75)] flex items-center justify-center">
              <div className="w-full h-full rounded-xl bg-[#14041a] flex items-center justify-center border border-[#ff2a85]/50">
                <Swords size={38} className="text-[#ff2a85] animate-pulse" />
              </div>
            </div>
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#00ff88] border-2 border-[#070209] flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            </span>
          </div>

          <h1 className="font-orbitron text-2xl sm:text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ff2a85] to-[#ffd700] uppercase drop-shadow-[0_0_20px_rgba(255,42,133,0.8)]">
            SAMURAI WARRIOR V3
          </h1>
          <p className="text-xs font-mono-tech text-pink-300/80 tracking-widest mt-1 flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#ffd700]" />
            <span>V3.0 CYBER MATRIX SYSTEM</span>
            <Sparkles size={12} className="text-[#ffd700]" />
          </p>
        </div>

        {/* Node Initialization Progress Box */}
        <div className="bg-[#120317]/90 rounded-2xl p-4 border border-[#ff2a85]/35 mb-5 shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-mono-tech mb-2">
            <span className="text-gray-300 flex items-center gap-1.5">
              <Terminal size={12} className="text-[#ff2a85]" />
              <span className="truncate">{statusText}</span>
            </span>
            <span className="text-[#ffd700] font-orbitron font-bold shrink-0">{progress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-pink-500/20 mb-3">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#ff2a85] via-[#ff007f] to-[#ffd700] rounded-full shadow-[0_0_12px_#ff2a85]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          {/* Sub-Badges */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-pink-950/40 border border-pink-500/30 text-[10px] font-mono-tech text-pink-200">
              <Lock size={12} className="text-[#00ff88]" />
              <span>SECURE VIP NODE</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-pink-950/40 border border-pink-500/30 text-[10px] font-mono-tech text-[#ffd700]">
              <Cpu size={12} className="text-[#ffd700]" />
              <span>ACCURACY 99.8%</span>
            </div>
          </div>
        </div>

        {/* User Name Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-orbitron font-bold tracking-wider text-gray-300 mb-1.5">
              ENTER YOUR NAME
            </label>
            <input 
              type="text"
              value={userName}
              onChange={(e) => onUpdateUserName && onUpdateUserName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-4 py-3 rounded-xl bg-black/70 border border-[#ff2a85]/50 focus:border-[#ffd700] focus:ring-1 focus:ring-[#ffd700] text-white font-rajdhani text-sm font-semibold outline-none transition-all placeholder:text-gray-500 shadow-[0_0_15px_rgba(255,42,133,0.15)]"
            />
          </div>

          <button
            id="enter-system-btn"
            type="submit"
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#ff2a85] via-[#ff007f] to-[#ffd700] text-black font-orbitron text-sm font-black tracking-widest shadow-[0_0_30px_rgba(255,42,133,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer katana-hover-slash"
          >
            <Zap size={18} className="text-black fill-black animate-pulse" />
            <span>ENTER SYSTEM NOW</span>
            <ArrowRight size={18} className="text-black" />
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-5 text-center">
          <p className="text-[10px] font-mono-tech text-gray-400">
            ⚡ Direct Fast Access • No Email Password Required
          </p>
        </div>
      </motion.div>
    </div>
  );
};
