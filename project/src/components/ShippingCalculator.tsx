import React, { useState } from 'react';
import { Language, Currency, ShippingCalculation, SiteSettings } from '../types';
import { CURRENCY_RATES } from '../data/defaultData';
import { Calculator, Ship, Truck, Anchor, CheckCircle2 } from 'lucide-react';

interface ShippingCalculatorProps {
  language: Language;
  currency: Currency;
  settings: SiteSettings;
  orderTotalWeightTons?: number;
}

export const ShippingCalculator: React.FC<ShippingCalculatorProps> = ({
  language,
  currency,
  settings,
  orderTotalWeightTons = 0,
}) => {
  const isAr = language === 'ar';

  const [weightTons, setWeightTons] = useState<number>(orderTotalWeightTons > 0 ? orderTotalWeightTons : 25);
  const [destination, setDestination] = useState<string>('yemen_mahrah');
  const [shippingType, setShippingType] = useState<'sea' | 'land'>('sea');

  const currRate = CURRENCY_RATES[currency] || CURRENCY_RATES.OMR;

  // Math: 1 Container = 25 Tons
  const containersNeeded = Math.max(1, Math.ceil(weightTons / 25));

  // Custom rates
  const baseSeaRatePerTonOMR = settings.customSeaRatePerTonOMR || 18.0;
  const baseLandRatePerTruckOMR = settings.customLandRatePerTruckOMR || 450.0;

  // Destination multiplier adjustments
  const getDestinationMultiplier = () => {
    switch (destination) {
      case 'yemen_mahrah': return 1.0;
      case 'yemen_mukalla': return 1.15;
      case 'yemen_aden': return 1.30;
      case 'yemen_hodeidah': return 1.45;
      case 'uae_dubai': return 0.90;
      case 'africa_djibouti': return 1.60;
      default: return 1.0;
    }
  };

  const mult = getDestinationMultiplier();

  const estSeaCostOMR = weightTons * baseSeaRatePerTonOMR * mult;
  const estLandCostOMR = containersNeeded * baseLandRatePerTruckOMR * mult;

  const currentCostOMR = shippingType === 'sea' ? estSeaCostOMR : estLandCostOMR;
  const convertedCost = (currentCostOMR * currRate.rateToOMR).toFixed(2);
  const currSymbol = isAr ? currRate.symbolAr : currRate.symbolEn;

  return (
    <section id="shipping" className="py-16 bg-white/10 dark:bg-[#060D18]/20 text-white relative backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-md shadow-sm">
            <Calculator className="w-4 h-4 text-[#C9A84C]" />
            <span>{isAr ? 'حاسبة الشحن واللوجستيات' : 'Shipping & Logistics Calculator'}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">
            {isAr ? 'حساب تكاليف وسعة شحن البضائع والجملة' : 'Sea & Land Logistics Rate Calculator'}
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
            {isAr
              ? 'احسب عدد الحاويات الـ 20 قدم (حمولتها 25 طن) والتكلفة الشحن التقديرية مباشرة من صلالة إلى منافذ اليمن ودول الخليج'
              : 'Estimate container requirements (25-ton capacity per 20ft container) and shipping costs from Salalah ports'}
          </p>
        </div>

        <div className="bg-white/20 dark:bg-[#0D1B2E]/35 border border-white/40 dark:border-[#C9A84C]/35 rounded-3xl p-6 md:p-10 max-w-4xl mx-auto shadow-2xl backdrop-blur-md">
          {/* Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Input Total Weight */}
            <div>
              <label className="block text-xs font-bold text-[#C9A84C] mb-2">
                {isAr ? 'إجمالي الوزن المطلوبة (بالأطنان):' : 'Total Cargo Weight (Tons):'}
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={weightTons}
                onChange={(e) => setWeightTons(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full bg-[#060D18] text-white font-mono font-bold text-lg border border-slate-700 rounded-xl px-4 py-3 focus:border-[#C9A84C] focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {isAr ? 'حاوية الـ 20 قدم تتسع لـ 25 طن متري' : '1x 20ft Container capacity = 25 Metric Tons'}
              </span>
            </div>

            {/* Destination Selection */}
            <div>
              <label className="block text-xs font-bold text-[#C9A84C] mb-2">
                {isAr ? 'وجهة الشحن:' : 'Destination Port / Area:'}
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-[#060D18] text-white text-xs font-bold border border-slate-700 rounded-xl px-3 py-3.5 focus:border-[#C9A84C] focus:outline-none cursor-pointer"
              >
                <option value="yemen_mahrah">{isAr ? 'اليمن - منفذ المهرة / نشطون' : 'Yemen - Al-Mahrah / Nishtun'}</option>
                <option value="yemen_mukalla">{isAr ? 'اليمن - ميناء المكلا / حضرموت' : 'Yemen - Mukalla Port'}</option>
                <option value="yemen_aden">{isAr ? 'اليمن - ميناء عدن الدولي' : 'Yemen - Aden International Port'}</option>
                <option value="yemen_hodeidah">{isAr ? 'اليمن - ميناء الحديدة' : 'Yemen - Hodeidah Port'}</option>
                <option value="uae_dubai">{isAr ? 'الإمارات - دبي / أباظبي' : 'UAE - Dubai / Abu Dhabi'}</option>
                <option value="africa_djibouti">{isAr ? 'الموانئ الإفريقية (جيبوتي / مومباسا)' : 'African Ports (Djibouti / Mombasa)'}</option>
              </select>
            </div>

            {/* Mode Selection */}
            <div>
              <label className="block text-xs font-bold text-[#C9A84C] mb-2">
                {isAr ? 'مسار وسيلة الشحن:' : 'Shipping Mode:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShippingType('sea')}
                  className={`flex items-center justify-center gap-1.5 p-3 rounded-xl border font-bold text-xs transition ${
                    shippingType === 'sea'
                      ? 'bg-[#C9A84C] text-[#0A1628] border-[#C9A84C]'
                      : 'bg-[#060D18] text-slate-300 border-slate-700'
                  }`}
                >
                  <Ship className="w-4 h-4" />
                  <span>{isAr ? 'بحري (حاويات)' : 'Sea Cargo'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingType('land')}
                  className={`flex items-center justify-center gap-1.5 p-3 rounded-xl border font-bold text-xs transition ${
                    shippingType === 'land'
                      ? 'bg-[#C9A84C] text-[#0A1628] border-[#C9A84C]'
                      : 'bg-[#060D18] text-slate-300 border-slate-700'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>{isAr ? 'بري (شاحنات)' : 'Land Truck'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Calculation Results Display */}
          <div className="bg-[#060D18] p-6 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-center">
            {/* Weight & Container Count */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">
                {isAr ? 'عدد الحاويات الـ 20 قدم:' : '20ft Containers Required:'}
              </span>
              <span className="text-3xl font-black text-white font-mono">
                {containersNeeded} <span className="text-xs text-[#C9A84C] font-sans">{isAr ? 'حاوية' : 'Containers'}</span>
              </span>
            </div>

            {/* Status Indicator */}
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1.5 rounded-full text-xs font-black shadow">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'جاهز للشحن والتصدير' : 'Ready to Ship'}</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-2">
                {isAr ? 'تأمين سلامة الشحنات ومطابقة معايير الجودة' : 'Full Insurance & Quality Inspection Guaranteed'}
              </span>
            </div>

            {/* Est Cost */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">
                {isAr ? 'التكلفة الشحن التقديرية:' : 'Est. Shipping Cost:'}
              </span>
              <span className="text-2xl font-black text-[#C9A84C] font-mono">
                {convertedCost} {currSymbol}
              </span>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-[11px] text-slate-400 text-center mt-6">
            💡 {isAr ? 'ملاحظة: هذه التكاليف تقديرية وتخضع للتأكيد النهائي عند إصدار بوليصة الشحن الرسمية والتخليص الجمركي.' : 'Note: Freight rates are estimated and subject to official bill of lading confirmation.'}
          </p>
        </div>
      </div>
    </section>
  );
};
