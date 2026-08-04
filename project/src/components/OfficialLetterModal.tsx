import React, { useState } from 'react';
import { Language, Currency, OrderItem, SiteSettings } from '../types';
import { Printer, X, FileText } from 'lucide-react';

interface OfficialLetterModalProps {
  language: Language;
  currency: Currency;
  settings: SiteSettings;
  orderItems: OrderItem[];
  onClose: () => void;
}

export const OfficialLetterModal: React.FC<OfficialLetterModalProps> = ({
  language,
  settings,
  orderItems,
  onClose,
}) => {
  const isAr = language === 'ar';
  const [clientName, setClientName] = useState('اسم شركتكم الموقرة');
  const [attnPerson, setAttnPerson] = useState('عناية قسم المشتريات والتوريد / المحترمين');
  const [letterSubject, setLetterSubject] = useState('عرض أسعار وتوريد منتجات دقيق ومعكرونة الخريف والمواد الغذائية');

  const handlePrint = () => {
    window.print();
  };

  const todayDate = new Date().toLocaleDateString(isAr ? 'ar-OM' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl max-w-4xl w-full p-6 md:p-10 shadow-2xl relative my-8 print:p-0 print:shadow-none print:w-full print:max-w-none print:my-0">
        {/* Modal Non-Print Controls */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2 text-[#0A1628] font-bold">
            <FileText className="w-5 h-5 text-[#C9A84C]" />
            <span>{isAr ? 'مولد الخطاب والعرض التجاري الرسمي' : 'Official Commercial Letter Generator'}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#0A1628] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#13233A] transition shadow"
            >
              <Printer className="w-4 h-4 text-[#C9A84C]" />
              <span>{isAr ? 'طباعة الخطاب (Print PDF)' : 'Print Letter'}</span>
            </button>
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-black text-xl">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Customizable Fields Input (Hidden on Print) */}
        <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs print:hidden">
          <div>
            <label className="block text-slate-700 font-bold mb-1">اسم العميل / المؤسسة:</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full border p-2 rounded bg-white text-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">عناية الشخص المسؤول:</label>
            <input
              type="text"
              value={attnPerson}
              onChange={(e) => setAttnPerson(e.target.value)}
              className="w-full border p-2 rounded bg-white text-slate-900"
            />
          </div>
        </div>

        {/* Printable Official Letter Content */}
        <div className="border-4 border-[#0A1628] p-8 md:p-12 relative bg-white min-h-[700px] flex flex-col justify-between">
          {/* Letterhead Header */}
          <div>
            <div className="flex items-center justify-between border-b-2 border-[#C9A84C] pb-6 mb-8 gap-4">
              <div className="text-right">
                <h1 className="text-xl md:text-2xl font-black text-[#0A1628] tracking-tight">
                  شركة بن كليلة العامري للتجارة والاستثمار ش.م.م
                </h1>
                <p className="text-xs text-[#C9A84C] font-bold mt-0.5">
                  Bin Kalilah Al-Aamri Trading & Investment Co. LLC
                </p>
                <p className="text-[10px] text-slate-600 mt-1">
                  الوكيل المعتمد لمطاحن صلالة ومطاحن العمانية - صلالة، سلطنة عُمان
                </p>
              </div>

              <img
                src={settings.logo}
                alt="Logo"
                className="w-20 h-20 object-contain p-1 border border-[#C9A84C] rounded"
              />

              <div className="text-left text-xs text-slate-600 leading-snug">
                <p className="font-bold text-[#0A1628]">Salalah, Sultanate of Oman</p>
                <p>Tel: {settings.phone1}</p>
                <p>Email: {settings.emails[0]}</p>
                <p className="font-mono text-[10px] mt-1">Ref: BKA-OFFER-{Date.now().toString().slice(-6)}</p>
              </div>
            </div>

            {/* Date and Address */}
            <div className="flex justify-between items-start mb-6 text-sm">
              <div>
                <p className="font-bold text-[#0A1628] text-base mb-1">المحترمين : {clientName}</p>
                <p className="text-xs text-slate-700">{attnPerson}</p>
              </div>
              <div className="text-xs text-slate-600 font-mono">
                <p>التاريخ: {todayDate}</p>
              </div>
            </div>

            {/* Subject */}
            <div className="bg-[#0A1628] text-white p-3 rounded text-center text-sm font-bold mb-6 border-b-2 border-[#C9A84C]">
              الموضوع: {letterSubject}
            </div>

            {/* Letter Body Body Text */}
            <div className="text-xs md:text-sm text-slate-800 leading-relaxed mb-6 space-y-3">
              <p>السلام عليكم ورحمة الله وبركاته،،، وبعد</p>

              <p className="text-justify">
                يسرنا في شركة بن كليلة العامري للتجارة والاستثمار ش.م.م، بصفتنا الوكيل الإقليمي المعتمد لمطاحن صلالة (منتجات الخريف) والمطاحن العمانية (منتجات بركات)، أن نرفع لكم هذا العرض التجاري التنافسي لتوريد أجود أصناف الدقيق والباستا والسكر البرازيلي والحليب المجفف، المطابقة لأعلى معايير الجودة العمانية والعالمية المعتمدة.
              </p>

              {/* Items Table */}
              {orderItems.length > 0 && (
                <div className="my-6">
                  <h4 className="font-bold text-[#0A1628] text-xs mb-2">جدول أصناف العرض المرفق:</h4>
                  <table className="w-full text-xs border border-slate-300 border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-[#0A1628] font-bold border-b border-slate-300">
                        <th className="border p-2 text-right">المنتج والصنف</th>
                        <th className="border p-2 text-center">الوزن التعبئة</th>
                        <th className="border p-2 text-center">الكمية والوحدة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-200">
                          <td className="border p-2 font-bold">{item.productNameAr}</td>
                          <td className="border p-2 text-center">{item.weight}</td>
                          <td className="border p-2 text-center">{item.quantity} {item.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <p>
                <strong>شروط التسليم واللوجستيات:</strong> التسليم والتنزيل عبر أسطول الشحن البحري أو البري المباشر إلى مستودعاتكم وفق أعلى معايير السلامة والأمان.
              </p>
            </div>
          </div>

          {/* Footer Official Stamp & Signature */}
          <div className="pt-8 border-t border-slate-300 flex items-center justify-between text-xs">
            <div className="text-center">
              <p className="font-bold text-[#0A1628] mb-1">قسم المبيعات والتصدير بالجملة</p>
              <p className="text-slate-600">شركة بن كليلة العامري</p>
            </div>

            {/* Official Stamp Simulation */}
            <div className="w-28 h-28 rounded-full border-2 border-dashed border-[#0A1628] p-2 flex flex-col items-center justify-center text-center opacity-80 transform -rotate-12 bg-amber-50">
              <span className="text-[9px] font-black text-[#0A1628]">شركة بن كليلة العامري</span>
              <span className="text-[8px] text-[#C9A84C] font-bold">صلالة - سلطنة عمان</span>
              <span className="text-[8px] text-emerald-800 font-bold">ختم اعتماد الشحنات</span>
            </div>

            <div className="text-center">
              <p className="font-bold text-[#0A1628] mb-1">إدارة الشركة</p>
              <p className="text-slate-600">التوقيع والاعتماد الرسميين</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
