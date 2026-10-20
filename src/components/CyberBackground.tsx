import React, { useEffect, useRef } from 'react';
import samuraiBg from '../assets/images/samurai_bg_1786792234887.jpg';

export const CyberBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      pulseSpeed: number;
      color: string;
    }> = [];

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const particleCount = Math.min(45, Math.floor((window.innerWidth * window.innerHeight) / 28000));
    for (let i = 0; i < particleCount; i++) {
      const isPink = Math.random() > 0.4;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        color: isPink ? '#ff2a85' : '#ffd700',
      });
    }

    let t = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.02;

      // Draw cyber glow particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const currentAlpha = Math.max(0.1, p.alpha + Math.sin(t + idx) * 0.25);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color === '#ff2a85' 
          ? `rgba(255, 42, 133, ${currentAlpha * 0.9})` 
          : `rgba(255, 215, 0, ${currentAlpha * 0.8})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();

        // Connect nearby particles with subtle cyber lines
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 42, 133, ${(1 - dist / 100) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Wallpaper Background Layer - Highly Visible & Vibrant with Pink cyber tint */}
      <div 
        id="samurai-bg-container" 
        className="fixed inset-0 pointer-events-none -z-30 overflow-hidden bg-[#070209]"
      >
        <img
          src={samuraiBg}
          alt="Samurai Cyber Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center sm:object-top opacity-65 filter contrast-125 brightness-90 scale-100 transition-all duration-700"
        />
      </div>

      {/* Cyber/Pink Vignette & Atmospheric Radial Glow */}
      <div 
        id="cyber-bg-layer"
        className="fixed inset-0 pointer-events-none -z-20"
        style={{
          background: `
            radial-gradient(circle at 50% 20%, rgba(255, 42, 133, 0.28) 0%, transparent 60%),
            radial-gradient(circle at 10% 80%, rgba(255, 215, 0, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 90% 80%, rgba(255, 0, 127, 0.22) 0%, transparent 50%),
            linear-gradient(to bottom, rgba(7, 2, 9, 0.35) 0%, rgba(12, 4, 16, 0.65) 50%, rgba(7, 2, 9, 0.92) 100%)
          `,
        }}
      />

      {/* Dynamic Cyber/Pink Spark Particle Canvas */}
      <canvas
        ref={canvasRef}
        id="bg-canvas"
        className="fixed inset-0 pointer-events-none -z-10"
      />
    </>
  );
};

