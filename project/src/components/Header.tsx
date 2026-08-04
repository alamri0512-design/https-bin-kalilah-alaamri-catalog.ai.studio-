import React from 'react';
import { Language, Currency, SiteSettings } from '../types';
import { CURRENCY_RATES } from '../data/defaultData';
import { Phone, MapPin, MessageCircle, Lock, Globe, Mail, FileText, Sun, Moon } from 'lucide-react';

export type ThemeMode = 'light' | 'dark';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currency: Currency;
  onCurrencyChange: (curr: Currency) => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  settings: SiteSettings;
  onOpenAdmin: () => void;
  onOpenOfficialLetter: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  currency,
  onCurrencyChange,
  theme = 'light',
  onToggleTheme,
  settings,
  onOpenAdmin,
  onOpenOfficialLetter,
}) => {
  const isAr = language === 'ar';

  const defaultNavLinks = [
    { id: 'nav_catalog', labelAr: 'الكتالوج الرقمي', labelEn: 'Product Catalog', href: '#catalog' },
    { id: 'nav_about', labelAr: 'عن الشركة', labelEn: 'About Us', href: '#about' },
    { id: 'nav_order', labelAr: 'طلب جملة مباشر', labelEn: 'B2B Wholesale Order', href: '#order-portal' },
    { id: 'nav_shipping', labelAr: 'حاسبة الشحن', labelEn: 'Shipping Calculator', href: '#shipping' },
    { id: 'nav_tracker', labelAr: 'تتبع الطلبات', labelEn: 'Order Tracker', href: '#tracker' },
    { id: 'nav_special', labelAr: 'طلبات خاصة', labelEn: 'Special Requests', href: '#special-orders' },
  ];

  const navLinks = settings.headerNavLinks && settings.headerNavLinks.length > 0
    ? settings.headerNavLinks
    : defaultNavLinks;

  const headerTitle = isAr
    ? (settings.headerTitleAr || settings.heroTitleAr || 'شركة بن كليلة العامري للتجارة والاستثمار ش.م.م')
    : (settings.headerTitleEn || settings.heroTitleEn || 'Bin Kalilah Al-Aamri Trading & Investment Co. LLC');

  const headerSubtitle = isAr
    ? (settings.headerSubtitleAr || 'الوكيل المعتمد لمطاحن صلالة والمطاحن العمانية')
    : (settings.headerSubtitleEn || 'Exclusive Authorized Agent for Salalah & Oman Mills');

  const logoAlignmentClass = settings.logoAlignment === 'center'
    ? 'justify-center text-center'
    : settings.logoAlignment === 'right'
    ? 'justify-end text-right'
    : 'justify-start text-left';

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const targetElem = document.getElementById(targetId);
      if (targetElem) {
        targetElem.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = href;
      }
    }
  };

  return (
    <header
      className="sticky top-0 z-40 shadow-lg transition-colors duration-300 backdrop-blur-xl bg-[#0A1628]/85 border-b border-[#C9A84C]/30 text-white"
    >
      {/* Top Contact & Corporate Bar */}
      <div className="px-4 py-1.5 text-xs bg-[#060D18]/90 border-b border-[#C9A84C]/20 text-slate-200">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Quick Contact Info */}
          <div className="flex items-center gap-4 flex-wrap text-slate-300">
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#C9A84C] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{settings.whatsappNumber}</span>
            </a>
            <a
              href={`tel:${settings.phone1}`}
              className="flex items-center gap-1.5 hover:text-[#C9A84C] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span dir="ltr">{settings.phone1}</span>
            </a>
            <a
              href={`mailto:${settings.emails[0]}`}
              className="hidden sm:flex items-center gap-1.5 hover:text-[#C9A84C] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>{settings.emails[0]}</span>
            </a>
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#C9A84C] transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{isAr ? 'صلالة، عُمان' : 'Salalah, Oman'}</span>
            </a>
          </div>

          {/* Corporate Identity Tagline (Sample Letter Button Removed for Public View Privacy) */}
          <div className="flex items-center gap-3">
            <span className="text-[#C9A84C] font-semibold text-xs tracking-wide">
              {isAr ? 'الوكيل الحصري المعتمد لمطاحن صلالة والمطاحن العمانية' : 'Authorized Exclusive Agent: Salalah & Oman Mills'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Branding Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Company Title */}
        <div className={`flex items-center gap-3.5 ${logoAlignmentClass}`}>
          <img
            src={settings.logo}
            alt="Bin Kalilah Al-Aamri Logo"
            style={{ width: settings.logoWidth ? `${settings.logoWidth}px` : '120px' }}
            className="h-auto max-h-16 object-contain rounded-2xl p-1 bg-[#0A1628]/40 border border-[#C9A84C]/30 shadow-md backdrop-blur-sm"
          />
          <div>
            <h1 className="text-base sm:text-lg md:text-xl font-black tracking-tight leading-snug text-white">
              {headerTitle}
            </h1>
            <p className="text-xs font-bold tracking-wide text-[#C9A84C]">
              {headerSubtitle}
            </p>
          </div>
        </div>

        {/* Global Controls: Currency, Language, Theme Toggle, Admin Login */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Switcher */}
          <div className="flex items-center rounded-2xl border border-[#C9A84C]/40 bg-[#0A1628]/60 backdrop-blur-md px-3 py-1.5 text-xs shadow-sm">
            <span className="text-[#C9A84C] font-bold mr-1 ml-1">💱</span>
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as Currency)}
              className="bg-transparent focus:outline-none cursor-pointer font-extrabold text-white"
            >
              {Object.keys(CURRENCY_RATES).map((currKey) => (
                <option
                  key={currKey}
                  value={currKey}
                  className="bg-[#0A1628] text-white"
                >
                  {currKey} ({isAr ? CURRENCY_RATES[currKey].symbolAr : CURRENCY_RATES[currKey].symbolEn})
                </option>
              ))}
            </select>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => onLanguageChange(isAr ? 'en' : 'ar')}
            className="flex items-center gap-1.5 bg-[#C9A84C] hover:bg-[#d8b65c] text-[#0A1628] font-black text-xs px-3.5 py-2 rounded-2xl transition-all shadow-md active:scale-95"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isAr ? 'English' : 'عربي'}</span>
          </button>

          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              title={
                isAr
                  ? theme === 'dark'
                    ? 'التبديل إلى الوضع الفاتح'
                    : 'التبديل إلى الوضع الداكن'
                  : theme === 'dark'
                  ? 'Switch to Light Theme'
                  : 'Switch to Dark Theme'
              }
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-[#C9A84C]/40 bg-[#0A1628]/60 backdrop-blur-md transition-all shadow-sm cursor-pointer hover:scale-105 text-white"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-[#C9A84C]" />
                  <span className="hidden sm:inline text-xs font-bold text-[#C9A84C]">
                    {isAr ? 'فاتح' : 'Light'}
                  </span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-300" />
                  <span className="hidden sm:inline text-xs font-bold text-slate-200">
                    {isAr ? 'داكن' : 'Dark'}
                  </span>
                </>
              )}
            </button>
          )}

          {/* Admin Panel Password Trigger */}
          <button
            onClick={onOpenAdmin}
            title={isAr ? 'لوحة التحكم الإدارية' : 'Admin Control Panel'}
            className="p-2 rounded-2xl bg-[#C9A84C]/15 border border-[#C9A84C]/40 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A1628] transition-all shadow-sm"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dynamic Navigation Links Bar */}
      <nav className="border-t border-[#C9A84C]/20 py-2 px-4 bg-[#0A1628]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-start gap-1 sm:gap-4 overflow-x-auto scrollbar-thin text-xs font-extrabold text-white">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap hover:bg-[#C9A84C]/20 hover:text-[#C9A84C] font-extrabold cursor-pointer"
            >
              {isAr ? link.labelAr : link.labelEn}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
};
