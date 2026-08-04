import React, { useState, useEffect } from 'react';
import { MessageCircle, Bot, ChevronUp } from 'lucide-react';

interface FloatingWhatsAppProps {
  whatsappNumber: string;
  onOpenAiAssistant: () => void;
  language: 'ar' | 'en';
}

const playClickSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    // Audio Context fail-safe
  }
};

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  whatsappNumber,
  onOpenAiAssistant,
  language,
}) => {
  const isAr = language === 'ar';
  const cleanNum = whatsappNumber.replace(/[^0-9]/g, '');

  const [hasClickedWhatsApp, setHasClickedWhatsApp] = useState<boolean>(() => {
    return localStorage.getItem('whatsapp_badge_clicked') === 'true';
  });

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [ripples, setRipples] = useState<{ [key: string]: Array<{ id: number; x: number; y: number; size: number }> }>({});

  const triggerRipple = (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement> | undefined,
    key: string
  ) => {
    let x = 0;
    let y = 0;
    let size = 100;

    if (e && 'clientX' in e && e.clientX !== 0 && e.clientY !== 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      size = Math.max(rect.width, rect.height) * 2;
      x = e.clientX - rect.left - size / 2;
      y = e.clientY - rect.top - size / 2;
    } else if (e && 'currentTarget' in e) {
      const rect = e.currentTarget.getBoundingClientRect();
      size = Math.max(rect.width, rect.height) * 2;
      x = rect.width / 2 - size / 2;
      y = rect.height / 2 - size / 2;
    }

    const newRipple = { id: Date.now() + Math.random(), x, y, size };

    setRipples((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), newRipple],
    }));

    setTimeout(() => {
      setRipples((prev) => ({
        ...prev,
        [key]: (prev[key] || []).filter((r) => r.id !== newRipple.id),
      }));
    }, 600);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAiClick = (e?: React.MouseEvent<HTMLButtonElement>) => {
    triggerRipple(e, 'ai');
    playClickSound();
    onOpenAiAssistant();
  };

  const handleWhatsAppClick = (e?: React.MouseEvent<HTMLAnchorElement>) => {
    triggerRipple(e, 'wa');
    playClickSound();
    setHasClickedWhatsApp(true);
    localStorage.setItem('whatsapp_badge_clicked', 'true');
  };

  const handleScrollToTop = (e?: React.MouseEvent<HTMLButtonElement>) => {
    triggerRipple(e, 'scrollTop');
    playClickSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAiKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerRipple(e, 'ai');
      handleAiClick();
    }
  };

  const whatsappUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(
    isAr
      ? 'السلام عليكم ورحمة الله، أرغب بالاستفسار عن طلبية جملة من شركة بن كليلة العامري.'
      : 'Hello, I would like to inquire about a B2B wholesale order.'
  )}`;

  const handleWhatsAppKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerRipple(e, 'wa');
      handleWhatsAppClick();
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleScrollTopKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerRipple(e, 'scrollTop');
      handleScrollToTop();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto animate-slide-in-br">
      {/* Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          onKeyDown={handleScrollTopKeyDown}
          tabIndex={0}
          title={isAr ? 'الرجوع إلى الأعلى' : 'Scroll to Top'}
          className="group relative overflow-hidden flex items-center justify-center w-12 h-12 bg-[#0A1628] hover:bg-[#13233A] text-[#C9A84C] hover:text-amber-300 border border-[#C9A84C]/60 hover:border-[#C9A84C] rounded-full shadow-lg hover:shadow-[0_12px_28px_rgba(201,168,76,0.35)] hover:-translate-y-1 hover:scale-110 active:scale-95 transition-all duration-300 ease-in-out cursor-pointer animate-slide-in-br focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
        >
          <ChevronUp className="w-5 h-5 text-[#C9A84C] group-hover:text-amber-300 transition-all duration-300 ease-in-out group-hover:-translate-y-0.5 group-hover:scale-110 relative z-10" />
          {ripples['scrollTop']?.map((r) => (
            <span
              key={r.id}
              style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
              className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
            />
          ))}
        </button>
      )}

      {/* AI Smart Assistant Trigger Button */}
      <button
        onClick={handleAiClick}
        onKeyDown={handleAiKeyDown}
        tabIndex={0}
        className="group relative overflow-hidden flex items-center gap-2.5 bg-[#0A1628] hover:bg-[#13233A] text-[#C9A84C] hover:text-amber-300 border border-[#C9A84C]/60 hover:border-[#C9A84C] px-4 py-2.5 rounded-full shadow-xl hover:shadow-[0_12px_30px_rgba(201,168,76,0.35)] hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
      >
        <Bot className="w-5 h-5 text-[#C9A84C] group-hover:text-amber-300 group-hover:scale-110 transition-all duration-300 ease-in-out relative z-10" />
        <span className="text-xs font-bold text-white group-hover:text-amber-200 transition-all duration-300 ease-in-out hidden sm:inline relative z-10">
          {isAr ? 'المساعد الذكي' : 'AI Assistant'}
        </span>
        {ripples['ai']?.map((r) => (
          <span
            key={r.id}
            style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
            className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
          />
        ))}
      </button>

      {/* Direct WhatsApp Trigger Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleWhatsAppClick}
        onKeyDown={handleWhatsAppKeyDown}
        tabIndex={0}
        className="group relative overflow-hidden flex items-center justify-center p-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl hover:shadow-[0_16px_36px_rgba(16,185,129,0.55)] hover:-translate-y-1 hover:scale-105 active:scale-95 ring-4 ring-emerald-500/30 hover:ring-emerald-400/70 transition-all duration-300 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-300"
        title={isAr ? 'تواصل مباشر عبر الواتساب' : 'Direct WhatsApp Chat'}
      >
        <MessageCircle className="w-7 h-7 text-white transition-all duration-300 ease-in-out group-hover:rotate-12 group-hover:scale-110 relative z-10" />
        {!hasClickedWhatsApp && (
          <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow animate-pulse z-20">
            1
          </span>
        )}
        {ripples['wa']?.map((r) => (
          <span
            key={r.id}
            style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
            className="absolute rounded-full bg-white/40 pointer-events-none animate-ripple"
          />
        ))}
      </a>
    </div>
  );
};
