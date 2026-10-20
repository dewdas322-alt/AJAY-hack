import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

interface FloatingDraggableLogoProps {
  onClick: () => void;
  isOpen: boolean;
  confidence?: number;
  currentPredictionText?: string;
  isRed?: boolean;
  ghostMode?: boolean;
  lockPosition?: boolean;
}

export const FloatingDraggableLogo: React.FC<FloatingDraggableLogoProps> = ({
  onClick,
  isOpen,
  currentPredictionText = 'BIG 6',
  isRed = false,
  ghostMode = false,
  lockPosition = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // When HUD is open, hide the mini SW logo so they don't overlap,
  // or show when HUD is closed/minimized
  if (isOpen) {
    return null;
  }

  return (
    <motion.div
      drag={!lockPosition}
      dragMomentum={false}
      dragElastic={0.05}
      initial={{ 
        x: typeof window !== 'undefined' ? Math.max(10, window.innerWidth - 85) : 260, 
        y: typeof window !== 'undefined' ? Math.max(80, window.innerHeight - 200) : 400 
      }}
      onDragStart={(_e, info) => {
        setIsDragging(true);
        dragStartPosRef.current = { x: info.point.x, y: info.point.y };
      }}
      onDragEnd={(_e, info) => {
        const dx = Math.abs(info.point.x - dragStartPosRef.current.x);
        const dy = Math.abs(info.point.y - dragStartPosRef.current.y);
        // Only consider it a drag if moved more than 6px
        if (dx > 6 || dy > 6) {
          setTimeout(() => setIsDragging(false), 120);
        } else {
          setIsDragging(false);
        }
      }}
      className={`fixed z-50 select-none touch-none ${
        lockPosition ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
      } ${
        ghostMode ? 'opacity-35 hover:opacity-100 transition-opacity duration-300' : 'opacity-100'
      }`}
      style={{ touchAction: 'none' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
    >
      <div
        id="floating-sw-logo-badge"
        onClick={(e) => {
          e.stopPropagation();
          if (!isDragging) {
            onClick();
          }
        }}
        className="relative group cursor-pointer"
        title="Tap to Open Prediction HUD"
      >
        {/* Pulsing Luminous Cyber Aura */}
        <div
          className={`absolute -inset-2 rounded-full blur-md opacity-85 group-hover:opacity-100 transition-opacity animate-pulse ${
            isRed
              ? 'bg-gradient-to-r from-[#ff1a40] via-[#ff0055] to-[#ffd700]'
              : 'bg-gradient-to-r from-[#ffd700] via-[#ffaa00] to-[#00ff88]'
          }`}
        />

        {/* Small Glowing "SW" Dragon Core Emblem */}
        <div className="relative w-15 h-15 rounded-full bg-gradient-to-b from-[#1f1a2e] via-[#100c1c] to-[#06040a] border-2 border-[#ffd700] p-1 shadow-[0_0_30px_rgba(255,215,0,0.7)] flex flex-col items-center justify-center overflow-hidden">
          {/* Animated Dashed Cyber Ring */}
          <div className="absolute inset-0 border border-dashed border-[#ffd700]/50 rounded-full animate-spin [animation-duration:10s] pointer-events-none" />

          {/* Golden "SW" Bold Typography */}
          <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
            <span 
              className="font-orbitron text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#ffd700] to-[#ff9900] filter drop-shadow-[0_0_8px_rgba(255,215,0,0.9)]"
              style={{ textShadow: '0 0 10px rgba(255,215,0,0.8), 0 0 20px rgba(255,165,0,0.5)' }}
            >
              SW
            </span>
            <span className="text-[7px] font-mono-tech font-bold text-[#ffd700]/90 tracking-widest leading-none mt-0.5">
              HACK
            </span>
          </div>

          {/* Active Status Pulse Dot */}
          <span className="absolute bottom-1 right-2.5 w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_6px_#00ff88] animate-ping pointer-events-none" />
        </div>

        {/* Quick Micro Live Prediction Pill */}
        <div className="absolute -top-2.5 -right-2 px-2 py-0.5 rounded-full bg-black/95 border border-[#ffd700] text-[9px] font-mono-tech font-black text-[#ffd700] shadow-[0_0_12px_rgba(255,215,0,0.7)] whitespace-nowrap pointer-events-none">
          {currentPredictionText}
        </div>
      </div>
    </motion.div>
  );
};
