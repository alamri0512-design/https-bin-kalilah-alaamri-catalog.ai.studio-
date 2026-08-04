import React from 'react';
import { Language, SiteSettings } from '../types';
import { ShieldCheck, Award, Warehouse, Ship, Globe2, Sparkles, CheckCircle2 } from 'lucide-react';

interface AboutSectionProps {
  language: Language;
  settings: SiteSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ language, settings }) => {
  const isAr = language === 'ar';

  const services = [
    {
      icon: <Award className="w-8 h-8 text-[#C9A84C]" />,
      titleAr: 'وكالات حصرية معتمدة',
      titleEn: 'Exclusive Authorizations',
      descAr: 'الوكيل المعتمد والموزع الحصري لمطاحن صلالة ومطاحن العمانية، نضمن أصالة ومصدر المنتجات مباشرة من خروجها من خطوط الإنتاج.',
      descEn: 'Authorized agent for Salalah Flour Mills and Oman Mills, delivering products straight from production lines.',
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#C9A84C]" />,
      titleAr: 'جودة عالمية ومعايير قياسية معتمدة',
      titleEn: 'Global Quality Standards',
      descAr: 'إنتاج موثق وسميد قمح قاسي فاخر بدون إضافات كيميائية ينافس كبرى العلامات العالمية.',
      descEn: 'Certified production using pure durum wheat semolina without synthetic additives.',
    },
    {
      icon: <Warehouse className="w-8 h-8 text-[#C9A84C]" />,
      titleAr: 'مستودعات إستراتيجية في صلالة',
      titleEn: 'Strategic Salalah Storage',
      descAr: 'مخازن مجهزة بأحدث تقنيات حفظ الجودة للحفاظ على مخزون دائم طوال العام يلبي احتياجات الأسواق الإقليمية.',
      descEn: 'Modern climate-controlled warehousing in Salalah ensuring consistent bulk inventory year-round.',
    },
    {
      icon: <Ship className="w-8 h-8 text-[#C9A84C]" />,
      titleAr: 'شبكة لوجستية وتصدير إقليمي',
      titleEn: 'Integrated Regional Logistics',
      descAr: 'خطوط شحن برية وبحرية مباشرة لليمن (المهرة، حضرموت، عدن، الحديدة)، الإمارات، وعبر الموانئ الإفريقية.',
      descEn: 'Direct sea and land logistics routes serving Yemen, UAE, Oman, and African ports with optimum speed.',
    },
  ];

  return (
    <section id="about" className="py-16 bg-white/10 dark:bg-[#081220]/20 text-slate-900 dark:text-white relative overflow-hidden backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#0A1628] dark:text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-[#C9A84C]" />
            <span>{isAr ? 'عن الشركة والهوية الاستراتيجية' : 'About Us & Corporate Identity'}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">
            {isAr ? 'شركة بن كليلة العامري للتجارة والاستثمار' : 'Bin Kalilah Al-Aamri Trading & Investment'}
          </h2>
          <p className="text-base md:text-lg text-[#0A1628] dark:text-[#C9A84C] font-extrabold">
            {isAr ? 'الجودة في كل تفصيل، والثقة في كل شحنة' : 'Quality in Every Detail, Trust in Every Shipment'}
          </p>
        </div>

        {/* Exclusive Agency Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="p-5 rounded-3xl bg-white/20 dark:bg-[#0D1B2E]/35 border border-white/40 dark:border-[#C9A84C]/30 flex items-start gap-3 shadow-xl backdrop-blur-md">
            <CheckCircle2 className="w-6 h-6 text-[#C9A84C] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mb-1">
                {isAr ? 'مطاحن صلالة (الخريف)' : 'Salalah Flour Mills (Al-Khareef)'}
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {isAr ? 'وكيل حصري للدقيق والمعكرونة في اليمن والإمارات وإفريقيا' : 'Exclusive Agent for Flour & Pasta in Yemen, UAE, Africa'}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/20 dark:bg-[#0D1B2E]/35 border border-white/40 dark:border-[#C9A84C]/30 flex items-start gap-3 shadow-xl backdrop-blur-md">
            <CheckCircle2 className="w-6 h-6 text-[#C9A84C] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mb-1">
                {isAr ? 'المطاحن العمانية (بركات)' : 'Oman Mills (Barakat Products)'}
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {isAr ? 'وكيل معتمد لمنتجات بركات والأعلاف في الإمارات واليمن' : 'Authorized Agent for Barakat products & feed in UAE & Yemen'}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/20 dark:bg-[#0D1B2E]/35 border border-white/40 dark:border-[#C9A84C]/30 flex items-start gap-3 shadow-xl backdrop-blur-md">
            <CheckCircle2 className="w-6 h-6 text-[#C9A84C] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mb-1">
                {isAr ? 'السكر البرازيلي ICUMSA 45' : 'Brazilian Fine Sugar'}
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {isAr ? 'مستوردون وموردون معتمدون للكميات والتوريد الصناعي' : 'Direct importers of high-grade ICUMSA 45 white sugar'}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/20 dark:bg-[#0D1B2E]/35 border border-white/40 dark:border-[#C9A84C]/30 flex items-start gap-3 shadow-xl backdrop-blur-md">
            <CheckCircle2 className="w-6 h-6 text-[#C9A84C] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                {isAr ? 'حليب الخريف النيوزلندي 25kg' : 'NZ Milk Powder 25kg'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {isAr ? 'حليب مجفف كامل الدسم سريع الذوبان فاخر للجملة' : 'Premium instant full-cream milk powder for bulk supply'}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Main Text Box */}
        <div className="bg-white/85 dark:bg-[#0D1B2E]/85 border border-slate-200/80 dark:border-[#C9A84C]/30 rounded-2xl p-6 md:p-10 mb-12 shadow-xl backdrop-blur-md">
          <div className="prose max-w-none text-slate-700 dark:text-slate-200 text-sm md:text-base leading-relaxed whitespace-pre-line font-medium">
            {isAr ? settings.aboutTextAr : settings.aboutTextEn}
          </div>

          {/* Regional Coverage Tags */}
          <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#0A1628] dark:text-[#C9A84C] uppercase tracking-wider flex items-center gap-1 mr-2">
              <Globe2 className="w-4 h-4 text-[#C9A84C]" />
              {isAr ? 'التغطية النطاقية والتوزيع:' : 'Regional Coverage:'}
            </span>
            {['سلطنة عُمان (عُمان)', 'الجمهورية اليمنية', 'دولة الإمارات العربية المتحدة', 'الدول الإفريقية والأسواق العالمية'].map((region, i) => (
              <span
                key={i}
                className="bg-slate-100/90 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs px-3 py-1 rounded-full font-semibold border border-slate-200 dark:border-slate-700"
              >
                {region}
              </span>
            ))}
          </div>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/80 dark:bg-[#0D1B2E]/80 p-6 rounded-2xl border border-slate-200/60 dark:border-[#C9A84C]/25 hover:border-[#C9A84C]/60 transition-all hover:-translate-y-1 shadow-md hover:shadow-xl backdrop-blur-sm"
            >
              <div className="p-3 bg-slate-50/80 dark:bg-slate-800/80 rounded-xl w-fit mb-4 border border-slate-200/80 dark:border-slate-700">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {isAr ? item.titleAr : item.titleEn}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isAr ? item.descAr : item.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
