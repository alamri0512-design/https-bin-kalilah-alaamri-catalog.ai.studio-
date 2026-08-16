import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Waves, Network, CircleDot, Grid, EyeOff, Play, Pause, RefreshCw } from 'lucide-react';

export type BgStyleMode = 'particles' | 'aurora' | 'mesh' | 'orbs' | 'matrix' | 'off';

export interface DynamicBgSlide {
  id: string;
  titleAr: string;
  titleEn: string;
  url: string;
}

export const DYNAMIC_BACKGROUNDS: DynamicBgSlide[] = [
  {
    id: 'bg_salalah_port',
    titleAr: 'ميناء صلالة اللوجستي الدولي',
    titleEn: 'Salalah International Logistics Port',
    url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=2000&q=80',
  },
  {
    id: 'bg_golden_wheat',
    titleAr: 'حقول القمح العمانية والمنتجات الذهبية',
    titleEn: 'Omani Wheat Fields & Agriculture',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80',
  },
  {
    id: 'bg_maritime_fleet',
    titleAr: 'الأسطول اللوجستي والنقل البحري',
    titleEn: 'Global Maritime Logistics Fleet',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80',
  },
  {
    id: 'bg_salalah_mills',
    titleAr: 'صوامع ومطاحن صلالة والمطاحن العمانية',
    titleEn: 'Salalah Flour Mills & Modern Grain Silos',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=80',
  },
  {
    id: 'bg_omani_heritage',
    titleAr: 'التراث والمعمار العماني التليد',
    titleEn: 'Authentic Omani Architectural Heritage',
    url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2000&q=80',
  },
  {
    id: 'bg_dhofar_khareef',
    titleAr: 'طبيعة جبال ظفار وخريف صلالة',
    titleEn: 'Dhofar Mountains & Khareef Salalah',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2000&q=80',
  },
];

