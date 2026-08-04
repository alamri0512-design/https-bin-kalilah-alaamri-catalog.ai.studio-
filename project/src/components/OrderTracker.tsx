import React, { useState } from 'react';
import { Language, OrderForm } from '../types';
import { Clock, Search, CheckCircle2, PackageCheck, Truck, ShieldCheck } from 'lucide-react';

interface OrderTrackerProps {
  language: Language;
  orders: OrderForm[];
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ language, orders }) => {
  const isAr = language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedOrder, setMatchedOrder] = useState<OrderForm | null>(orders[0] || null);

  const stages = [
    { key: 'received', labelAr: 'تم الاستلام', labelEn: 'Received', icon: <Clock className="w-5 h-5" /> },
    { key: 'review', labelAr: 'قيد المراجعة', labelEn: 'Under Review', icon: <Search className="w-5 h-5" /> },
    { key: 'approved', labelAr: 'تمت الموافقة', labelEn: 'Approved', icon: <CheckCircle2 className="w-5 h-5" /> },
    { key: 'processing', labelAr: 'قيد التجهيز', labelEn: 'Processing', icon: <PackageCheck className="w-5 h-5" /> },
    { key: 'shipped', labelAr: 'تم الشحن والتصدير', labelEn: 'Shipped', icon: <Truck className="w-5 h-5" /> },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    const found = orders.find(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q)
    );
    if (found) {
      setMatchedOrder(found);
    } else {
      alert(isAr ? 'لم يتم العثور على طلب برقم البحث المكتوب' : 'No order found matching query.');
    }
  };

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'received': return 0;
      case 'review': return 1;
      case 'approved': return 2;
      case 'processing': return 3;
      case 'shipped': return 4;
      default: return 0;
    }
  };

  const currentStageIdx = matchedOrder ? getStageIndex(matchedOrder.status) : 0;

  return (
    <section id="tracker" className="py-16 bg-white/10 dark:bg-[#081220]/20 text-white relative backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-md shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#C9A84C]" />
            <span>{isAr ? 'نظام تتبع حالة الطلبيات والشحنات' : 'Order Status Tracker'}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">
            {isAr ? 'تتبع مراحل جهوزية شحنتك المباشرة' : 'Track Your Logistics Shipment Progress'}
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
            {isAr
              ? 'أدخل رقم الهاتف أو رمز الطلب لمتابعة حالة المراجعة والموافقة والشحن مباشرة من مستودعاتنا في صلالة'
              : 'Enter customer phone or order ID to track status in real-time'}
          </p>
        </div>

        {/* Search Input Box */}
        <div className="max-w-xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white/20 dark:bg-[#0D1B2E]/50 p-2.5 rounded-2xl border border-white/40 dark:border-slate-700/80 backdrop-blur-md shadow-lg">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'أدخل رقم الهاتف أو اسم العميل للتتبع...' : 'Enter phone or order ID...'}
              className="flex-1 bg-transparent text-slate-900 dark:text-white px-4 py-2 text-sm focus:outline-none placeholder-slate-500 font-medium"
            />
            <button
              type="submit"
              className="bg-[#C9A84C] text-[#0A1628] font-black text-xs px-5 py-2.5 rounded-xl hover:bg-[#D8B65C] transition flex items-center gap-1 shrink-0 shadow-md"
            >
              <Search className="w-4 h-4" />
              <span>{isAr ? 'بحث عن الطلب' : 'Search Order'}</span>
            </button>
          </form>
        </div>

        {/* Status Tracker Box */}
        {matchedOrder ? (
          <div className="bg-white/20 dark:bg-[#0D1B2E]/35 border border-white/40 dark:border-[#C9A84C]/40 rounded-3xl p-6 md:p-10 max-w-4xl mx-auto shadow-2xl backdrop-blur-md">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-700">
              <div>
                <span className="text-xs text-slate-400 block mb-1">{isAr ? 'جهة الطلب والعميل:' : 'Customer Name:'}</span>
                <h3 className="text-xl font-black text-white">{matchedOrder.customerName}</h3>
                <span className="text-xs text-[#C9A84C] font-mono mt-0.5 block">
                  {matchedOrder.region} • {matchedOrder.phone}
                </span>
              </div>

              <div className="text-left">
                <span className="text-xs text-slate-400 block mb-1">{isAr ? 'تاريخ الطلب:' : 'Order Date:'}</span>
                <span className="text-sm font-bold text-slate-200">{matchedOrder.createdAt}</span>
              </div>
            </div>

            {/* Progress Bar Timeline */}
            <div className="relative py-4 mb-8">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-1 bg-[#C9A84C] -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${(currentStageIdx / (stages.length - 1)) * 100}%` }}
              />

              {/* Steps icons */}
              <div className="relative z-10 flex items-center justify-between">
                {stages.map((stage, idx) => {
                  const isCompleted = idx <= currentStageIdx;
                  const isCurrent = idx === currentStageIdx;

                  return (
                    <div key={stage.key} className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-[#C9A84C] text-[#0A1628] shadow-lg shadow-[#C9A84C]/20 ring-4 ring-[#0A1628]'
                            : 'bg-[#13233A] text-slate-500 border border-slate-700 ring-4 ring-[#0A1628]'
                        } ${isCurrent ? 'animate-pulse ring-amber-400' : ''}`}
                      >
                        {stage.icon}
                      </div>

                      <span
                        className={`text-xs font-bold mt-3 text-center ${
                          isCompleted ? 'text-white' : 'text-slate-500'
                        }`}
                      >
                        {isAr ? stage.labelAr : stage.labelEn}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items Included */}
            <div className="bg-[#060D18] p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-[#C9A84C] mb-2">
                {isAr ? 'محتويات الشحنة المسجلة:' : 'Shipment Items:'}
              </h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {matchedOrder.items.map((item, i) => (
                  <span key={i} className="bg-[#13233A] px-3 py-1 rounded border border-slate-700 text-slate-200">
                    {isAr ? item.productNameAr : item.productNameEn} ({item.weight} - {item.quantity} {item.unit})
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-[#0D1B2E] rounded-2xl border border-slate-800 max-w-xl mx-auto">
            <p className="text-slate-400 text-sm">
              {isAr ? 'استخدم محرك البحث أعلاه لتتبع شحناتك' : 'Use the search box above to track your order.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
