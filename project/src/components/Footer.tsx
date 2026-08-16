import React from 'react';
import { Language, SiteSettings } from '../types';
import { Phone, Mail, MapPin, MessageCircle, Lock, ShieldCheck, ScanLine } from 'lucide-react';

interface FooterProps {
  language: Language;
  settings: SiteSettings;
  onOpenAdmin: () => void;
  onOpenOfficialLetter: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  settings,
  onOpenAdmin,
  onOpenOfficialLetter,
}) => {
  const isAr = language === 'ar';

  return (
    <footer className="bg-[#040912]/80 text-white border-t-2 border-[#C9A84C]/40 pt-12 pb-8 backdrop-blur-md relative z-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={settings.logo}
                alt="Bin Kalilah Al-Aamri Logo"
                className="w-12 h-12 object-contain rounded border border-[#C9A84C]/40 bg-[#0A1628] p-1"
              />
              <div>
                <h3 className="font-extrabold text-sm text-white leading-snug">
                  {isAr ? 'شركة بن كليلة العامري' : 'Bin Kalilah Al-Aamri Co.'}
                </h3>
                <p className="text-[10px] text-[#C9A84C] font-semibold">
                  {isAr ? 'للتجارة والاستثمار ش.م.م' : 'Trading & Investment Co. LLC'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {isAr
                ? 'الوكيل الحصري المعتمد لمطاحن صلالة ومطاحن العمانية في الجمهورية اليمنية ودولة الإمارات العربية المتحدة والأسواق الإفريقية.'
                : 'Exclusive authorized agent for Salalah Flour Mills and Oman Mills in Yemen, UAE, and Africa.'}
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-[#0A1628] p-2 rounded-lg border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>{isAr ? 'منتجات عالية الجودة ومعتمدة 100%' : '100% Certified Premium Quality'}</span>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-[#C9A84C] text-sm mb-4 pb-2 border-b border-slate-800">
              {isAr ? 'معلومات التواصل المباشرة' : 'Direct Contact Info'}
            </h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C9A84C] shrink-0" />
                <span>{isAr ? 'صلالة، منطقة المزيونة / المنطقة الصناعية، سلطنة عُمان' : 'Salalah, Industrial Area, Sultanate of Oman'}</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="hover:text-[#C9A84C]">
                  {settings.whatsappNumber}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C9A84C] shrink-0" />
                <span dir="ltr">{settings.phone1} / {settings.phone2}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C9A84C] shrink-0" />
                <span>{settings.emails[0]}</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-[#C9A84C] text-sm mb-4 pb-2 border-b border-slate-800">
              {isAr ? 'أقسام المنصة والخدمات' : 'Platform Quick Links'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="#catalog" className="hover:text-[#C9A84C] transition">
                  {isAr ? '• الكتالوج الرقمي للمنتجات' : '• Product Catalog'}
                </a>
              </li>
              <li>
                <a href="#order-portal" className="hover:text-[#C9A84C] transition">
                  {isAr ? '• بوابة طلبات الجملة' : '• B2B Order Form'}
                </a>
              </li>
              <li>
                <a href="#shipping" className="hover:text-[#C9A84C] transition">
                  {isAr ? '• حاسبة الشحن واللوجستيات' : '• Shipping Calculator'}
                </a>
              </li>
              <li>
                <a href="#tracker" className="hover:text-[#C9A84C] transition">
                  {isAr ? '• تتبع حالة الشحنات' : '• Order Tracker'}
                </a>
              </li>
              <li>
                <a href="#special-orders" className="hover:text-[#C9A84C] transition">
                  {isAr ? '• طلبات التعبئة الخاصة Private Label' : '• Special Orders'}
                </a>
              </li>
            </ul>
          </div>

          {/* Original QR Code */}
          <div>
            <h4 className="font-bold text-[#C9A84C] text-sm mb-4 pb-2 border-b border-slate-800/80">
              {isAr ? 'الوصول السريع للموقع' : 'Quick Website Access'}
            </h4>
            <div className="rounded-2xl bg-white/10 border border-[#C9A84C]/30 p-3 backdrop-blur-xl shadow-xl">
              <a href={typeof window !== 'undefined' ? window.location.href : '#'} target="_blank" rel="noreferrer" className="block rounded-xl overflow-hidden bg-white p-2 hover:scale-[1.02] transition-transform">
                <img src="/company-qr.jpg" alt={isAr ? 'رمز QR للموقع' : 'Website QR code'} className="w-full aspect-square object-contain" />
              </a>
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-200 font-bold">
                <ScanLine className="w-4 h-4 text-[#C9A84C]" />
                <span>{isAr ? 'امسح الرمز لفتح آخر نسخة' : 'Scan to open the latest version'}</span>
              </div>
            </div>
          </div>

          {/* Admin & Security Access */}
          <div>
            <h4 className="font-bold text-[#C9A84C] text-sm mb-4 pb-2 border-b border-slate-800/80">
              {isAr ? 'الوصول والحماية' : 'Security & Governance'}
            </h4>
            <div className="space-y-3">
              <button
                onClick={onOpenAdmin}
                className="w-full py-2.5 bg-[#0A1628]/80 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A1628] font-black text-xs rounded-2xl border border-[#C9A84C]/40 transition flex items-center justify-center gap-2 shadow-md backdrop-blur-md"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isAr ? 'لوحة التحكم الإدارية' : 'Admin Control Panel'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Rights */}
        <div className="pt-6 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>
            © 2026 {isAr ? 'شركة بن كليلة العامري للتجارة والاستثمار ش.م.م' : 'Bin Kalilah Al-Aamri Trading & Investment Co. LLC'}. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <p className="text-[10px] text-[#C9A84C]">
            {isAr ? 'الوكالة الحصرية لمطاحن صلالة والمطاحن العمانية' : 'Authorized Exclusive Agent - Salalah & Oman Mills'}
          </p>
        </div>
      </div>
    </footer>
  );
};
