import React, { useState } from 'react';
import { Language, Currency, Category, Product, ProductUnit } from '../types';
import { CURRENCY_RATES } from '../data/defaultData';
import { Search, ShoppingBag, Eye, Check, Tag } from 'lucide-react';

interface ProductCatalogProps {
  language: Language;
  currency: Currency;
  categories: Category[];
  products: Product[];
  onAddToOrder: (product: Product, weight: string, quantity: number, unit: ProductUnit) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  language,
  currency,
  categories,
  products,
  onAddToOrder,
}) => {
  const isAr = language === 'ar';
  const [selectedCatId, setSelectedCatId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWeights, setSelectedWeights] = useState<Record<string, string>>({});
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const currRate = CURRENCY_RATES[currency] || CURRENCY_RATES.OMR;

  // Filter products by category and search query
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCatId === 'all' || p.categoryId === selectedCatId;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      p.nameAr.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      p.descriptionAr.toLowerCase().includes(q) ||
      p.descriptionEn.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const handleWeightChange = (productId: string, weight: string) => {
    setSelectedWeights((prev) => ({ ...prev, [productId]: weight }));
  };

  const handleAdd = (product: Product) => {
    const weight = selectedWeights[product.id] || product.defaultWeight || product.weights[0] || 'Standard';
    onAddToOrder(product, weight, 1, product.unit || 'bag');
    setAddedToast(isAr ? `تمت إضافة "${product.nameAr}" لطلب الجملة` : `Added "${product.nameEn}" to order`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  const formatPrice = (p: Product) => {
    if (p.priceOption === 'market') {
      return isAr ? 'حسب سعر السوق اليوم' : 'Market Rate Today';
    }
    const converted = (p.fixedPriceOMR * currRate.rateToOMR).toFixed(2);
    const symbol = isAr ? currRate.symbolAr : currRate.symbolEn;
    return `${converted} ${symbol}`;
  };

  return (
    <section id="catalog" className="py-16 bg-white/20 dark:bg-[#0A1628]/30 text-slate-900 dark:text-white relative backdrop-blur-md transition-colors">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#C9A84C] text-[#0A1628] font-extrabold px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-amber-300 animate-bounce">
          <Check className="w-5 h-5 text-[#0A1628]" />
          <span>{addedToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/20 text-[#0A1628] dark:text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-3 border border-[#C9A84C]/40 backdrop-blur-md shadow-sm">
            <Tag className="w-4 h-4 text-[#C9A84C]" />
            <span>{isAr ? 'الكتالوج الرقمي للمنتجات' : 'Digital Product Catalog'}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">
            {isAr ? 'تشكيلة المنتجات العمانية والأغذية المعتمدة' : 'Omani Food Products & Bulk Supplies'}
          </h2>
          <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">
            {isAr
              ? 'دقيق الخريف، معكرونة الباستا، السكر البرازيلي، الحليب المجفف، الأعلاف والحبوب الموردة للمشترين بالجملة'
              : 'Flour, Pasta, Refined Sugar, Milk Powder, Grains & Feeds for B2B Wholesale Distribution'}
          </p>
        </div>

        {/* Search Bar & Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/30 dark:bg-[#0D1B2E]/40 p-4 rounded-2xl border border-white/40 dark:border-[#C9A84C]/30 shadow-xl backdrop-blur-md">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث عن منتج (دقيق، معكرونة، سكر...)' : 'Search products (Flour, Pasta, Sugar...)'}
              className="w-full bg-white/50 dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-white/50 dark:border-slate-700/60 focus:border-[#C9A84C] focus:outline-none text-sm shadow-inner backdrop-blur-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Category Pills Nav */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-thin">
            <button
              onClick={() => setSelectedCatId('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCatId === 'all'
                  ? 'bg-[#0A1628] text-[#C9A84C] shadow-lg border border-[#C9A84C]/40'
                  : 'bg-white/40 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 hover:text-slate-900 border border-white/50 dark:border-slate-700/50 hover:bg-white/60 backdrop-blur-sm'
              }`}
            >
              {isAr ? 'جميع الأقسام' : 'All Categories'} ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCatId === cat.id
                    ? 'bg-[#0A1628] text-[#C9A84C] shadow-lg border border-[#C9A84C]/40'
                    : 'bg-white/40 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 hover:text-slate-900 border border-white/50 dark:border-slate-700/50 hover:bg-white/60 backdrop-blur-sm'
                }`}
              >
                {isAr ? cat.nameAr : cat.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid with Clean Transparent Cards & Soft Shadows */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white/20 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-300/60 dark:border-slate-800 backdrop-blur-md">
            <p className="text-slate-600 dark:text-slate-300 font-semibold text-lg">
              {isAr ? 'لا توجد منتجات تطابق البحث الحالية' : 'No products found matching query'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p) => {
              const currentWeight = selectedWeights[p.id] || p.defaultWeight || p.weights[0] || (isAr ? 'قياسي' : 'Standard');

              return (
                <div
                  key={p.id}
                  className="group rounded-[2rem] border border-white/40 dark:border-[#C9A84C]/30 hover:border-[#C9A84C] transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-2 flex flex-col justify-between overflow-hidden relative backdrop-blur-md p-4 [transform-style:preserve-3d] [perspective:1200px]"
                  style={{
                    background: p.cardAccent === 'gold' ? 'linear-gradient(145deg, rgba(201,168,76,0.34), rgba(255,255,255,0.10))' : p.cardAccent === 'sky' ? 'linear-gradient(145deg, rgba(125,211,252,0.34), rgba(255,255,255,0.10))' : p.cardAccent === 'transparent' ? 'rgba(255,255,255,0.05)' : 'linear-gradient(145deg, rgba(10,22,40,0.72), rgba(35,64,94,0.38))',
                    opacity: (p.cardOpacity ?? 100) / 100,
                    backdropFilter: `blur(${p.cardBlur ?? 14}px)`,
                  }}
                >
                  {/* Image Container with Weight Badge */}
                  <div
                    onClick={() => setActiveModalProduct(p)}
                    className="relative h-56 bg-white/25 dark:bg-[#081220]/40 rounded-2xl border border-white/30 dark:border-white/10 overflow-hidden flex items-center justify-center p-4 mb-3 cursor-pointer group-hover:bg-white/40 dark:group-hover:bg-[#081220]/60 transition-colors backdrop-blur-sm"
                  >
                    <img
                      src={p.image}
                      alt={p.nameEn}
                      className="transition-transform duration-500 group-hover:scale-105 drop-shadow-lg"
                      style={{
                        width: `${p.imageWidth ?? 100}%`,
                        height: `${p.imageHeight ?? 100}%`,
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: p.imageFit ?? 'contain',
                        opacity: (p.imageOpacity ?? 100) / 100,
                        filter: `blur(${p.imageBlur ?? 0}px) drop-shadow(0 16px 14px rgba(0,0,0,0.22))`,
                      }}
                    />

                    {/* Weight Badge on Top Right */}
                    <div className="absolute top-2.5 right-2.5 bg-[#0A1628]/90 text-[#C9A84C] px-3 py-1 rounded-full text-[11px] font-bold border border-[#C9A84C]/40 shadow backdrop-blur-md">
                      {currentWeight}
                    </div>

                    {/* Quick Eye Detail Icon */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalProduct(p);
                      }}
                      className="absolute bottom-2.5 left-2.5 p-1.5 bg-slate-900/80 hover:bg-[#C9A84C] text-slate-300 hover:text-[#0A1628] rounded-lg transition shadow backdrop-blur"
                      title={isAr ? 'التفاصيل' : 'Details'}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title and Short Description */}
                  <div className="flex-1 flex flex-col justify-between px-1">
                    <div>
                      <h3
                        onClick={() => setActiveModalProduct(p)}
                        className="text-base font-extrabold text-slate-900 dark:text-white mb-1 leading-snug line-clamp-2 cursor-pointer hover:text-[#C9A84C] transition-colors"
                      >
                        {isAr ? p.nameAr : p.nameEn}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4 font-medium">
                        {isAr ? p.descriptionAr : p.descriptionEn}
                      </p>
                    </div>

                    {/* Bottom Row: Price & + فرص Button */}
                    <div className="pt-3 border-t border-slate-200/40 dark:border-slate-700/40 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block uppercase tracking-wider">
                          {isAr ? 'بيس' : 'Base'}
                        </span>
                        <span className="text-xs sm:text-sm font-black text-[#0A1628] dark:text-[#C9A84C]">
                          {formatPrice(p)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAdd(p)}
                        className="flex items-center gap-1.5 bg-[#0A1628] hover:bg-slate-800 text-white font-black text-xs px-3.5 py-2 rounded-full transition-all active:scale-95 shadow-md border border-slate-700"
                      >
                        <div className="w-3.5 h-3.5 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C] flex items-center justify-center text-[#C9A84C]">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span>{isAr ? 'فرص +' : '+ Opportunities'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Details Modal View */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 text-slate-900 relative shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <button
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 p-2 rounded-lg bg-slate-100"
            >
              ✕
            </button>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/2 h-64 bg-slate-50 rounded-xl p-4 flex items-center justify-center border border-slate-200 shadow-inner">
                <img
                  src={activeModalProduct.image}
                  alt={activeModalProduct.nameEn}
                  className="max-h-full max-w-full object-contain drop-shadow-xl"
                />
              </div>

              <div className="w-full md:w-1/2">
                <div className="inline-block bg-[#0A1628] text-[#C9A84C] px-3 py-1 rounded-full text-xs font-bold mb-2">
                  {isAr ? 'معتمد 100% حلال' : '100% Halal Certified'}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  {isAr ? activeModalProduct.nameAr : activeModalProduct.nameEn}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {isAr ? activeModalProduct.descriptionAr : activeModalProduct.descriptionEn}
                </p>

                <div className="mb-4">
                  <span className="text-xs font-bold text-[#0A1628] block mb-1">
                    {isAr ? 'الأوزان المتوفرة:' : 'Available Pack Sizes:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeModalProduct.weights.map((w) => (
                      <span
                        key={w}
                        className="bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-lg border border-slate-200 font-bold"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-lg font-black text-[#0A1628] mb-6">
                  {formatPrice(activeModalProduct)}
                </div>

                <button
                  onClick={() => {
                    handleAdd(activeModalProduct);
                    setActiveModalProduct(null);
                  }}
                  className="w-full py-3 bg-[#C9A84C] text-[#0A1628] font-black rounded-xl hover:bg-[#b8953c] transition shadow-md"
                >
                  {isAr ? 'إضافة إلى نموذج الطلب بالجملة' : 'Add to B2B Order Form'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
