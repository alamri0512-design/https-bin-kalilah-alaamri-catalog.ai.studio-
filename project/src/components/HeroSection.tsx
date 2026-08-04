import React, { useState, useEffect } from 'react';
import { Language, HeroSlide, SiteSettings } from '../types';
import { ShoppingBag, Truck, PhoneCall } from 'lucide-react';

interface HeroSectionProps {
  language: Language;
  slides: HeroSlide[];
  settings: SiteSettings;
  onNavigateToCatalog: () => void;
  onNavigateToOrder: () => void;
  onNavigateToShipping: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  slides,
  settings,
  onNavigateToCatalog,
  onNavigateToOrder,
  onNavigateToShipping,
}) => {
  const isAr = language === 'ar';
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const intervalMs = (settings.heroSpeed || 5) * 1000;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [slides, settings.heroSpeed]);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  const titleText = isAr
    ? currentSlide.titleAr || settings.heroTitleAr
    : currentSlide.titleEn || settings.heroTitleEn;

  const subtitleText = isAr
    ? currentSlide.subtitleAr || settings.heroSubtitleAr
    : currentSlide.subtitleEn || settings.heroSubtitleEn;

  return (
    <section className="relative w-full h-[540px] md:h-[640px] overflow-hidden flex items-center justify-center bg-transparent">
      {/* Background Slides with Organic Gradient Overlay */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={slide.imageUrl}
            alt={slide.titleEn || 'Hero Slide'}
            className="w-full h-full object-cover object-center filter brightness-75 scale-105 transform transition-transform duration-10000"
          />
          {/* Omani Deep Royal Blue Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/95 via-[#0A1628]/50 to-transparent" />
        </div>
      ))}

      {/* Hero Content - Continuous Transparent Glass Badge & Text */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 text-center">
        <div className="p-8 md:p-12 rounded-3xl bg-[#0A1628]/35 border border-[#C9A84C]/30 backdrop-blur-xl max-w-4xl mx-auto shadow-2xl transition-all duration-300">
          {/* Corporate Seal Badge */}
          <div className="inline-flex items-center gap-2 bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/50 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
            <span>{isAr ? 'الوكالة الحصرية المعتمده في صلالة' : 'Authorized Exclusive Agent in Salalah'}</span>
          </div>

          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-5 drop-shadow-lg">
            {titleText}
          </h2>

          <p className="text-sm md:text-lg text-slate-200 max-w-3xl mx-auto leading-relaxed mb-8 font-medium">
            {subtitleText}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onNavigateToCatalog}
              className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#D8B65C] text-[#0A1628] font-black text-sm md:text-base px-6 py-3.5 rounded-2xl transition-all active:scale-95 shadow-xl border border-[#C9A84C]"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{isAr ? 'تصفح الكتالوج والمنتجات' : 'Browse Product Catalog'}</span>
            </button>

            <button
              onClick={onNavigateToOrder}
              className="flex items-center gap-2 bg-[#0A1628]/80 hover:bg-[#0A1628] text-white font-bold text-sm md:text-base px-6 py-3.5 rounded-2xl border border-[#C9A84C]/50 transition-all active:scale-95 shadow-xl backdrop-blur-md"
            >
              <PhoneCall className="w-5 h-5 text-emerald-400" />
              <span>{isAr ? 'طلب جملة مباشر (واتساب)' : 'B2B Wholesale Order'}</span>
            </button>

            <button
              onClick={onNavigateToShipping}
              className="flex items-center gap-2 bg-[#0A1628]/50 hover:bg-[#0A1628]/80 text-[#C9A84C] font-semibold text-sm px-5 py-3.5 rounded-2xl border border-[#C9A84C]/30 transition-all backdrop-blur-md"
            >
              <Truck className="w-4 h-4" />
              <span>{isAr ? 'حاسبة الشحن لليمن' : 'Yemen Shipping Calculator'}</span>
            </button>
          </div>

          {/* Slide Indicator Dots (Replaces any arrow/chevron icons) */}
          {slides.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'w-8 bg-[#C9A84C]' : 'w-2.5 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

