import React, { useState, useEffect } from 'react';
import {
  Language,
  Currency,
  SiteSettings,
  Category,
  Product,
  HeroSlide,
  ImageItem,
  OrderItem,
  OrderForm,
  SpecialRequest,
  AuditLog,
  ProductUnit,
} from './types';
import { dbManager } from './lib/db';

import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ProductCatalog } from './components/ProductCatalog';
import { OrderPortal } from './components/OrderPortal';
import { ShippingCalculator } from './components/ShippingCalculator';
import { OrderTracker } from './components/OrderTracker';
import { SpecialOrderSection } from './components/SpecialOrderSection';
import { OfficialLetterModal } from './components/OfficialLetterModal';
import { ImageCropModal } from './components/ImageCropModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { AnimatedBackground, BgStyleMode } from './components/AnimatedBackground';

export function App() {
  const [isDbReady, setIsDbReady] = useState<boolean>(false);

  const [language, setLanguage] = useState<Language>('ar');
  const [currency, setCurrency] = useState<Currency>('OMR');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('app_theme_mode') as 'light' | 'dark') || 'light';
  });

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [imageLibrary, setImageLibrary] = useState<ImageItem[]>([]);
  const [orders, setOrders] = useState<OrderForm[]>([]);
  const [diagnosticLogs, setDiagnosticLogs] = useState<AuditLog[]>([]);
  const [undoStack, setUndoStack] = useState<Array<{ action: string; snapshot: any }>>([]);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);

  const publishCurrentState = async (password?: string) => {
    try {
      const current = await dbManager.getAllData();
      const response = await fetch('/api/site-state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password || settings?.adminPassword || 'SALALAH2026' },
        body: JSON.stringify(current),
      });
      if (!response.ok) throw new Error('Publish failed');
      const result = await response.json();
      setPublishedAt(result.updatedAt || new Date().toISOString());
      return true;
    } catch (error) {
      console.warn('Central publish unavailable; local changes remain available on this device.', error);
      return false;
    }
  };

  // B2B Active Order Items
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Modals state
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isOfficialLetterOpen, setIsOfficialLetterOpen] = useState<boolean>(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);

  // Image Crop Modal
  const [cropModalData, setCropModalData] = useState<{
    imageUrl: string;
    onSave: (croppedUrl: string) => void;
    onDelete?: () => void;
  } | null>(null);

  // Initialize DB & load persistent state
  useEffect(() => {
    async function loadData() {
      await dbManager.init();
      let state = await dbManager.getAllData();
      try {
        const response = await fetch('/api/site-state');
        const remote = await response.json();
        if (remote.state?.settings && remote.state?.products) {
          state = remote.state;
          setPublishedAt(remote.updatedAt || null);
        }
      } catch (error) {
        console.warn('Using local state because the central state endpoint is unavailable.', error);
      }

      setSettings(state.settings);
      setCategories(state.categories);
      setProducts(state.products);
      setHeroSlides(state.heroSlides);
      setImageLibrary(state.imageLibrary);
      setOrders(state.orders);
      setDiagnosticLogs(state.diagnosticLogs);
      setUndoStack(state.undoStack);

      setIsDbReady(true);
    }
    loadData();
  }, []);

  // Sync RTL / LTR document direction & Theme mode
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('app_theme_mode', theme);
  }, [theme]);

  if (!isDbReady || !settings) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-900 p-4">
        <div className="w-16 h-16 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-extrabold text-[#0A1628] mb-2">
          شركة بن كليلة العامري للتجارة والاستثمار
        </h2>
        <p className="text-xs text-slate-500">جاري تحميل البيانات والأصول...</p>
      </div>
    );
  }

  const isAr = language === 'ar';

  // Order Table Operations
  const handleAddProductToOrder = (product: Product, weight?: string, qty: number = 1, unit: ProductUnit = 'bag') => {
    const selectedWeight = weight || product.defaultWeight || product.weights[0] || 'Standard';
    setOrderItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.productId === product.id && i.weight === selectedWeight);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += qty;
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            productNameAr: product.nameAr,
            productNameEn: product.nameEn,
            weight: selectedWeight,
            quantity: qty,
            unit: unit || product.unit || 'bag',
            priceOption: product.priceOption,
            unitPriceOMR: product.fixedPriceOMR,
          },
        ];
      }
    });
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    setOrderItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = Math.max(1, newQty);
      return updated;
    });
  };

  const handleUpdateUnit = (index: number, newUnit: ProductUnit) => {
    setOrderItems((prev) => {
      const updated = [...prev];
      updated[index].unit = newUnit;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  // DB Sync Wrappers for Admin Panel
  const handleSaveSettings = async (newSettings: SiteSettings) => {
    await dbManager.saveSiteSettings(newSettings);
    setSettings(newSettings);
    await publishCurrentState(newSettings.adminPassword);
  };

  const handleSaveProduct = async (p: Product) => {
    await dbManager.saveProduct(p);
    setProducts(await dbManager.getProducts());
    await publishCurrentState();
  };

  const handleDeleteProduct = async (pId: string) => {
    await dbManager.deleteProduct(pId);
    setProducts(await dbManager.getProducts());
    await publishCurrentState();
    setUndoStack(await dbManager.getUndoStack());
  };

  const handleSaveCategory = async (c: Category) => {
    await dbManager.saveCategory(c);
    setCategories(await dbManager.getCategories());
    await publishCurrentState();
  };

  const handleDeleteCategory = async (cId: string) => {
    await dbManager.deleteCategory(cId);
    setCategories(await dbManager.getCategories());
    await publishCurrentState();
  };

  const handleSaveHeroSlide = async (s: HeroSlide) => {
    await dbManager.saveHeroSlide(s);
    setHeroSlides(await dbManager.getHeroSlides());
    await publishCurrentState();
  };

  const handleDeleteHeroSlide = async (sId: string) => {
    await dbManager.deleteHeroSlide(sId);
    setHeroSlides(await dbManager.getHeroSlides());
    await publishCurrentState();
    setUndoStack(await dbManager.getUndoStack());
  };

  const handleSaveImageItem = async (img: ImageItem) => {
    await dbManager.saveImageItem(img);
    setImageLibrary(await dbManager.getImageLibrary());
    await publishCurrentState();
  };

  const handleDeleteImageItem = async (imgId: string) => {
    await dbManager.deleteImageItem(imgId);
    setImageLibrary(await dbManager.getImageLibrary());
    await publishCurrentState();
    setUndoStack(await dbManager.getUndoStack());
  };

  const handleExportJSON = async () => {
    await dbManager.exportJSONBackup();
  };

  const handleImportJSON = async (jsonStr: string) => {
    const ok = await dbManager.importJSONBackup(jsonStr);
    if (ok) {
      const state = await dbManager.getAllData();
      setSettings(state.settings);
      setCategories(state.categories);
      setProducts(state.products);
      setHeroSlides(state.heroSlides);
      setImageLibrary(state.imageLibrary);
      setOrders(state.orders);
    }
    return ok;
  };

  const handleClearAllAssets = async () => {
    await dbManager.clearAllAssets();
    const state = await dbManager.getAllData();
    setSettings(state.settings);
    setProducts(state.products);
    setHeroSlides(state.heroSlides);
    setImageLibrary(state.imageLibrary);
  };

  const handleUndoDelete = async () => {
    const ok = await dbManager.undoLastDelete();
    if (ok) {
      const state = await dbManager.getAllData();
      setSettings(state.settings);
      setProducts(state.products);
      setHeroSlides(state.heroSlides);
      setImageLibrary(state.imageLibrary);
      setUndoStack(state.undoStack);
    }
    return ok;
  };

  const handleSubmitSpecialRequest = async (req: Omit<SpecialRequest, 'id' | 'createdAt'>) => {
    await dbManager.saveSpecialRequest(req);
  };

  const handleNavigateToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="min-h-screen selection:bg-[#C9A84C] selection:text-slate-900 font-sans antialiased relative transition-colors duration-300 overflow-x-hidden"
      style={{
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-main)',
      }}
    >
      {/* Dynamic Animated Background Canvas Across All Pages */}
      <AnimatedBackground
        styleMode={settings.animatedBgStyle || 'particles'}
        speed={settings.animatedBgSpeed || 2}
        opacity={settings.animatedBgOpacity ?? 80}
        theme={theme}
        onStyleChange={(newStyle: BgStyleMode) =>
          handleSaveSettings({ ...settings, animatedBgStyle: newStyle })
        }
        showQuickToggle={false}
      />

      {/* Optional Dynamic Global Background Image Overlay */}
      {settings.globalBgImage && (
        <div
          className="fixed inset-0 pointer-events-none z-0 transition-all duration-500"
          style={{
            backgroundImage: `url(${settings.globalBgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: `blur(${settings.globalBgBlur || 0}px)`,
            opacity: (settings.globalBgOpacity ?? 100) / 100,
          }}
        />
      )}

      {/* Top Company Announcement Marquee Ticker */}
      {settings.marqueeEnabled && (
        <div className="bg-[#C9A84C] text-[#0A1628] text-xs font-bold py-1.5 px-4 overflow-hidden shadow-inner flex items-center border-b border-[#0A1628]/20">
          <div className="whitespace-nowrap animate-marquee flex items-center gap-8 w-full">
            <span>{isAr ? settings.marqueeTextAr : settings.marqueeTextEn}</span>
            <span>✦</span>
            <span>{isAr ? 'الواتساب المباشر للطلبات: +96899088000' : 'Direct WhatsApp Orders: +96899088000'}</span>
            <span>✦</span>
            <span>{isAr ? 'الوكيل المعتمد لمطاحن صلالة والمطاحن العمانية' : 'Authorized Agent - Salalah & Oman Mills'}</span>
          </div>
        </div>
      )}

      {/* Main Navigation Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        currency={currency}
        onCurrencyChange={setCurrency}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenOfficialLetter={() => setIsOfficialLetterOpen(true)}
      />

      {/* Hero Section Carousel */}
      <HeroSection
        language={language}
        slides={heroSlides}
        settings={settings}
        onNavigateToCatalog={() => handleNavigateToSection('catalog')}
        onNavigateToOrder={() => handleNavigateToSection('order-portal')}
        onNavigateToShipping={() => handleNavigateToSection('shipping')}
      />

      {/* Corporate About Section */}
      <AboutSection language={language} settings={settings} />

      {/* Interactive Product Catalog */}
      <ProductCatalog
        language={language}
        currency={currency}
        categories={categories}
        products={products}
        onAddToOrder={handleAddProductToOrder}
      />

      {/* B2B Direct Order Portal */}
      <OrderPortal
        language={language}
        currency={currency}
        orderItems={orderItems}
        allProducts={products}
        onUpdateQuantity={handleUpdateQuantity}
        onUpdateUnit={handleUpdateUnit}
        onRemoveItem={handleRemoveItem}
        onAddProductToOrder={(p) => handleAddProductToOrder(p)}
        onClearOrder={() => setOrderItems([])}
        whatsappNumber={settings.whatsappNumber}
      />

      {/* Logistics & Shipping Calculator */}
      <ShippingCalculator
        language={language}
        currency={currency}
        settings={settings}
      />

      {/* Order Status Tracker */}
      <OrderTracker language={language} orders={orders} />

      {/* Special Orders & Private Label Requests */}
      <SpecialOrderSection
        language={language}
        currency={currency}
        onSubmitSpecialRequest={handleSubmitSpecialRequest}
      />

      {/* Footer Branding */}
      <Footer
        language={language}
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenOfficialLetter={() => setIsOfficialLetterOpen(true)}
      />

      {/* Floating Action Buttons */}
      <FloatingWhatsApp
        whatsappNumber={settings.whatsappNumber}
        onOpenAiAssistant={() => setIsAiDrawerOpen(true)}
        language={language}
      />

      {/* AI Smart Assistant Drawer */}
      {isAiDrawerOpen && (
        <AiAssistantDrawer
          language={language}
          currency={currency}
          products={products}
          onClose={() => setIsAiDrawerOpen(false)}
        />
      )}

      {/* Official Offer Letter Generator Modal */}
      {isOfficialLetterOpen && (
        <OfficialLetterModal
          language={language}
          currency={currency}
          settings={settings}
          orderItems={orderItems}
          onClose={() => setIsOfficialLetterOpen(false)}
        />
      )}

      {/* Admin Panel Password Protected Control Modal */}
      {isAdminOpen && (
        <AdminPanelModal
          language={language}
          settings={settings}
          products={products}
          categories={categories}
          heroSlides={heroSlides}
          imageLibrary={imageLibrary}
          diagnosticLogs={diagnosticLogs}
          undoStack={undoStack}
          onSaveSettings={handleSaveSettings}
          onSaveProduct={handleSaveProduct}
          onDeleteProduct={handleDeleteProduct}
          onSaveCategory={handleSaveCategory}
          onDeleteCategory={handleDeleteCategory}
          onSaveHeroSlide={handleSaveHeroSlide}
          onDeleteHeroSlide={handleDeleteHeroSlide}
          onSaveImageItem={handleSaveImageItem}
          onDeleteImageItem={handleDeleteImageItem}
          onExportJSON={handleExportJSON}
          onImportJSON={handleImportJSON}
          onClearAllAssets={handleClearAllAssets}
          onUndoDelete={handleUndoDelete}
          onOpenCropModal={(imgUrl, onSave, onDelete) =>
            setCropModalData({ imageUrl: imgUrl, onSave, onDelete })
          }
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Image Crop & Transformation Modal */}
      {cropModalData && (
        <ImageCropModal
          language={language}
          imageUrl={cropModalData.imageUrl}
          onCropSave={cropModalData.onSave}
          onDeleteImage={cropModalData.onDelete}
          onClose={() => setCropModalData(null)}
        />
      )}
    </div>
  );
}

export default App;
