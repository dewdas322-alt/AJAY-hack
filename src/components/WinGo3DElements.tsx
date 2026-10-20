import React from 'react';

export type WinGoBallSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface WinGoBall3DProps {
  num: number;
  size?: WinGoBallSize;
  className?: string;
  showGlow?: boolean;
  animateSpin?: boolean;
}

export const WinGoBall3D: React.FC<WinGoBall3DProps> = ({
  num,
  size = 'md',
  className = '',
  showGlow = true,
  animateSpin = false,
}) => {
  // WinGo Color Rules:
  // 0: Red + Violet split
  // 5: Green + Violet split
  // 1, 3, 7, 9: Green
  // 2, 4, 6, 8: Red
  const isRedViolet = num === 0;
  const isGreenViolet = num === 5;
  const isGreen = num === 1 || num === 3 || num === 7 || num === 9;
  const isRed = num === 2 || num === 4 || num === 6 || num === 8;

  // Size dimensions
  const sizeClasses: Record<WinGoBallSize, { outer: string; text: string; gloss: string; ring: string }> = {
    xs: { outer: 'w-5 h-5', text: 'text-[10px] font-black', gloss: 'h-1.5 w-2', ring: 'ring-1' },
    sm: { outer: 'w-7 h-7', text: 'text-xs font-black', gloss: 'h-2 w-3', ring: 'ring-1' },
    md: { outer: 'w-9 h-9', text: 'text-sm font-black', gloss: 'h-2.5 w-4', ring: 'ring-[1.5px]' },
    lg: { outer: 'w-12 h-12', text: 'text-lg font-black', gloss: 'h-3.5 w-5', ring: 'ring-2' },
    xl: { outer: 'w-16 h-16', text: 'text-2xl font-black', gloss: 'h-4 w-7', ring: 'ring-2' },
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  // Determine Background 3D Radial Sphere
  let ballBgStyle: React.CSSProperties = {};
  let dropGlowStyle: React.CSSProperties = {};

  if (isRedViolet) {
    // 0: 3D Dual Split Ruby + Amethyst
    ballBgStyle = {
      background: 'linear-gradient(135deg, #d90429 0%, #e01e37 48%, #7209b7 52%, #560bad 100%)',
    };
    if (showGlow) {
      dropGlowStyle = {
        boxShadow: '0 4px 12px rgba(0,0,0,0.8), 0 0 15px rgba(217,4,41,0.5), 0 0 15px rgba(114,9,183,0.5), inset 0 2px 4px rgba(255,255,255,0.7), inset 0 -3px 5px rgba(0,0,0,0.6)',
      };
    }
  } else if (isGreenViolet) {
    // 5: 3D Dual Split Emerald + Amethyst
    ballBgStyle = {
      background: 'linear-gradient(135deg, #00c853 0%, #00e676 48%, #7209b7 52%, #560bad 100%)',
    };
    if (showGlow) {
      dropGlowStyle = {
        boxShadow: '0 4px 12px rgba(0,0,0,0.8), 0 0 15px rgba(0,200,83,0.5), 0 0 15px rgba(114,9,183,0.5), inset 0 2px 4px rgba(255,255,255,0.7), inset 0 -3px 5px rgba(0,0,0,0.6)',
      };
    }
  } else if (isGreen) {
    // 1, 3, 7, 9: 3D Glossy Emerald Green Sphere
    ballBgStyle = {
      background: 'radial-gradient(circle at 35% 28%, #69f0ae 0%, #00e676 25%, #00c853 50%, #00873a 80%, #004d20 100%)',
    };
    if (showGlow) {
      dropGlowStyle = {
        boxShadow: '0 5px 12px rgba(0,0,0,0.75), 0 0 16px rgba(0,230,118,0.55), inset 0 2px 4px rgba(255,255,255,0.85), inset 0 -3px 6px rgba(0,0,0,0.65)',
      };
    }
  } else {
    // 2, 4, 6, 8: 3D Glossy Crimson Ruby Sphere
    ballBgStyle = {
      background: 'radial-gradient(circle at 35% 28%, #ff6b81 0%, #ff1a40 25%, #d90429 50%, #900c28 80%, #4a0312 100%)',
    };
    if (showGlow) {
      dropGlowStyle = {
        boxShadow: '0 5px 12px rgba(0,0,0,0.75), 0 0 16px rgba(255,26,64,0.55), inset 0 2px 4px rgba(255,255,255,0.85), inset 0 -3px 6px rgba(0,0,0,0.65)',
      };
    }
  }

  return (
    <div
      className={`relative rounded-full flex items-center justify-center select-none font-orbitron text-white transform-gpu transition-all duration-300 ${
        currentSize.outer
      } ${animateSpin ? 'hover:scale-110 active:scale-95' : ''} ${className}`}
      style={{
        ...ballBgStyle,
        ...dropGlowStyle,
      }}
    >
      {/* 3D Specular Curved Gloss Highlight at top-left */}
      <span
        className={`absolute top-[10%] left-[16%] rounded-full bg-gradient-to-b from-white/90 via-white/40 to-transparent transform -rotate-25 pointer-events-none ${currentSize.gloss}`}
      />

      {/* Inner Metallic Edge Ring */}
      <span className="absolute inset-0 rounded-full border border-white/25 pointer-events-none" />

      {/* Crisp 3D Embossed Number */}
      <span
        className={`relative z-10 font-black tracking-tighter ${currentSize.text}`}
        style={{
          textShadow: '0 1px 2px rgba(0,0,0,0.9), 0 -0.5px 0.5px rgba(255,255,255,0.6)',
        }}
      >
        {num}
      </span>
    </div>
  );
};

/* -------------------------------------------------------------
   3D CASINO-GRADE SIZE PILL COMPONENT (BIG / SMALL / HOLD)
   ------------------------------------------------------------- */
interface WinGoSizePill3DProps {
  size: 'BIG' | 'SMALL' | 'HOLD' | string;
  variant?: 'sm' | 'md' | 'lg';
  className?: string;
  glow?: boolean;
}

export const WinGoSizePill3D: React.FC<WinGoSizePill3DProps> = ({
  size,
  variant = 'md',
  className = '',
  glow = true,
}) => {
  const isBig = size === 'BIG';
  const isHold = size === 'HOLD';

  const variantClasses = {
    sm: 'px-2 py-0.5 text-[9px]',
    md: 'px-3 py-1 text-[11px]',
    lg: 'px-4 py-1.5 text-xs font-black',
  }[variant];

  if (isHold) {
    return (
      <span
        className={`inline-flex items-center justify-center font-orbitron font-black uppercase tracking-wider rounded-full border border-[#00ffcc]/70 bg-gradient-to-b from-[#00ffff] via-[#00ccaa] to-[#006655] text-black transition-all ${variantClasses} ${className}`}
        style={
          glow
            ? {
                boxShadow:
                  '0 3px 8px rgba(0,0,0,0.7), 0 0 12px rgba(0,255,204,0.6), inset 0 1.5px 2px rgba(255,255,255,0.8), inset 0 -2px 3px rgba(0,0,0,0.5)',
              }
            : {}
        }
      >
        HOLD
      </span>
    );
  }

  if (isBig) {
    return (
      <span
        className={`inline-flex items-center justify-center font-orbitron font-black uppercase tracking-wider rounded-full border border-[#fff275] bg-gradient-to-b from-[#fff275] via-[#ffd700] to-[#b38600] text-[#1c1200] transition-all transform-gpu hover:brightness-110 ${variantClasses} ${className}`}
        style={
          glow
            ? {
                boxShadow:
                  '0 4px 10px rgba(0,0,0,0.7), 0 0 14px rgba(255,215,0,0.65), inset 0 2px 3px rgba(255,255,255,0.9), inset 0 -2px 4px rgba(0,0,0,0.6)',
                textShadow: '0 1px 0 rgba(255,255,255,0.5)',
              }
            : {}
        }
      >
        BIG
      </span>
    );
  }

  // SMALL: 3D Royal Crimson Ruby / Coral Pill
  return (
    <span
      className={`inline-flex items-center justify-center font-orbitron font-black uppercase tracking-wider rounded-full border border-[#ff85a1] bg-gradient-to-b from-[#ff85a1] via-[#ff1a40] to-[#99001f] text-white transition-all transform-gpu hover:brightness-110 ${variantClasses} ${className}`}
      style={
        glow
          ? {
              boxShadow:
                '0 4px 10px rgba(0,0,0,0.7), 0 0 14px rgba(255,26,64,0.65), inset 0 2px 3px rgba(255,255,255,0.85), inset 0 -2px 4px rgba(0,0,0,0.6)',
              textShadow: '0 1px 2px rgba(0,0,0,0.8)',
            }
          : {}
      }
    >
      SMALL
    </span>
  );
};

/* -------------------------------------------------------------
   3D REAL CASINO COLOR GEMSTONE & BADGE (GREEN / RED / VIOLET)
   ------------------------------------------------------------- */
interface WinGoColorBadge3DProps {
  color: 'GREEN' | 'RED' | 'GREEN-VIOLET' | 'RED-VIOLET' | 'VIOLET' | string;
  showText?: boolean;
  variant?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const WinGoColorBadge3D: React.FC<WinGoColorBadge3DProps> = ({
  color,
  showText = false,
  variant = 'md',
  className = '',
}) => {
  const isGreen = color === 'GREEN';
  const isRed = color === 'RED';
  const isGreenViolet = color === 'GREEN-VIOLET';
  const isRedViolet = color === 'RED-VIOLET';
  const isViolet = color === 'VIOLET';

  const dotSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[variant];

  // Pure GREEN
  if (isGreen) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <span
          className={`relative rounded-full shrink-0 border border-[#a7f3d0] ${dotSizes}`}
          style={{
            background: 'radial-gradient(circle at 35% 28%, #6ee7b7 0%, #10b981 35%, #059669 70%, #064e3b 100%)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.6), 0 0 10px rgba(16,185,129,0.7), inset 0 1.5px 2px rgba(255,255,255,0.8), inset 0 -1.5px 2px rgba(0,0,0,0.6)',
          }}
        >
          <span className="absolute top-[12%] left-[16%] w-2 h-1 rounded-full bg-white/80 transform -rotate-25 pointer-events-none" />
        </span>
        {showText && (
          <span
            className="font-orbitron text-[10px] font-black text-[#10b981] tracking-wider"
            style={{ textShadow: '0 0 8px rgba(16,185,129,0.8)' }}
          >
            GREEN
          </span>
        )}
      </div>
    );
  }

  // Pure RED
  if (isRed) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <span
          className={`relative rounded-full shrink-0 border border-[#fecdd3] ${dotSizes}`}
          style={{
            background: 'radial-gradient(circle at 35% 28%, #fda4af 0%, #f43f5e 35%, #e11d48 70%, #881337 100%)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.6), 0 0 10px rgba(244,63,94,0.7), inset 0 1.5px 2px rgba(255,255,255,0.8), inset 0 -1.5px 2px rgba(0,0,0,0.6)',
          }}
        >
          <span className="absolute top-[12%] left-[16%] w-2 h-1 rounded-full bg-white/80 transform -rotate-25 pointer-events-none" />
        </span>
        {showText && (
          <span
            className="font-orbitron text-[10px] font-black text-[#f43f5e] tracking-wider"
            style={{ textShadow: '0 0 8px rgba(244,63,94,0.8)' }}
          >
            RED
          </span>
        )}
      </div>
    );
  }

  // DUAL SPLIT: GREEN + VIOLET (5)
  if (isGreenViolet) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <span
          className={`relative rounded-full shrink-0 border border-white/40 overflow-hidden ${dotSizes}`}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #10b981 49%, #8b5cf6 51%, #8b5cf6 100%)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.6), 0 0 10px rgba(139,92,246,0.6), inset 0 1.5px 2px rgba(255,255,255,0.8), inset 0 -1.5px 2px rgba(0,0,0,0.6)',
          }}
        >
          <span className="absolute top-[12%] left-[16%] w-2 h-1 rounded-full bg-white/80 transform -rotate-25 pointer-events-none" />
        </span>
        {showText && (
          <span className="font-orbitron text-[10px] font-black text-[#a78bfa] tracking-wider">
            GRN/VIO
          </span>
        )}
      </div>
    );
  }

  // DUAL SPLIT: RED + VIOLET (0)
  if (isRedViolet) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <span
          className={`relative rounded-full shrink-0 border border-white/40 overflow-hidden ${dotSizes}`}
          style={{
            background: 'linear-gradient(135deg, #f43f5e 0%, #f43f5e 49%, #8b5cf6 51%, #8b5cf6 100%)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.6), 0 0 10px rgba(244,63,94,0.6), inset 0 1.5px 2px rgba(255,255,255,0.8), inset 0 -1.5px 2px rgba(0,0,0,0.6)',
          }}
        >
          <span className="absolute top-[12%] left-[16%] w-2 h-1 rounded-full bg-white/80 transform -rotate-25 pointer-events-none" />
        </span>
        {showText && (
          <span className="font-orbitron text-[10px] font-black text-[#f472b6] tracking-wider">
            RED/VIO
          </span>
        )}
      </div>
    );
  }

  // Pure VIOLET
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className={`relative rounded-full shrink-0 border border-[#c4b5fd] ${dotSizes}`}
        style={{
          background: 'radial-gradient(circle at 35% 28%, #c4b5fd 0%, #8b5cf6 35%, #7c3aed 70%, #4c1d95 100%)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.6), 0 0 10px rgba(139,92,246,0.7), inset 0 1.5px 2px rgba(255,255,255,0.8), inset 0 -1.5px 2px rgba(0,0,0,0.6)',
        }}
      >
        <span className="absolute top-[12%] left-[16%] w-2 h-1 rounded-full bg-white/80 transform -rotate-25 pointer-events-none" />
      </span>
      {showText && (
        <span className="font-orbitron text-[10px] font-black text-[#a78bfa] tracking-wider">
          VIOLET
        </span>
      )}
    </div>
  );
};
