import React, { useEffect, useState } from 'react';
import { SamuraiToast, SamuraiToastType } from '../types';
import { 
  Sword, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  X, 
  Flame,
  ShieldAlert
} from 'lucide-react';

interface SamuraiToastContainerProps {
  toasts: SamuraiToast[];
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<{ toast: SamuraiToast; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  const duration = toast.duration || 4500;
  const [progress, setProgress] = useState<number>(100);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onDismiss(toast.id);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [toast.id, duration, onDismiss]);

  const getToastIcon = (type: SamuraiToastType) => {
    switch (type) {
      case 'jackpot':
        return <Sparkles className="text-[#ffd700] shrink-0 animate-pulse" size={20} />;
      case 'win':
        return <CheckCircle2 className="text-[#00ff88] shrink-0" size={20} />;
      case 'loss':
        return <ShieldAlert className="text-[#ff1a40] shrink-0" size={20} />;
      case 'market_ready':
        return <TrendingUp className="text-[#ff1a40] shrink-0" size={20} />;
      case 'pattern_detected':
        return <Sword className="text-[#ff4d6d] shrink-0" size={20} />;
      default:
        return <Zap className="text-[#ffd700] shrink-0" size={20} />;
    }
  };

  const getToastStyleClass = (type: SamuraiToastType) => {
    switch (type) {
      case 'jackpot':
        return 'samurai-toast-jackpot';
      case 'win':
        return 'samurai-toast-win';
      case 'loss':
        return 'samurai-toast-loss';
      case 'market_ready':
        return 'samurai-toast-market';
      case 'pattern_detected':
        return 'samurai-toast-pattern';
      default:
        return 'samurai-toast-market';
    }
  };

  const getProgressColor = (type: SamuraiToastType) => {
    switch (type) {
      case 'jackpot':
        return 'bg-gradient-to-r from-[#ffd700] via-[#ff1a40] to-[#ffd700]';
      case 'win':
        return 'bg-gradient-to-r from-[#00ff88] via-[#ffd700] to-[#00ff88]';
      case 'loss':
        return 'bg-gradient-to-r from-[#ff1a40] via-[#800f2f] to-[#ff4d6d]';
      case 'market_ready':
        return 'bg-gradient-to-r from-[#ff1a40] via-[#d90429] to-[#ffd700]';
      case 'pattern_detected':
        return 'bg-gradient-to-r from-[#ff4d6d] to-[#ff1a40]';
      default:
        return 'bg-gradient-to-r from-[#ff1a40] to-[#ffd700]';
    }
  };

  return (
    <div
      id={`samurai-toast-${toast.id}`}
      className={`samurai-toast-enter relative overflow-hidden rounded-2xl p-3.5 sm:p-4 backdrop-blur-2xl shadow-2xl transition-all duration-300 pointer-events-auto ${getToastStyleClass(
        toast.type
      )}`}
    >
      {/* Katana Slash Hologram Shine */}
      <div className="samurai-toast-slash-shine" />

      {/* Main Toast Content */}
      <div className="flex items-start gap-3 relative z-10">
        <div className="p-2 rounded-xl bg-black/50 border border-white/15 shadow-inner">
          {getToastIcon(toast.type)}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          {/* Header Row with Badge */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5">
              <span className="font-orbitron font-black text-xs sm:text-sm tracking-wider text-white">
                {toast.title}
              </span>
            </div>
            {toast.badge && (
              <span className="font-orbitron text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/60 border border-[#ffd700]/50 text-[#ffd700] shadow-[0_0_8px_rgba(255,215,0,0.3)] shrink-0">
                {toast.badge}
              </span>
            )}
          </div>

          {/* Message */}
          <p className="text-xs sm:text-[13px] font-mono-tech text-gray-200 leading-relaxed font-semibold">
            {toast.message}
          </p>

          {/* Optional Detail */}
          {toast.detail && (
            <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono-tech text-gray-300">
              <span className="text-[#ffd700] truncate max-w-[240px] font-bold">
                {toast.detail}
              </span>
              <span className="text-gray-400 text-[9px]">
                {new Date(toast.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => onDismiss(toast.id)}
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
          title="Dismiss Alert"
        >
          <X size={15} />
        </button>
      </div>

      {/* Bottom Shrinking Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60 overflow-hidden">
        <div
          className={`h-full transition-all duration-75 ease-linear ${getProgressColor(toast.type)}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function SamuraiToastContainer({ toasts, onDismiss }: SamuraiToastContainerProps) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      id="samurai-toast-container"
      className="fixed top-4 right-3 sm:right-6 z-[9999] w-full max-w-sm sm:max-w-md flex flex-col gap-2.5 pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
