import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Shield, Cpu, Zap, Activity, Radio, Lock, Sparkles, CheckCircle } from 'lucide-react';

interface HackerDecryptionOverlayProps {
  isDecrypting: boolean;
  decryptProgress: number;
  stageName?: string;
  targetIssue?: string;
  mode?: string;
  shuffleNumbers?: string;
  shuffleText?: string;
  onDecryptionComplete?: () => void;
}

export const HackerDecryptionOverlay: React.FC<HackerDecryptionOverlayProps> = ({
  isDecrypting,
  decryptProgress,
  targetIssue = '----',
  mode = '30s',
  shuffleNumbers = '7 , 9',
  shuffleText = 'SAMURAI',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<Array<{ id: number; text: string; color: string }>>([]);

  // Quantum Phase Calculation based on 0-100 progress (4.0s)
  // Phase 1 (0-25%): 100-Round Historical Deep Sequence Ingestion
  // Phase 2 (25-50%): Quantum Dragon & Mirror Pattern Topology Scan
  // Phase 3 (50-75%): Multi-LLM Smart Money & Anti-Trap Volatility Lock
  // Phase 4 (75-100%): Super Consensus Convergence & Level Protection Matrix Lock
  const getPhaseInfo = (prog: number) => {
    if (prog < 25) {
      return {
        step: 1,
        title: 'HISTORICAL INGESTION (100 ROUNDS)',
        sub: 'INGESTING N-GRAM MARKOV & HISTORICAL DISTRIBUTIONS...',
        color: '#00ffcc',
        icon: Terminal,
      };
    } else if (prog < 50) {
      return {
        step: 2,
        title: 'TOPOLOGY PATTERN SCAN',
        sub: 'CROSS-MATCHING DRAGON, 1-1 CHOP & 2-2 MIRROR VECTORS...',
        color: '#ffd700',
        icon: Cpu,
      };
    } else if (prog < 75) {
      return {
        step: 3,
        title: 'AI LLM ENSEMBLE CONSENSUS',
        sub: 'CONSULTING GEMINI 2.5, GROQ LLAMA-3.3 70B & HF MODELS...',
        color: '#ff1a40',
        icon: Radio,
      };
    } else {
      return {
        step: 4,
        title: 'ANTI-TRAP MATRIX LOCK',
        sub: 'CALIBRATING HIGHEST WIN PROBABILITY & 5-STAGE MULTIPLIER...',
        color: '#00ff88',
        icon: Shield,
      };
    }
  };

  const phase = getPhaseInfo(decryptProgress);

  // Dynamic hacker log stream
  useEffect(() => {
    if (!isDecrypting) {
      setTerminalLogs([]);
      return;
    }

    const logPool = [
      { text: `[CORE] INGESTING 100 HISTORICAL DRAWS (#${targetIssue.slice(-4) || 'LIVE'})...`, color: '#00ffcc' },
      { text: `[MARKOV] CALCULATING 2ND ORDER TRANSITION DENSITY...`, color: '#a78bfa' },
      { text: `[FIBONACCI] RECURSIVE MOMENTUM OSCILLATOR ALIGNED.`, color: '#ffd700' },
      { text: `[VOLATILITY] ANTI-TRAP SHIELD SCANNING CHOP ANOMALIES...`, color: '#ff4d6d' },
      { text: `[GEMINI 2.5] DEEP NEURAL WIN-RATE AUDIT ACTIVE.`, color: '#00ff88' },
      { text: `[GROQ CLOUD] HIGH-FREQUENCY 70B ENSEMBLE SYNCHRONIZED.`, color: '#ffd700' },
      { text: `[LIQUIDITY] SMART MONEY POOL DIVERGENCE COMPUTED.`, color: '#00ffcc' },
      { text: `[MATRIX LOCK] HARMONIC CONVERGENCE AT 98.4% CONFIDENCE.`, color: '#00ff88' },
    ];

    const interval = setInterval(() => {
      const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
      setTerminalLogs(prev => [
        ...prev.slice(-3),
        { id: Date.now() + Math.random(), text: randomLog.text, color: randomLog.color }
      ]);
    }, 450);

    return () => clearInterval(interval);
  }, [isDecrypting, targetIssue]);

  // Matrix Rain & Laser Grid Canvas Effect
  useEffect(() => {
    if (!isDecrypting) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 320;
    canvas.height = canvas.parentElement?.clientHeight || 240;

    const katakana = '01234567890ABCDEFЖЗИЙКЛMNPRSTUVWXYZ';
    const fontSize = 11;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    let animationId: number;

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 7, 14, 0.22)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff88';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = katakana.charAt(Math.floor(Math.random() * katakana.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Leading bright cyan/gold head
        if (Math.random() > 0.85) {
          ctx.fillStyle = '#ffd700';
        } else if (Math.random() > 0.5) {
          ctx.fillStyle = '#00ffcc';
        } else {
          ctx.fillStyle = '#ff1a40';
        }

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isDecrypting]);

  if (!isDecrypting) return null;

  return (
    <div 
      id="samurai-hacker-decryption-core"
      className="relative overflow-hidden rounded-2xl border-2 border-[#00ffcc]/70 bg-[#060813]/95 p-4 shadow-[0_0_35px_rgba(0,255,204,0.35)] backdrop-blur-2xl my-3 text-left"
    >
      {/* Background Matrix Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
      />

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#00ffcc_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

      {/* Glowing Neon Cyber Scanline */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#00ffcc] to-transparent animate-pulse" />

      {/* Header Bar */}
      <div className="relative z-10 flex items-center justify-between pb-2 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] animate-ping" />
          <span className="font-orbitron text-xs font-black tracking-widest text-[#00ffcc] flex items-center gap-1.5">
            <Zap size={13} className="text-[#ffd700] animate-bounce" />
            SAMURAI HACKER DECRYPTOR 4.0
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono-tech text-[10px] text-[#ffd700] bg-[#ffd700]/15 px-2 py-0.5 rounded border border-[#ffd700]/40 font-bold">
            STAGE {phase.step}/4
          </span>
          <span className="font-orbitron text-xs font-black text-[#00ff88]">
            {decryptProgress.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Main Tactical Visualizer */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
        {/* Left: Random Shuffle Word Box */}
        <div className="bg-black/60 p-2.5 rounded-xl border border-[#ff1a40]/40 text-center">
          <div className="text-[8px] font-mono-tech text-gray-400">CIPHER BYTE STREAM</div>
          <div className="font-orbitron text-base font-black text-[#ff4d6d] tracking-widest my-0.5 drop-shadow-[0_0_10px_#ff1a40]">
            [ {shuffleText} ]
          </div>
          <div className="text-[7px] font-mono-tech text-[#00ffcc]">256-BIT QUANTUM HASH</div>
        </div>

        {/* Center: Active Phase Banner */}
        <div className="bg-black/70 p-2.5 rounded-xl border border-[#ffd700]/50 text-center flex flex-col justify-center">
          <div className="text-[8px] font-mono-tech text-[#ffd700] font-bold tracking-wider">
            {phase.title}
          </div>
          <div className="font-mono-tech text-[9px] text-gray-200 mt-0.5 leading-tight truncate">
            {phase.sub}
          </div>
        </div>

        {/* Right: Target Range Decrypt */}
        <div className="bg-black/60 p-2.5 rounded-xl border border-[#00ff88]/40 text-center">
          <div className="text-[8px] font-mono-tech text-gray-400">RESONANCE TARGETS</div>
          <div className="font-orbitron text-base font-black text-[#00ff88] tracking-wider my-0.5 drop-shadow-[0_0_10px_#00ff88]">
            [ {shuffleNumbers} ]
          </div>
          <div className="text-[7px] font-mono-tech text-[#ffd700]">HIGH ACCURACY SEED</div>
        </div>
      </div>

      {/* 4-Phase Step Progress Visualizer */}
      <div className="relative z-10 mb-3">
        <div className="grid grid-cols-4 gap-1 mb-1.5 text-[8px] font-mono-tech text-center">
          <span className={decryptProgress >= 25 ? 'text-[#00ffcc] font-bold' : 'text-gray-500'}>1. 100-HIST INGEST</span>
          <span className={decryptProgress >= 50 ? 'text-[#ffd700] font-bold' : 'text-gray-500'}>2. TOPOLOGY SCAN</span>
          <span className={decryptProgress >= 75 ? 'text-[#ff4d6d] font-bold' : 'text-gray-500'}>3. MULTI-LLM AI</span>
          <span className={decryptProgress >= 95 ? 'text-[#00ff88] font-bold' : 'text-gray-500'}>4. ANTI-TRAP LOCK</span>
        </div>

        {/* Multi-Segment High Precision Progress Bar */}
        <div className="relative w-full h-2.5 bg-black/80 rounded-full overflow-hidden p-0.5 border border-white/20">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-[#00ffcc] via-[#ffd700] via-[#ff1a40] to-[#00ff88] transition-all duration-75 ease-linear shadow-[0_0_18px_#00ff88]"
            style={{ width: `${decryptProgress}%` }}
          />
          {/* Phase divider lines */}
          <div className="absolute top-0 bottom-0 left-1/4 w-[1px] bg-white/40" />
          <div className="absolute top-0 bottom-0 left-2/4 w-[1px] bg-white/40" />
          <div className="absolute top-0 bottom-0 left-3/4 w-[1px] bg-white/40" />
        </div>
      </div>

      {/* Terminal Telemetry Log Console */}
      <div className="relative z-10 bg-black/85 p-2 rounded-xl border border-white/10 font-mono-tech text-[9px] space-y-1">
        <div className="flex items-center justify-between text-[8px] text-gray-400 pb-1 border-b border-white/10">
          <span className="flex items-center gap-1">
            <Terminal size={10} className="text-[#00ffcc]" />
            <span>NEURAL MATRIX TELEMETRY (REAL-TIME STREAM)</span>
          </span>
          <span className="text-[#00ff88]">CONNECTED 4.0s</span>
        </div>
        {terminalLogs.map((log) => (
          <div key={log.id} className="flex items-center gap-1.5 truncate" style={{ color: log.color }}>
            <span className="text-gray-500">{'>'}</span>
            <span className="truncate">{log.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
