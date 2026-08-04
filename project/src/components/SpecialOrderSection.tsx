import React, { useState } from 'react';
import { Language, Currency, SpecialRequest } from '../types';
import { Sparkles, Send, Upload, Check, AlertCircle } from 'lucide-react';

interface SpecialOrderSectionProps {
  language: Language;
  currency: Currency;
  onSubmitSpecialRequest: (req: Omit<SpecialRequest, 'id' | 'createdAt'>) => void;
}

export const SpecialOrderSection: React.FC<SpecialOrderSectionProps> = ({
  language,
  currency,
  onSubmitSpecialRequest,
}) => {
  const isAr = language === 'ar';

  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [customImage, setCustomImage] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !details) {
      showToast(isAr ? 'خطأ: يرجى تعبئة جميع الحقول المطلوبة (الاسم، الهاتف، التفاصيل)' : 'Error: Please complete all required fields (Name, Phone, Details)', 'error');
      return;
    }

    onSubmitSpecialRequest({
      customerName,
      companyName,
      phone,
      email,
      details,
      customImage,
      currency,
    });

    showToast(isAr ? 'تم استلام طلبك الخاص بنجاح! سيتواصل معك فريق التصدير في أقرب وقت.' : 'Special request received! Our sales team will get back to you shortly.', 'success');

    setCustomerName('');
    setCompanyName('');
    setPhone('');
    setEmail('');
    setDetails('');
    setCustomImage(undefined);
  };

  return (
    <section id="special-orders" className="py-16 bg-white/10 dark:bg-[#060D18]/20 text-white relative backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-[#C9A84C]" />
            <span>{isAr ? 'منطقة الطلبات والمواصفات الخاصة' : 'Special Order & Custom Quotation Area'}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">
            {isAr ? 'طلبات التعبئة الخاصة (Private Label) والمواصفات المخصصة' : 'Custom Packaging & Private Label Inquiries'}
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
            {isAr
              ? 'هل تحتاج إلى طلب صنف بخلطة خاصة، علامة تجارية مخصصة (Private Label)، أو شحنات قمح وأعلاف بكميات ضخمة؟ أرسل مواصفاتك مباشرة لشركة بن كليلة العامري'
              : 'Request specialized blends, custom private label branding, or bulk grain specifications'}
          </p>
        </div>

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="mb-6 max-w-xl mx-auto transition-all transform scale-100">
            <div
              className={`p-4 rounded-2xl shadow-xl flex items-center gap-3 text-xs md:text-sm font-extrabold border animate-bounce ${
                toastMessage.type === 'error'
                  ? 'bg-rose-950 text-rose-100 border-rose-600'
                  : 'bg-emerald-600 text-white border-emerald-400'
              }`}
            >
              {toastMessage.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              ) : (
                <Check className="w-5 h-5 text-white shrink-0" />
              )}
              <span>{toastMessage.text}</span>
            </div>
          </div>
        )}

        <div className="bg-white/20 dark:bg-[#0D1B2E]/35 border border-white/40 dark:border-[#C9A84C]/35 rounded-3xl p-6 md:p-10 max-w-3xl mx-auto shadow-2xl backdrop-blur-md">
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {isAr ? 'اسم المقدم / مسؤول المشتريات *' : 'Name / Purchasing Manager *'}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={isAr ? 'أدخل الاسم الكامل...' : 'Enter full name...'}
                  className="w-full bg-[#060D18] text-white border border-slate-700 rounded-xl px-3 py-2.5 focus:border-[#C9A84C] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {isAr ? 'اسم الشركة أو العلامة التجارية' : 'Company / Brand Name'}
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={isAr ? 'اسم المؤسسة المتقدمة...' : 'Company name...'}
                  className="w-full bg-[#060D18] text-white border border-slate-700 rounded-xl px-3 py-2.5 focus:border-[#C9A84C] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {isAr ? 'رقم الهاتف / الواتساب للتواصل *' : 'Phone / WhatsApp *'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+968 / +967 / +971..."
                  className="w-full bg-[#060D18] text-white border border-slate-700 rounded-xl px-3 py-2.5 focus:border-[#C9A84C] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {isAr ? 'البريد الإلكتروني الرسمي' : 'Official Email'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  className="w-full bg-[#060D18] text-white border border-slate-700 rounded-xl px-3 py-2.5 focus:border-[#C9A84C] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                {isAr ? 'تفاصيل المواصفات والكمية المطلوبة بالكامل *' : 'Detailed Specifications & Quantities *'}
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                placeholder={isAr ? 'اشرح بالتفصيل المواصفات الفنية، التعبئة الخاصة، الأوزان، أو متطلبات الشحن...' : 'Describe technical specifications, private label requirements, bulk tonnage...'}
                className="w-full bg-[#060D18] text-white border border-slate-700 rounded-xl px-3 py-2.5 focus:border-[#C9A84C] focus:outline-none"
                required
              />
            </div>

            {/* Custom File Attachment */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                {isAr ? 'مرفق صورة أو شعار العلامة الخاصة (اختياري):' : 'Attachment Image or Brand Logo (Optional):'}
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-[#13233A] hover:bg-[#1E3352] text-[#C9A84C] border border-[#C9A84C]/40 px-4 py-2 rounded-xl flex items-center gap-2 font-bold">
                  <Upload className="w-4 h-4" />
                  <span>{isAr ? 'رفع ملحق صورة' : 'Upload Image'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {customImage && (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    ✓ {isAr ? 'تم إرفاق الصورة' : 'Image attached'}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#C9A84C] hover:bg-[#D8B65C] text-[#0A1628] font-black text-sm py-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isAr ? 'إرسال طلب التسعيرة الخاصة' : 'Submit Special Quotation Request'}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
