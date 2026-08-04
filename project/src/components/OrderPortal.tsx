import React, { useState } from 'react';
import { Language, Currency, OrderItem, ProductUnit, Product } from '../types';
import { CURRENCY_RATES } from '../data/defaultData';
import { Send, Trash2, Plus, ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react';

interface OrderPortalProps {
  language: Language;
  currency: Currency;
  orderItems: OrderItem[];
  allProducts: Product[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onUpdateUnit: (index: number, newUnit: ProductUnit) => void;
  onRemoveItem: (index: number) => void;
  onAddProductToOrder: (p: Product) => void;
  onClearOrder: () => void;
  whatsappNumber: string;
}

export const OrderPortal: React.FC<OrderPortalProps> = ({
  language,
  currency,
  orderItems,
  allProducts,
  onUpdateQuantity,
  onUpdateUnit,
  onRemoveItem,
  onAddProductToOrder,
  onClearOrder,
  whatsappNumber,
}) => {
  const isAr = language === 'ar';

  const [customerName, setCustomerName] = useState('');
  const [region, setRegion] = useState('');
  const [phone, setPhone] = useState('');
  const [businessType, setBusinessType] = useState('wholesaler');
  const [notes, setNotes] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currRate = CURRENCY_RATES[currency] || CURRENCY_RATES.OMR;

  // Calculate total price
  const calculateTotal = () => {
    let sumOMR = 0;
    orderItems.forEach((item) => {
      if (item.priceOption === 'fixed') {
        sumOMR += item.unitPriceOMR * item.quantity;
      }
    });
    return (sumOMR * currRate.rateToOMR).toFixed(2);
  };

  const handleAddSelectedProduct = () => {
    if (!selectedProductId) {
      showToast(isAr ? 'يرجى اختيار منتج من القائمة أولاً' : 'Please select a product from the list first', 'error');
      return;
    }
    const prod = allProducts.find((p) => p.id === selectedProductId);
    if (prod) {
      onAddProductToOrder(prod);
      setSelectedProductId('');
      showToast(isAr ? `تمت إضافة "${prod.nameAr}" لجدول الطلب بنجاح` : `Added "${prod.nameEn}" to order table successfully`, 'success');
    }
  };

  const handleQuantityInputChange = (idx: number, val: number) => {
    if (isNaN(val) || val < 1) {
      onUpdateQuantity(idx, 1);
      showToast(isAr ? 'الكمية يجب أن تكون 1 على الأقل' : 'Quantity must be at least 1', 'error');
      return;
    }
    onUpdateQuantity(idx, val);
    const item = orderItems[idx];
    if (item) {
      const name = isAr ? item.productNameAr : item.productNameEn;
      showToast(isAr ? `تم تحديث كمية "${name}" إلى ${val}` : `Updated quantity of "${name}" to ${val}`, 'success');
    }
  };

  const handleRemoveSingleItem = (idx: number) => {
    const item = orderItems[idx];
    onRemoveItem(idx);
    if (item) {
      const name = isAr ? item.productNameAr : item.productNameEn;
      showToast(isAr ? `تم حذف "${name}" من جدول الطلب` : `Removed "${name}" from order table`, 'success');
    }
  };

  const handleSendWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      showToast(isAr ? 'خطأ: يرجى إضافة منتج واحد على الأقل لجدول الطلب' : 'Error: Please add at least one product to the order table', 'error');
      return;
    }
    if (!customerName || !phone) {
      showToast(isAr ? 'خطأ: يرجى إدخال اسم العميل ورقم الهاتف' : 'Error: Please enter customer name and phone number', 'error');
      return;
    }

    const currSymbol = isAr ? currRate.symbolAr : currRate.symbolEn;

    // Format WhatsApp message
    let msg = `*طلب جملة جديد - شركة بن كليلة العامري للتجارة والاستثمار ش.م.م*\n`;
    msg += `--------------------------------------------------\n`;
    msg += `👤 *اسم العميل:* ${customerName}\n`;
    msg += `📍 *المنطقة/المدينة:* ${region || 'غير محدد'}\n`;
    msg += `📞 *رقم الهاتف:* ${phone}\n`;
    msg += `🏢 *نوع النشاط:* ${businessType}\n`;
    msg += `💱 *العملة المختارة:* ${currency} (${currSymbol})\n\n`;

    msg += `📦 *المنتجات المطلوبة:*\n`;
    orderItems.forEach((item, idx) => {
      const name = isAr ? item.productNameAr : item.productNameEn;
      msg += `${idx + 1}. ${name} - الوزن: (${item.weight}) - الكمية: [${item.quantity} ${item.unit}]\n`;
    });

    if (notes) {
      msg += `\n📝 *ملاحظات إضافية:* ${notes}\n`;
    }

    msg += `--------------------------------------------------\n`;
    msg += `💰 *إجمالي التكلفة التقديرية:* ${calculateTotal()} ${currSymbol}\n`;
    msg += `✅ يرجى موافاتنا بالعرض التجاري النهائي وتأكيد موعد الشحن.\n`;

    showToast(isAr ? 'جاري تجهيز الطلب وتحويلك المباشر للواتساب...' : 'Dispatching order to WhatsApp...', 'success');

    const cleanNum = whatsappNumber.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <section id="order-portal" className="py-16 bg-white/10 dark:bg-[#081220]/20 text-slate-900 dark:text-white relative backdrop-blur-md transition-colors">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 transform scale-100">
          <div
            className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-extrabold text-xs md:text-sm border animate-bounce ${
              toastMessage.type === 'error'
                ? 'bg-rose-950 text-rose-100 border-rose-600'
                : 'bg-[#0A1628] text-[#C9A84C] border-[#C9A84C]'
            }`}
          >
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 text-[#C9A84C] shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#0A1628] dark:text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-md shadow-sm">
            <ShoppingCart className="w-4 h-4 text-[#C9A84C]" />
            <span>{isAr ? 'بوابة طلبات الجملة المباشرة' : 'B2B Wholesale Order Portal'}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">
            {isAr ? 'نموذج إرسال الطلبيات عبر الواتساب المباشر' : 'Direct Wholesale Order Dispatch via WhatsApp'}
          </h2>
          <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
            {isAr
              ? 'اختر منتجاتك وحدد الكميات المطلوبة ليتم إرسالها فوراً لشركة بن كليلة العامري على الرقم +96899088000'
              : 'Assemble your bulk products and dispatch formatted order details directly to our sales desk (+96899088000)'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Info Form */}
          <div className="lg:col-span-1 bg-white/20 dark:bg-[#0D1B2E]/35 p-6 md:p-8 rounded-3xl border border-white/40 dark:border-[#C9A84C]/30 shadow-2xl backdrop-blur-md">
            <h3 className="text-lg font-bold text-[#0A1628] dark:text-white mb-4 pb-2 border-b border-white/30 dark:border-slate-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#C9A84C]" />
              <span>{isAr ? 'بيانات جهة الطلب' : 'Customer & Business Details'}</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isAr ? 'اسم العميل / الشركة *' : 'Customer / Company Name *'}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={isAr ? 'مثال: اسم شركتكم الموقرة' : 'e.g., Your Company Name'}
                  className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 focus:border-[#C9A84C] focus:outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isAr ? 'المنطقة والمدينة (وجهة التوصيل) *' : 'Delivery Area / City *'}
                </label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder={isAr ? 'مثال: المهرة / سيئون / عدن / دبي' : 'e.g., Mukalla / Aden / Dubai'}
                  className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 focus:border-[#C9A84C] focus:outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {isAr ? 'رقم الهاتف للتواصل *' : 'Phone / WhatsApp Number *'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+968 / +967 / +971..."
                  className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 focus:border-[#C9A84C] focus:outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isAr ? 'نوع النشاط التجاري' : 'Business Type'}
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 focus:border-[#C9A84C] focus:outline-none cursor-pointer font-semibold"
                >
                  <option value="bakery">{isAr ? 'مخبز / مخابز آلي' : 'Bakery'}</option>
                  <option value="wholesaler">{isAr ? 'تاجر جملة وتوزيع' : 'Wholesaler / Distributor'}</option>
                  <option value="grocery">{isAr ? 'محل تجاري / سوبرماركت' : 'Grocery / Supermarket'}</option>
                  <option value="restaurant">{isAr ? 'مطعم / فندق' : 'Restaurant / Hotel'}</option>
                  <option value="farm">{isAr ? 'مزرعة / ثروة حيوانية' : 'Farm / Livestock'}</option>
                  <option value="exporter">{isAr ? 'مستورد / مصدر إقليمي' : 'Importer / Exporter'}</option>
                  <option value="other">{isAr ? 'نشاط آخر' : 'Other'}</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isAr ? 'ملاحظات وتفاصيل التغليف الخاصة' : 'Additional Notes / Packaging'}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder={isAr ? 'اكتب أي شروط خاصة بالشحن أو التعبئة...' : 'Special packing or shipping terms...'}
                  className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 focus:border-[#C9A84C] focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* Interactive Products Table & Total Summary */}
          <div className="lg:col-span-2 bg-white/80 dark:bg-[#0D1B2E]/80 p-6 rounded-2xl border border-slate-200/80 dark:border-[#C9A84C]/25 shadow-xl flex flex-col justify-between backdrop-blur-sm">
            <div>
              {/* Quick Add Dropdown */}
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-xs font-extrabold text-[#0A1628] shrink-0">
                  {isAr ? 'إضافة منتج إضافي للجدول:' : 'Quick Add Product:'}
                </span>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-white text-slate-900 font-medium text-xs border border-slate-200 rounded-lg p-2 focus:outline-none"
                >
                  <option value="">{isAr ? '-- اختر منتجاً من القائمة --' : '-- Select Product --'}</option>
                  {allProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {isAr ? p.nameAr : p.nameEn}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddSelectedProduct}
                  className="w-full sm:w-auto bg-[#0A1628] text-[#C9A84C] font-extrabold text-xs px-4 py-2 rounded-lg hover:bg-slate-800 transition flex items-center justify-center gap-1 shrink-0 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? 'إضافة' : 'Add'}</span>
                </button>
              </div>

              {/* Order Items Table */}
              {orderItems.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <p className="text-slate-600 font-bold text-sm mb-1">
                    {isAr ? 'جدول الطلب فارغ حالياً' : 'Your order table is currently empty'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {isAr ? 'تصفح الكتالوج واضغط "أضف للطلب" لإدراج المنتجات هنا' : 'Click "Add to Order" in the catalog to build your invoice'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#0A1628] text-[#C9A84C] font-extrabold">
                        <th className="p-3 text-right">{isAr ? 'المنتج' : 'Product'}</th>
                        <th className="p-3 text-center">{isAr ? 'الوزن' : 'Weight'}</th>
                        <th className="p-3 text-center">{isAr ? 'الكمية' : 'Qty'}</th>
                        <th className="p-3 text-center">{isAr ? 'الوحدة' : 'Unit'}</th>
                        <th className="p-3 text-center">{isAr ? 'إجراء' : 'Action'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {orderItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition">
                          <td className="p-3 font-extrabold text-slate-900 text-right">
                            {isAr ? item.productNameAr : item.productNameEn}
                          </td>
                          <td className="p-3 text-center text-slate-600 font-mono font-bold">
                            {item.weight}
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleQuantityInputChange(idx, parseInt(e.target.value))}
                              className="w-16 bg-slate-50 text-center border border-slate-200 rounded p-1 font-bold text-slate-900 focus:border-[#C9A84C] focus:outline-none"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <select
                              value={item.unit}
                              onChange={(e) => onUpdateUnit(idx, e.target.value as ProductUnit)}
                              className="bg-slate-50 border border-slate-200 rounded p-1 text-slate-800 text-xs font-semibold"
                            >
                              <option value="bag">{isAr ? 'كيس (Bag)' : 'Bag'}</option>
                              <option value="carton">{isAr ? 'كرتون (Carton)' : 'Carton'}</option>
                              <option value="ton">{isAr ? 'طن (Ton)' : 'Ton'}</option>
                              <option value="kg">{isAr ? 'كجم (Kg)' : 'Kg'}</option>
                            </select>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleRemoveSingleItem(idx)}
                              className="text-rose-600 hover:text-rose-700 p-1 rounded transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Total Summary & WhatsApp Dispatch */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 font-bold block mb-0.5">
                  {isAr ? 'إجمالي التكلفة التقديرية للطلب:' : 'Estimated Order Total:'}
                </span>
                <span className="text-2xl font-black text-[#0A1628] font-mono">
                  {calculateTotal()} {isAr ? currRate.symbolAr : currRate.symbolEn}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {orderItems.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearOrder}
                    className="text-xs text-rose-400 hover:underline px-3 py-2"
                  >
                    {isAr ? 'محي الجدول' : 'Clear All'}
                  </button>
                )}

                <button
                  onClick={handleSendWhatsAppOrder}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg transition-transform active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>{isAr ? 'إرسال الطلب عبر الواتساب' : 'Dispatch via WhatsApp'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