interface AnimatedBackgroundProps {
  styleMode?: BgStyleMode;
  speed?: number; // 1 to 5
  opacity?: number; // 10 to 100
  theme?: 'light' | 'dark';
  onStyleChange?: (newMode: BgStyleMode) => void;
  showQuickToggle?: boolean;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  styleMode = 'particles',
  speed = 2,
  opacity = 80,
  theme = 'light',
  onStyleChange,
  showQuickToggle = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Three-second interactive background slideshow state
  const [activeBgIdx, setActiveBgIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Switch background image every 3000ms (3 seconds)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveBgIdx((prev) => (prev + 1) % DYNAMIC_BACKGROUNDS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (styleMode === 'off') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const isDark = theme === 'dark';
    const effectiveSpeed = Math.max(0.5, speed);

    // Particle / Node setup
    const particleCount = styleMode === 'particles' ? 65 : styleMode === 'mesh' ? 45 : styleMode === 'matrix' ? 50 : 30;
    
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      baseAlpha: number;
      color: string;
      pulseSpeed: number;
      angle: number;
    }

    const goldPalette = isDark
      ? ['#C9A84C', '#EAB308', '#F59E0B', '#FCD34D', '#38BDF8', '#818CF8']
      : ['#B48A2C', '#D97706', '#CA8A04', '#0284C7', '#6366F1', '#10B981'];

    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const color = goldPalette[Math.floor(Math.random() * goldPalette.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8 * effectiveSpeed,
        vy: (Math.random() - 0.5) * 0.8 * effectiveSpeed,
        size: Math.random() * (styleMode === 'orbs' ? 45 : 3.5) + (styleMode === 'orbs' ? 15 : 1),
        alpha: Math.random() * 0.7 + 0.2,
        baseAlpha: Math.random() * 0.6 + 0.2,
        color,
        pulseSpeed: Math.random() * 0.03 + 0.008,
        angle: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.01 * effectiveSpeed;
      ctx.clearRect(0, 0, width, height);

      // --- MODE 1: PARTICLES (Golden Floating Dust & Sparkles) ---
      if (styleMode === 'particles') {
        particles.forEach((p) => {
          p.y -= (0.4 + Math.sin(time + p.x) * 0.2) * effectiveSpeed;
          p.x += Math.sin(time * 0.8 + p.y * 0.01) * 0.4 * effectiveSpeed;

          // Wrap around edges smoothly
          if (p.y < -20) p.y = height + 20;
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;

          p.alpha = p.baseAlpha + Math.sin(time * 3 + p.angle) * 0.25;

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0.05, Math.min(1, p.alpha * (opacity / 100)));
          ctx.shadowBlur = p.size * 3;
          ctx.shadowColor = p.color;
          ctx.fill();

          // Draw tiny cross star sparkle on larger particles
          if (p.size > 2.8) {
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 0.8;
            ctx.globalAlpha = p.alpha * 0.8 * (opacity / 100);
            ctx.beginPath();
            ctx.moveTo(p.x - p.size * 2, p.y);
            ctx.lineTo(p.x + p.size * 2, p.y);
            ctx.moveTo(p.x, p.y - p.size * 2);
            ctx.lineTo(p.x, p.y + p.size * 2);
            ctx.stroke();
          }
          ctx.restore();
        });
      }

      // --- MODE 2: AURORA (Fluid Multi-Layer Floating Glowing Waves) ---
      else if (styleMode === 'aurora') {
        const waveCount = 3;
        for (let w = 0; w < waveCount; w++) {
          ctx.save();
          ctx.beginPath();
          const waveHeight = height * 0.25;
          const baseY = height * (0.3 + w * 0.25);

          ctx.moveTo(0, height);
          ctx.lineTo(0, baseY);

          for (let x = 0; x <= width; x += 30) {
            const y =
              baseY +
              Math.sin(x * 0.003 + time * (1 + w * 0.5) + w) * waveHeight * 0.6 +
              Math.cos(x * 0.008 - time * 0.7) * 25;
            ctx.lineTo(x, y);
          }

          ctx.lineTo(width, height);
          ctx.closePath();

          const grad = ctx.createLinearGradient(0, baseY - waveHeight, width, height);
          if (isDark) {
            grad.addColorStop(0, w === 0 ? 'rgba(201, 168, 76, 0.12)' : w === 1 ? 'rgba(14, 116, 144, 0.15)' : 'rgba(99, 102, 241, 0.1)');
            grad.addColorStop(1, 'rgba(6, 13, 24, 0)');
          } else {
            grad.addColorStop(0, w === 0 ? 'rgba(202, 138, 4, 0.08)' : w === 1 ? 'rgba(2, 132, 199, 0.08)' : 'rgba(129, 140, 248, 0.06)');
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          }

          ctx.fillStyle = grad;
          ctx.globalAlpha = (opacity / 100);
          ctx.fill();
          ctx.restore();
        }
      }

      // --- MODE 3: MESH (Interactive Constellation Lattice Grid) ---
      else if (styleMode === 'mesh') {
        // Move nodes
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * (opacity / 100);
          ctx.fill();
          ctx.restore();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 140) {
              ctx.save();
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              const lineAlpha = (1 - dist / 140) * 0.35 * (opacity / 100);
              ctx.strokeStyle = isDark ? '#C9A84C' : '#CA8A04';
              ctx.lineWidth = 0.9;
              ctx.globalAlpha = lineAlpha;
              ctx.stroke();
              ctx.restore();
            }
          }
        }
      }

      // --- MODE 4: ORBS (Floating Ambient Soft Glowing Bokeh Circles) ---
      else if (styleMode === 'orbs') {
        particles.forEach((p) => {
          p.x += p.vx * 0.5;
          p.y += p.vy * 0.5;

          if (p.x < -100) p.x = width + 100;
          if (p.x > width + 100) p.x = -100;
          if (p.y < -100) p.y = height + 100;
          if (p.y > height + 100) p.y = -100;

          const currentRadius = p.size + Math.sin(time * 2 + p.angle) * 8;

          ctx.save();
          const radialGrad = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            Math.max(1, currentRadius)
          );
          radialGrad.addColorStop(0, p.color);
          radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = radialGrad;
          ctx.globalAlpha = 0.25 * (opacity / 100);
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(1, currentRadius), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      // --- MODE 5: MATRIX / OMANI GEOMETRIC LATTICE GRID ---
      else if (styleMode === 'matrix') {
        const gridStep = 60;
        ctx.save();
        ctx.strokeStyle = isDark ? 'rgba(201, 168, 76, 0.08)' : 'rgba(202, 138, 4, 0.07)';
        ctx.lineWidth = 1;

        for (let x = 0; x < width; x += gridStep) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        for (let y = 0; y < height; y += gridStep) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Draw active glowing grid pulses
        particles.forEach((p) => {
          p.y += 1.5 * effectiveSpeed;
          if (p.y > height) {
            p.y = 0;
            p.x = Math.floor(Math.random() * (width / gridStep)) * gridStep;
          }

          const gx = Math.floor(p.x / gridStep) * gridStep;
          const gy = Math.floor(p.y / gridStep) * gridStep;

          ctx.beginPath();
          ctx.rect(gx, gy, gridStep, gridStep);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = 0.18 * (opacity / 100);
          ctx.fill();

          ctx.strokeStyle = p.color;
          ctx.globalAlpha = 0.4 * (opacity / 100);
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [styleMode, speed, opacity, theme]);

  if (styleMode === 'off') return null;

  const bgStylesMap: Record<BgStyleMode, { nameAr: string; nameEn: string; icon: React.ReactNode }> = {
    particles: { nameAr: 'غبار ذهبي متحرك', nameEn: 'Golden Dust', icon: <Sparkles className="w-3.5 h-3.5" /> },
    aurora: { nameAr: 'أمواج الشفق الضوئي', nameEn: 'Aurora Waves', icon: <Waves className="w-3.5 h-3.5" /> },
    mesh: { nameAr: 'شبكة الكريستال الرقمية', nameEn: 'Digital Mesh', icon: <Network className="w-3.5 h-3.5" /> },
    orbs: { nameAr: 'أوراق الضوء الخافتة', nameEn: 'Glowing Orbs', icon: <CircleDot className="w-3.5 h-3.5" /> },
    matrix: { nameAr: 'مصفوفة التراث الذهبي', nameEn: 'Golden Lattice', icon: <Grid className="w-3.5 h-3.5" /> },
    off: { nameAr: 'إيقاف الخلفية المتحركة', nameEn: 'Disable FX', icon: <EyeOff className="w-3.5 h-3.5" /> },
  };

  const currentBgSlide = DYNAMIC_BACKGROUNDS[activeBgIdx];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Three-second dynamic background image slideshow layer */}
      {DYNAMIC_BACKGROUNDS.map((slide, idx) => {
        const isActive = idx === activeBgIdx;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform ${
              isActive ? 'opacity-40 scale-100' : 'opacity-0 scale-105'
            }`}
            style={{
              backgroundImage: `url(${slide.url})`,
            }}
          />
        );
      })}

      {/* Dark Vignette and Gradient Blend Mask to Ensure Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/70 via-[#0A1628]/50 to-[#0A1628]/80 backdrop-blur-[2px]" />

      {/* Fixed Fullscreen Background Particle Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          opacity: opacity / 100,
        }}
      />

      {/* Floating Ambient Lighting Overlay for Smooth Page Depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#C9A84C]/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] rounded-full bg-sky-500/15 blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 left-1/4 w-[32rem] h-[32rem] rounded-full bg-amber-500/15 blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Live background slide indicator and mode switcher controls */}
      <div className="pointer-events-auto fixed bottom-5 left-5 z-40 hidden md:flex items-center gap-2 p-2 bg-[#0A1628]/85 backdrop-blur-xl border border-[#C9A84C]/50 rounded-2xl shadow-2xl text-xs text-white">
        {/* Live Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-xl border border-[#C9A84C]/30 text-[11px] font-bold text-[#C9A84C]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>الخلفية التفاعلية: {currentBgSlide.titleAr}</span>
        </div>

        {/* Play / pause transition button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? 'إيقاف مؤقت للتنقل التلقائي' : 'تشغيل التنقل التلقائي للخلفيات'}
          className="px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-[#C9A84C] hover:text-[#0A1628] text-white transition-all text-[11px] font-bold flex items-center gap-1"
        >
          <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span>{isPlaying ? 'متحرك' : 'ثابت'}</span>
        </button>

        {/* Manual Next Slide Button */}
        <button
          onClick={() => setActiveBgIdx((prev) => (prev + 1) % DYNAMIC_BACKGROUNDS.length)}
          title="التغيير للخلفية التالية فوراً"
          className="p-1.5 rounded-xl bg-white/10 hover:bg-[#C9A84C] hover:text-[#0A1628] text-white transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {/* Style Mode Selector Badges */}
        {showQuickToggle && onStyleChange && (
          <div className="flex items-center gap-1 border-r border-slate-700/60 pr-2 mr-1">
            {(['particles', 'aurora', 'mesh', 'orbs', 'matrix'] as BgStyleMode[]).map((mode) => {
              const isActive = styleMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => onStyleChange(mode)}
                  title={bgStylesMap[mode].nameAr}
                  className={`p-1.5 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-[#C9A84C] text-[#0A1628] font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {bgStylesMap[mode].icon}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

