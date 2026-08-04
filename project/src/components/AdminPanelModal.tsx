import React, { useState, useRef } from 'react';
import { Language, Product, Category, HeroSlide, SiteSettings, ImageItem, AuditLog, NavLinkItem } from '../types';
import { Lock, Plus, Trash2, Edit3, Save, Download, Upload, RotateCcw, Image as ImageIcon, Settings, Database, FileCode, Check, Eye, X, Layout, Navigation, Sparkles } from 'lucide-react';

interface AdminPanelModalProps {
  language: Language;
  settings: SiteSettings;
  products: Product[];
  categories: Category[];
  heroSlides: HeroSlide[];
  imageLibrary: ImageItem[];
  diagnosticLogs: AuditLog[];
  undoStack: Array<{ action: string; snapshot: any }>;
  onSaveSettings: (newSettings: SiteSettings) => Promise<void>;
  onSaveProduct: (p: Product) => Promise<void>;
  onDeleteProduct: (pId: string) => Promise<void>;
  onSaveCategory: (c: Category) => Promise<void>;
  onDeleteCategory: (cId: string) => Promise<void>;
  onSaveHeroSlide: (s: HeroSlide) => Promise<void>;
  onDeleteHeroSlide: (sId: string) => Promise<void>;
  onSaveImageItem: (img: ImageItem) => Promise<void>;
  onDeleteImageItem: (imgId: string) => Promise<void>;
  onExportJSON: () => Promise<void>;
  onImportJSON: (jsonStr: string) => Promise<boolean>;
  onClearAllAssets: () => Promise<void>;
  onUndoDelete: () => Promise<boolean>;
  onOpenCropModal: (imgUrl: string, onSave: (newUrl: string) => void, onDelete?: () => void) => void;
  onClose: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  language,
  settings,
  products,
  categories,
  heroSlides,
  imageLibrary,
  diagnosticLogs,
  undoStack,
  onSaveSettings,
  onSaveProduct,
  onDeleteProduct,
  onSaveCategory,
  onDeleteCategory,
  onSaveHeroSlide,
  onDeleteHeroSlide,
  onSaveImageItem,
  onDeleteImageItem,
  onExportJSON,
  onImportJSON,
  onClearAllAssets,
  onUndoDelete,
  onOpenCropModal,
  onClose,
}) => {
  const isAr = language === 'ar';

  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'header' | 'products' | 'background' | 'slideshow' | 'appearance' | 'library' | 'contacts' | 'backup' | 'logs'>('header');
  const [saveStatus, setSaveStatus] = useState<string>('Saved');

  // Form states for Product Edit
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Settings form state
  const [localSettings, setLocalSettings] = useState<SiteSettings>({ ...settings });

  // Navigation Links State inside Admin
  const [navLinks, setNavLinks] = useState<NavLinkItem[]>(
    localSettings.headerNavLinks && localSettings.headerNavLinks.length > 0
      ? localSettings.headerNavLinks
      : [
          { id: 'nav_catalog', labelAr: 'الكتالوج الرقمي', labelEn: 'Product Catalog', href: '#catalog' },
          { id: 'nav_about', labelAr: 'عن الشركة', labelEn: 'About Us', href: '#about' },
          { id: 'nav_order', labelAr: 'طلب جملة مباشر', labelEn: 'B2B Wholesale Order', href: '#order-portal' },
          { id: 'nav_shipping', labelAr: 'حاسبة الشحن', labelEn: 'Shipping Calculator', href: '#shipping' },
          { id: 'nav_tracker', labelAr: 'تتبع الطلبات', labelEn: 'Order Tracker', href: '#tracker' },
          { id: 'nav_special', labelAr: 'طلبات خاصة', labelEn: 'Special Requests', href: '#special-orders' },
        ]
  );

  const [newNavLink, setNewNavLink] = useState<{ labelAr: string; labelEn: string; href: string }>({
    labelAr: '',
    labelEn: '',
    href: '#',
  });

  // Explicit File Input Refs
  const productFileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const globalBgFileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const libraryFileInputRef = useRef<HTMLInputElement>(null);

  const handleLibraryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file, async (url) => {
      const newImg: ImageItem = {
        id: 'img_' + Date.now(),
        url,
        category: 'general',
        name: file.name || 'صورة مخصصة',
        dateAdded: new Date().toLocaleDateString(),
      };
      triggerSaveStatus();
      await onSaveImageItem(newImg);
    });
  };

  // Handle password authentication without displaying password hint
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === (settings.adminPassword || 'SALALAH2026')) {
      setIsAuthenticated(true);
    } else {
      alert(isAr ? 'كلمة المرور غير صحيحة!' : 'Incorrect password!');
    }
  };

  const triggerSaveStatus = () => {
    setSaveStatus(isAr ? 'جاري الحفظ...' : 'Saving...');
    setTimeout(() => setSaveStatus(isAr ? 'تم الحفظ بنجاح' : 'Saved'), 1000);
  };

  // Product Image File Upload Handler
  const handleProductFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;
    processImageFile(file, (url) => {
      setEditingProduct({ ...editingProduct, image: url });
      onSaveImageItem({
        id: 'img_' + Date.now(),
        url,
        category: 'product',
        name: file.name || editingProduct.nameEn,
        dateAdded: new Date().toLocaleDateString(),
      });
    });
  };

  // Global Background File Upload Handler
  const handleGlobalBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file, async (url) => {
      const updated = { ...localSettings, globalBgImage: url };
      setLocalSettings(updated);
      triggerSaveStatus();
      await onSaveSettings(updated);
    });
  };

  // Logo File Upload Handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file, async (url) => {
      const updated = { ...localSettings, logo: url };
      setLocalSettings(updated);
      triggerSaveStatus();
      await onSaveSettings(updated);
    });
  };

  // Hero Slide File Upload Handler
  const handleSlideUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file, async (url) => {
      const newSlide: HeroSlide = {
        id: 'slide_' + Date.now(),
        imageUrl: url,
        titleAr: localSettings.heroTitleAr,
        titleEn: localSettings.heroTitleEn,
        subtitleAr: localSettings.heroSubtitleAr,
        subtitleEn: localSettings.heroSubtitleEn,
        displayOrder: heroSlides.length + 1,
      };
      triggerSaveStatus();
      await onSaveHeroSlide(newSlide);
      await onSaveImageItem({
        id: 'img_' + Date.now(),
        url,
        category: 'background',
        name: file.name,
        dateAdded: new Date().toLocaleDateString(),
      });
    });
  };

  // Helper reader
  const processImageFile = (file: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const url = evt.target?.result as string;
      if (url) callback(url);
    };
    reader.readAsDataURL(file);
  };

  const handleSettingsSave = async () => {
    triggerSaveStatus();
    const updatedSettings = { ...localSettings, headerNavLinks: navLinks };
    await onSaveSettings(updatedSettings);
    alert(isAr ? 'تم حفظ الإعدادات بنجاح في القواعد البيانات!' : 'Settings saved successfully!');
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    triggerSaveStatus();
    await onSaveProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleCreateNewProduct = () => {
    const newP: Product = {
      id: 'prod_' + Date.now(),
      nameAr: 'منتج جديد',
      nameEn: 'New Product',
      categoryId: categories[0]?.id || 'cat_flour',
      descriptionAr: 'وصف المنتج الجديد...',
      descriptionEn: 'New product description...',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="%230A1628"/><text x="200" y="200" fill="%23C9A84C" font-size="24" text-anchor="middle">منتج جديد</text></svg>',
      weights: ['10kg', '25kg', '50kg'],
      defaultWeight: '50kg',
      priceOption: 'market',
      fixedPriceOMR: 10.0,
      unit: 'bag',
      isAvailable: true,
    };
    setEditingProduct(newP);
  };

  const handleAddNavLink = () => {
    if (!newNavLink.labelAr || !newNavLink.labelEn) return;
    const link: NavLinkItem = {
      id: 'nav_' + Date.now(),
      labelAr: newNavLink.labelAr,
      labelEn: newNavLink.labelEn,
      href: newNavLink.href || '#',
    };
    const updated = [...navLinks, link];
    setNavLinks(updated);
    setNewNavLink({ labelAr: '', labelEn: '', href: '#' });
  };

  const handleDeleteNavLink = (id: string) => {
    setNavLinks(navLinks.filter((n) => n.id !== id));
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const json = evt.target?.result as string;
      const ok = await onImportJSON(json);
      if (ok) {
        alert(isAr ? 'تمت استعادة جميع البيانات بنجاح!' : 'All data restored successfully!');
      } else {
        alert(isAr ? 'فشل استيراد الملف. تأكد من صحة تنسيق JSON.' : 'Failed to import JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Login Screen View
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[200] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-[#0D1B2E] border border-[#C9A84C]/50 rounded-2xl max-w-md w-full p-8 text-white text-center shadow-2xl relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg">
            ✕
          </button>

          <div className="w-16 h-16 rounded-full bg-[#0A1628] border border-[#C9A84C] flex items-center justify-center mx-auto mb-4 text-[#C9A84C]">
            <Lock className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-black text-white mb-2">
            {isAr ? 'لوحة التحكم الإدارية' : 'Admin Dashboard'}
          </h3>
          <p className="text-xs text-slate-300 mb-6 leading-relaxed">
            {isAr
              ? 'أدخل كلمة المرور الخاصة بالإدارة للوصول إلى التحكم الكامل في الموقع والمنتجات'
              : 'Enter administration password to access full control panel'}
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder={isAr ? 'أدخل كلمة المرور...' : 'Enter password...'}
              className="w-full bg-[#060D18] text-white text-center text-sm border border-slate-700 rounded-xl px-4 py-3 focus:border-[#C9A84C] focus:outline-none"
              autoFocus
            />

            <button
              type="submit"
              className="w-full bg-[#C9A84C] text-[#0A1628] font-black py-3 rounded-xl hover:bg-[#D8B65C] transition shadow-lg text-sm"
            >
              {isAr ? 'تسجيل الدخول' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard Container
  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#0D1B2E] border border-[#C9A84C]/40 rounded-2xl max-w-6xl w-full max-h-[92vh] text-white shadow-2xl relative flex flex-col my-auto overflow-hidden">
        {/* Header Bar */}
        <div className="shrink-0 p-4 sm:p-5 border-b border-slate-800 bg-[#0A1628] flex flex-wrap items-center justify-between gap-3 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#060D18] border border-[#C9A84C] flex items-center justify-center text-[#C9A84C]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{isAr ? 'لوحة التحكم الشاملة' : 'Full Admin Dashboard'}</span>
                <span className="text-[10px] bg-[#C9A84C]/20 text-[#C9A84C] px-2 py-0.5 rounded border border-[#C9A84C]/40">
                  {saveStatus}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {isAr ? 'شركة بن كليلة العامري للتجارة والاستثمار ش.م.م' : 'Bin Kalilah Al-Aamri Trading & Investment LLC'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {undoStack.length > 0 && (
              <button
                onClick={onUndoDelete}
                className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-500/30 flex items-center gap-1"
                title={isAr ? 'تراجع عن آخر عمل حذف' : 'Undo last delete'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isAr ? 'تراجع عن الحذف' : 'Undo Delete'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="shrink-0 px-4 py-2.5 border-b border-slate-800 bg-[#081220] flex items-center gap-2 overflow-x-auto text-xs font-bold scrollbar-thin z-10">
          {[
            { id: 'header', labelAr: 'الترويسة والشعار', labelEn: 'Header & Logo', icon: Layout },
            { id: 'products', labelAr: 'إدارة المنتجات والأقسام', labelEn: 'Products & Categories', icon: Database },
            { id: 'background', labelAr: 'خلفية الموقع العامة', labelEn: 'Global Background', icon: ImageIcon },
            { id: 'slideshow', labelAr: 'معرض الصور المعلقة (Hero)', labelEn: 'Hero Slideshow', icon: Sparkles },
            { id: 'library', labelAr: 'مكتبة الصور الشاملة', labelEn: 'Media Library', icon: ImageIcon },
            { id: 'appearance', labelAr: 'تظليل النصوص', labelEn: 'Text Shading', icon: Settings },
            { id: 'contacts', labelAr: 'معلومات التواصل', labelEn: 'Contacts & Social', icon: Navigation },
            { id: 'backup', labelAr: 'نسخ واستعادة JSON', labelEn: 'JSON Backup', icon: FileCode },
            { id: 'logs', labelAr: 'سجل التشخيص', labelEn: 'Audit Logs', icon: Check },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#C9A84C] text-[#0A1628] font-black shadow-md'
                    : 'bg-[#0D1B2E] text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{isAr ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin text-xs">
          {/* TAB 1: HEADER & LOGO MANAGEMENT */}
          {activeTab === 'header' && (
            <div className="space-y-6">
              {/* Logo Control Section */}
              <div className="bg-[#060D18] p-5 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="font-extrabold text-[#C9A84C] text-sm flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  <span>{isAr ? 'إدارة الشعار الرسمي والأنماط' : 'Official Logo & Styling Manager'}</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-300 font-bold mb-2">
                      {isAr ? 'معاينة الشعار الحالي:' : 'Current Logo Preview:'}
                    </label>
                    <div className="p-4 bg-white/5 rounded-xl border border-slate-700 flex items-center justify-center">
                      <img
                        src={localSettings.logo}
                        alt="Logo"
                        style={{ width: `${localSettings.logoWidth || 120}px` }}
                        className="h-auto max-h-24 object-contain"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-300 font-bold mb-2">
                        {isAr ? 'استبدال ملف الشعار:' : 'Replace Logo File:'}
                      </label>
                      <button
                        onClick={() => logoFileInputRef.current?.click()}
                        className="w-full bg-[#C9A84C] text-[#0A1628] font-black py-2.5 px-4 rounded-xl hover:bg-[#D8B65C] transition flex items-center justify-center gap-2 shadow"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{isAr ? 'اختر ملف شعار جديد' : 'Upload New Logo File'}</span>
                      </button>
                      <input
                        ref={logoFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          onOpenCropModal(
                            localSettings.logo,
                            async (newUrl) => {
                              const updated = { ...localSettings, logo: newUrl };
                              setLocalSettings(updated);
                              triggerSaveStatus();
                              await onSaveSettings(updated);
                            }
                          )
                        }
                        className="w-full mt-2 bg-slate-800 text-slate-200 font-bold py-2 px-4 rounded-xl hover:bg-slate-700 transition flex items-center justify-center gap-2 border border-slate-700"
                      >
                        <Edit3 className="w-4 h-4 text-[#C9A84C]" />
                        <span>{isAr ? 'قص وتعديل الشعار الحالي' : 'Crop & Edit Logo Image'}</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        {isAr ? 'عرض الشعار بالبكسل:' : 'Logo Width (px):'} {localSettings.logoWidth || 120}px
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="300"
                        value={localSettings.logoWidth || 120}
                        onChange={(e) => setLocalSettings({ ...localSettings, logoWidth: parseInt(e.target.value) || 120 })}
                        className="w-full accent-[#C9A84C]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        {isAr ? 'محاذاة الشعار:' : 'Logo Alignment:'}
                      </label>
                      <select
                        value={localSettings.logoAlignment || 'center'}
                        onChange={(e) => setLocalSettings({ ...localSettings, logoAlignment: e.target.value as any })}
                        className="w-full bg-[#13233A] border border-slate-700 text-white rounded-xl p-2.5"
                      >
                        <option value="left">{isAr ? 'يسار (Left)' : 'Left'}</option>
                        <option value="center">{isAr ? 'وسط (Center)' : 'Center'}</option>
                        <option value="right">{isAr ? 'يمين (Right)' : 'Right'}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Header Titles Section */}
              <div className="bg-[#060D18] p-5 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="font-extrabold text-[#C9A84C] text-sm">
                  {isAr ? 'عناوين الترويسة الرئيسية والفرعية' : 'Header Title & Subtitle Settings'}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-bold">{isAr ? 'اسم الشركة (عربي):' : 'Company Name (Arabic):'}</label>
                    <input
                      type="text"
                      value={localSettings.headerTitleAr || localSettings.heroTitleAr || ''}
                      onChange={(e) => setLocalSettings({ ...localSettings, headerTitleAr: e.target.value })}
                      className="w-full bg-[#13233A] border border-slate-700 p-2.5 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-bold">{isAr ? 'اسم الشركة (English):' : 'Company Name (English):'}</label>
                    <input
                      type="text"
                      value={localSettings.headerTitleEn || localSettings.heroTitleEn || ''}
                      onChange={(e) => setLocalSettings({ ...localSettings, headerTitleEn: e.target.value })}
                      className="w-full bg-[#13233A] border border-slate-700 p-2.5 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-bold">{isAr ? 'الوصف الفرعي (عربي):' : 'Subtitle (Arabic):'}</label>
                    <input
                      type="text"
                      value={localSettings.headerSubtitleAr || ''}
                      onChange={(e) => setLocalSettings({ ...localSettings, headerSubtitleAr: e.target.value })}
                      className="w-full bg-[#13233A] border border-slate-700 p-2.5 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-bold">{isAr ? 'الوصف الفرعي (English):' : 'Subtitle (English):'}</label>
                    <input
                      type="text"
                      value={localSettings.headerSubtitleEn || ''}
                      onChange={(e) => setLocalSettings({ ...localSettings, headerSubtitleEn: e.target.value })}
                      className="w-full bg-[#13233A] border border-slate-700 p-2.5 rounded-xl text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Header Navigation Links Manager */}
              <div className="bg-[#060D18] p-5 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="font-extrabold text-[#C9A84C] text-sm flex items-center justify-between">
                  <span>{isAr ? 'روابط التنقل في أعلى الترويسة (Header Navigation Links)' : 'Header Navigation Links Manager'}</span>
                </h4>

                <div className="space-y-2">
                  {navLinks.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 bg-[#13233A] p-2.5 rounded-xl border border-slate-700">
                      <input
                        type="text"
                        value={item.labelAr}
                        onChange={(e) => {
                          const updated = navLinks.map((n) => (n.id === item.id ? { ...n, labelAr: e.target.value } : n));
                          setNavLinks(updated);
                        }}
                        placeholder="عربي"
                        className="flex-1 bg-[#060D18] text-white px-2 py-1 rounded border border-slate-800 text-xs"
                      />
                      <input
                        type="text"
                        value={item.labelEn}
                        onChange={(e) => {
                          const updated = navLinks.map((n) => (n.id === item.id ? { ...n, labelEn: e.target.value } : n));
                          setNavLinks(updated);
                        }}
                        placeholder="English"
                        className="flex-1 bg-[#060D18] text-white px-2 py-1 rounded border border-slate-800 text-xs"
                      />
                      <input
                        type="text"
                        value={item.href}
                        onChange={(e) => {
                          const updated = navLinks.map((n) => (n.id === item.id ? { ...n, href: e.target.value } : n));
                          setNavLinks(updated);
                        }}
                        placeholder="#section"
                        className="w-28 bg-[#060D18] text-amber-400 px-2 py-1 rounded border border-slate-800 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteNavLink(item.id)}
                        className="p-1.5 bg-rose-900/80 text-rose-200 hover:bg-rose-800 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Link Row */}
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={newNavLink.labelAr}
                    onChange={(e) => setNewNavLink({ ...newNavLink, labelAr: e.target.value })}
                    placeholder={isAr ? 'اسم الرابط بالعربي...' : 'Arabic label...'}
                    className="flex-1 bg-[#13233A] text-white px-3 py-2 rounded-xl border border-slate-700 text-xs"
                  />
                  <input
                    type="text"
                    value={newNavLink.labelEn}
                    onChange={(e) => setNewNavLink({ ...newNavLink, labelEn: e.target.value })}
                    placeholder={isAr ? 'اسم الرابط بالإنجليزية...' : 'English label...'}
                    className="flex-1 bg-[#13233A] text-white px-3 py-2 rounded-xl border border-slate-700 text-xs"
                  />
                  <input
                    type="text"
                    value={newNavLink.href}
                    onChange={(e) => setNewNavLink({ ...newNavLink, href: e.target.value })}
                    placeholder="#section"
                    className="w-32 bg-[#13233A] text-amber-400 px-3 py-2 rounded-xl border border-slate-700 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddNavLink}
                    className="bg-[#C9A84C] text-[#0A1628] font-black px-4 py-2 rounded-xl hover:bg-[#D8B65C] transition flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAr ? 'إضافة رابط' : 'Add Link'}</span>
                  </button>
                </div>
              </div>

              <button
                onClick={handleSettingsSave}
                className="w-full bg-emerald-600 py-3 rounded-xl font-bold text-white hover:bg-emerald-500 transition shadow-lg text-sm flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isAr ? 'حفظ كافة إعدادات الترويسة والشعار' : 'Save All Header Settings'}</span>
              </button>
            </div>
          )}

          {/* TAB 2: PRODUCTS & CATEGORIES */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Top Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#060D18] p-4 rounded-2xl border border-slate-800">
                <h4 className="font-extrabold text-[#C9A84C] text-sm">
                  {isAr ? 'إدارة كتالوج المنتجات والأصناف' : 'Product Catalog Management'}
                </h4>

                <button
                  onClick={handleCreateNewProduct}
                  className="bg-[#C9A84C] text-[#0A1628] font-extrabold px-4 py-2 rounded-xl hover:bg-[#D8B65C] transition flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? 'إضافة منتج جديد' : 'Add New Product'}</span>
                </button>
              </div>

              {/* Product Form Modal / Section if Editing */}
              {editingProduct && (
                <form onSubmit={handleProductSubmit} className="bg-[#060D18] p-5 rounded-2xl border border-[#C9A84C]/50 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h5 className="font-extrabold text-[#C9A84C] text-sm">
                      {isAr ? 'تعديل أو إضافة بيانات المنتج:' : 'Edit or Add Product Details:'}
                    </h5>
                    <button type="button" onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white">
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">{isAr ? 'اسم المنتج (عربي):' : 'Name (Arabic):'}</label>
                      <input
                        type="text"
                        value={editingProduct.nameAr}
                        onChange={(e) => setEditingProduct({ ...editingProduct, nameAr: e.target.value })}
                        required
                        className="w-full bg-[#13233A] border border-slate-700 p-2.5 rounded-xl text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">{isAr ? 'اسم المنتج (English):' : 'Name (English):'}</label>
                      <input
                        type="text"
                        value={editingProduct.nameEn}
                        onChange={(e) => setEditingProduct({ ...editingProduct, nameEn: e.target.value })}
                        required
                        className="w-full bg-[#13233A] border border-slate-700 p-2.5 rounded-xl text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">{isAr ? 'الفئة / القسم:' : 'Category:'}</label>
                      <select
                        value={editingProduct.categoryId}
                        onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                        className="w-full bg-[#13233A] border border-slate-700 p-2.5 rounded-xl text-white"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {isAr ? cat.nameAr : cat.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">{isAr ? 'خيار التسعير:' : 'Price Option:'}</label>
                      <select
                        value={editingProduct.priceOption}
                        onChange={(e) => setEditingProduct({ ...editingProduct, priceOption: e.target.value as any })}
                        className="w-full bg-[#13233A] border border-slate-700 p-2.5 rounded-xl text-white"
                      >
                        <option value="market">{isAr ? 'حسب سعر السوق / سعر البورصة' : 'Market Price / Stock Exchange'}</option>
                        <option value="fixed">{isAr ? 'سعر ثابت بالريال العماني (Fixed OMR)' : 'Fixed Price in OMR'}</option>
                      </select>
                    </div>

                    {editingProduct.priceOption === 'fixed' && (
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">{isAr ? 'السعر الثابت (OMR):' : 'Fixed Price (OMR):'}</label>
                        <input
                          type="number"
                          step="0.001"
                          value={editingProduct.fixedPriceOMR || 0}
                          onChange={(e) => setEditingProduct({ ...editingProduct, fixedPriceOMR: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-[#13233A] border border-slate-700 p-2.5 rounded-xl text-white font-mono"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">{isAr ? 'الأوزان المتاحة (مفصولة بفاصلة):' : 'Weights (comma-separated):'}</label>
                      <input
                        type="text"
                        value={editingProduct.weights.join(', ')}
                        onChange={(e) => setEditingProduct({ ...editingProduct, weights: e.target.value.split(',').map((s) => s.trim()) })}
                        className="w-full bg-[#13233A] border border-slate-700 p-2.5 rounded-xl text-white"
                      />
                    </div>
                  </div>

                  {/* Image Upload Box with Drag & Drop */}
                  <div className="pt-2">
                    <label className="block text-slate-300 font-bold mb-2">{isAr ? 'صورة المنتج:' : 'Product Image:'}</label>
                    <div className="flex flex-wrap items-center gap-4 bg-[#13233A] p-4 rounded-xl border border-slate-700">
                      <img src={editingProduct.image} alt="Preview" className="w-20 h-20 object-contain bg-slate-900 rounded-lg p-1 border border-slate-800" />

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => productFileInputRef.current?.click()}
                          className="bg-[#C9A84C] text-[#0A1628] font-extrabold px-4 py-2 rounded-xl hover:bg-[#D8B65C] transition flex items-center gap-1.5 shadow"
                        >
                          <Upload className="w-4 h-4" />
                          <span>{isAr ? 'رفع / اختيار صورة من الجهاز' : 'Upload Image File'}</span>
                        </button>
                        <input
                          ref={productFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleProductFileUpload}
                          className="hidden"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            onOpenCropModal(
                              editingProduct.image,
                              (newUrl) => setEditingProduct({ ...editingProduct, image: newUrl }),
                              () => setEditingProduct({ ...editingProduct, image: '' })
                            )
                          }
                          className="bg-slate-800 text-slate-200 font-bold px-3.5 py-2 rounded-xl hover:bg-slate-700 transition"
                        >
                          {isAr ? 'قص / تعديل الصورة' : 'Crop / Edit Image'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-500 shadow-lg"
                    >
                      {isAr ? 'حفظ المنتج' : 'Save Product'}
                    </button>
                  </div>
                </form>
              )}

              {/* Product List Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {products.map((p) => (
                  <div key={p.id} className="bg-[#060D18] p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                    <img src={p.image} alt={p.nameEn} className="w-14 h-14 object-contain bg-slate-900 rounded-lg p-1" />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-extrabold text-white truncate text-xs">{isAr ? p.nameAr : p.nameEn}</h5>
                      <p className="text-[10px] text-amber-400">{p.priceOption === 'market' ? 'سعر بورصة' : `${p.fixedPriceOMR} OMR`}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          onOpenCropModal(
                            p.image,
                            async (newUrl) => {
                              const updatedP = { ...p, image: newUrl };
                              triggerSaveStatus();
                              await onSaveProduct(updatedP);
                            }
                          )
                        }
                        className="p-1.5 bg-slate-800 text-amber-400 hover:text-white rounded-lg"
                        title={isAr ? 'قص وتعديل صوره المنتج' : 'Crop & Edit Image'}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="p-1.5 bg-slate-800 text-slate-200 hover:text-white rounded-lg"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-1.5 bg-rose-900/80 text-rose-200 hover:bg-rose-800 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GLOBAL BACKGROUND CUSTOMIZATION */}
          {activeTab === 'background' && (
            <div className="bg-[#060D18] p-5 rounded-2xl border border-slate-800 space-y-5">
              <h4 className="font-extrabold text-[#C9A84C] text-sm">
                {isAr ? 'تخصيص خلفية الموقع العامة والضبابية (Global Site Background)' : 'Global Background & Backdrop Settings'}
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-2">
                    {isAr ? 'صورة الخلفية الحالية:' : 'Current Background:'}
                  </label>
                  <div className="flex flex-wrap items-center gap-4">
                    {localSettings.globalBgImage ? (
                      <img src={localSettings.globalBgImage} alt="Global Bg" className="w-28 h-16 object-cover rounded-xl border border-slate-700 shadow" />
                    ) : (
                      <div className="w-28 h-16 bg-white rounded-xl border border-slate-300 flex items-center justify-center text-slate-900 font-bold text-[10px]">
                        Solid White (#FFFFFF)
                      </div>
                    )}

                    <button
                      onClick={() => globalBgFileInputRef.current?.click()}
                      className="bg-[#C9A84C] text-[#0A1628] font-black px-4 py-2.5 rounded-xl hover:bg-[#D8B65C] transition flex items-center gap-1.5 shadow"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isAr ? 'رفع صورة خلفية خاصة' : 'Upload Global Background'}</span>
                    </button>
                    <input
                      ref={globalBgFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleGlobalBgUpload}
                      className="hidden"
                    />

                    {localSettings.globalBgImage && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            onOpenCropModal(
                              localSettings.globalBgImage,
                              async (newUrl) => {
                                const updated = { ...localSettings, globalBgImage: newUrl };
                                setLocalSettings(updated);
                                triggerSaveStatus();
                                await onSaveSettings(updated);
                              }
                            )
                          }
                          className="bg-slate-800 text-slate-200 font-bold px-4 py-2.5 rounded-xl hover:bg-slate-700 transition flex items-center gap-1.5 border border-slate-700"
                        >
                          <Edit3 className="w-4 h-4 text-[#C9A84C]" />
                          <span>{isAr ? 'قص وتعديل خلفية الموقع' : 'Crop & Edit Background'}</span>
                        </button>

                        <button
                          onClick={() => {
                            const updated = { ...localSettings, globalBgImage: '' };
                            setLocalSettings(updated);
                            onSaveSettings(updated);
                          }}
                          className="px-4 py-2.5 rounded-xl bg-rose-900/80 text-rose-200 font-bold hover:bg-rose-800"
                        >
                          {isAr ? 'إزالة الخلفية (إعادة للون الأبيض)' : 'Reset to Solid White'}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {localSettings.globalBgImage && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        {isAr ? 'درجة تمويه وضبابية الخلفية (Blur 0 - 20px):' : 'Background Blur:'} {localSettings.globalBgBlur || 0}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={localSettings.globalBgBlur || 0}
                        onChange={(e) => setLocalSettings({ ...localSettings, globalBgBlur: parseInt(e.target.value) || 0 })}
                        className="w-full accent-[#C9A84C]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        {isAr ? 'شفافية الخلفية (Opacity 0 - 100%):' : 'Background Opacity:'} {localSettings.globalBgOpacity ?? 100}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={localSettings.globalBgOpacity ?? 100}
                        onChange={(e) => setLocalSettings({ ...localSettings, globalBgOpacity: parseInt(e.target.value) || 0 })}
                        className="w-full accent-[#C9A84C]"
                      />
                    </div>
                  </div>
                )}

                {/* Animated Background Controls */}
                <div className="pt-5 border-t border-slate-800 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#C9A84C]" />
                    <h5 className="font-extrabold text-[#C9A84C] text-sm">
                      {isAr ? 'إعدادات الخلفية المتحركة والتفاعلية' : 'Interactive Animated Background Controls'}
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Mode selector */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        {isAr ? 'نمط الحركة والتأثيرات:' : 'Animation FX Style:'}
                      </label>
                      <select
                        value={localSettings.animatedBgStyle || 'particles'}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            animatedBgStyle: e.target.value as any,
                          })
                        }
                        className="w-full bg-[#13233A] text-white border border-slate-700 rounded-xl p-2.5 text-xs focus:border-[#C9A84C] focus:outline-none"
                      >
                        <option value="particles">✨ {isAr ? 'غبار ذهبي ورذاذ متلألئ (Particles)' : 'Golden Dust & Particles'}</option>
                        <option value="aurora">🌊 {isAr ? 'أمواج الشفق الضوئي (Aurora Waves)' : 'Fluid Aurora Waves'}</option>
                        <option value="mesh">🕸️ {isAr ? 'شبكة الكريستال الرقمية (Digital Mesh)' : 'Crystal Lattice Mesh'}</option>
                        <option value="orbs">🔮 {isAr ? 'دوائر الضوء الناعمة (Glowing Orbs)' : 'Glowing Bokeh Orbs'}</option>
                        <option value="matrix">📐 {isAr ? 'مصفوفة التراث العماني (Golden Matrix)' : 'Golden Omani Matrix'}</option>
                        <option value="off">🚫 {isAr ? 'إيقاف الخلفية المتحركة (Disable)' : 'Disable Animation'}</option>
                      </select>
                    </div>

                    {/* Speed slider */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        {isAr ? 'سرعة انسياب الحركة:' : 'Animation Speed:'} {localSettings.animatedBgSpeed || 2}x
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="0.5"
                        value={localSettings.animatedBgSpeed || 2}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            animatedBgSpeed: parseFloat(e.target.value) || 2,
                          })
                        }
                        className="w-full accent-[#C9A84C]"
                      />
                    </div>

                    {/* Opacity slider */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        {isAr ? 'سطوع وشفافية الحركة:' : 'Animation Opacity:'} {localSettings.animatedBgOpacity ?? 80}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={localSettings.animatedBgOpacity ?? 80}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            animatedBgOpacity: parseInt(e.target.value) || 80,
                          })
                        }
                        className="w-full accent-[#C9A84C]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSettingsSave}
                className="w-full bg-emerald-600 py-3 rounded-xl font-bold text-white hover:bg-emerald-500 shadow-lg"
              >
                {isAr ? 'حفظ إعدادات الخلفية' : 'Save Background Settings'}
              </button>
            </div>
          )}

          {/* TAB 4: HERO SLIDESHOW */}
          {activeTab === 'slideshow' && (
            <div className="bg-[#060D18] p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="font-extrabold text-[#C9A84C] text-sm">
                  {isAr ? 'معرض صور الهيرو المتحركة (حتى 50 صورة)' : 'Hero Carousel Slideshow Manager'}
                </h4>

                <button
                  onClick={() => heroFileInputRef.current?.click()}
                  className="bg-[#C9A84C] text-[#0A1628] font-black px-4 py-2 rounded-xl hover:bg-[#D8B65C] transition flex items-center gap-1.5 shadow"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isAr ? 'رفع صورة جديدة للملعرض' : 'Upload Slide Image'}</span>
                </button>
                <input
                  ref={heroFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSlideUpload}
                  className="hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {heroSlides.map((slide) => (
                  <div key={slide.id} className="bg-[#0D1B2E] p-2.5 rounded-xl border border-slate-800 relative group">
                    <img src={slide.imageUrl} alt="Hero" className="w-full h-32 object-cover rounded-lg mb-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Order: {slide.displayOrder}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            onOpenCropModal(
                              slide.imageUrl,
                              async (newUrl) => {
                                const updatedSlide = { ...slide, imageUrl: newUrl };
                                triggerSaveStatus();
                                await onSaveHeroSlide(updatedSlide);
                              }
                            )
                          }
                          className="p-1.5 bg-slate-800 text-amber-400 hover:text-white rounded-lg flex items-center gap-1 text-[10px]"
                          title={isAr ? 'قص وتعديل صوره السلايد' : 'Crop & Edit Slide'}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{isAr ? 'قص وتعديل' : 'Crop'}</span>
                        </button>
                        <button
                          onClick={() => onDeleteHeroSlide(slide.id)}
                          className="p-1.5 bg-rose-900/80 text-rose-200 hover:bg-rose-800 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MEDIA LIBRARY TAB */}
          {activeTab === 'library' && (
            <div className="bg-[#060D18] p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h4 className="font-extrabold text-[#C9A84C] text-sm">
                    {isAr ? 'مكتبة أصول الصور الشاملة (جميع صور النظام والمنتجات والخلفيات)' : 'Comprehensive Media Library'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {isAr ? 'تعديل وقص وتحديث أي صورة في النظام مع حفظ جميع التغييرات تلقائياً' : 'Crop, edit and update any image in the system with full persistence'}
                  </p>
                </div>

                <button
                  onClick={() => libraryFileInputRef.current?.click()}
                  className="bg-[#C9A84C] text-[#0A1628] font-black px-4 py-2 rounded-xl hover:bg-[#D8B65C] transition flex items-center gap-1.5 shadow"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isAr ? 'رفع صورة جديدة للمكتبة' : 'Upload Image to Library'}</span>
                </button>
                <input
                  ref={libraryFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLibraryFileUpload}
                  className="hidden"
                />
              </div>

              {imageLibrary.length === 0 ? (
                <div className="p-8 text-center bg-[#0D1B2E] rounded-xl border border-slate-800 text-slate-400">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                  <p>{isAr ? 'لا توجد صور في المكتبة بعد. قم برفع صورة جديدة لتعديلها وقصها.' : 'No images in library. Upload an image to start editing.'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imageLibrary.map((img) => (
                    <div key={img.id} className="bg-[#0D1B2E] p-3 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2 group">
                      <div className="relative overflow-hidden rounded-lg bg-black/40 h-36 flex items-center justify-center">
                        <img src={img.url} alt={img.name} className="max-h-full max-w-full object-contain" />
                        <span className="absolute top-2 right-2 bg-[#0A1628]/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-[#C9A84C]/30">
                          {img.category || 'image'}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <h5 className="font-extrabold text-white text-xs truncate">{img.name || 'صورة مخصصة'}</h5>
                        <p className="text-[10px] text-slate-400">{img.dateAdded}</p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                        <button
                          onClick={() =>
                            onOpenCropModal(
                              img.url,
                              async (newUrl) => {
                                const updatedImg = { ...img, url: newUrl };
                                triggerSaveStatus();
                                await onSaveImageItem(updatedImg);
                              },
                              async () => {
                                await onDeleteImageItem(img.id);
                              }
                            )
                          }
                          className="flex-1 bg-[#C9A84C] text-[#0A1628] font-black py-1.5 px-2 rounded-lg hover:bg-[#D8B65C] transition flex items-center justify-center gap-1 text-[11px]"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{isAr ? 'قص وتعديل' : 'Crop & Edit'}</span>
                        </button>

                        <button
                          onClick={() => onDeleteImageItem(img.id)}
                          className="p-1.5 bg-rose-900/80 text-rose-200 hover:bg-rose-800 rounded-lg"
                          title={isAr ? 'حذف الصورة' : 'Delete'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: APPEARANCE & SHADING */}
          {activeTab === 'appearance' && (
            <div className="bg-[#060D18] p-5 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="font-extrabold text-[#C9A84C] text-sm">
                {isAr ? 'نمط وتظليل نصوص واجهة الهيرو:' : 'Hero Text Shading & Styling:'}
              </h4>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'gold', labelAr: 'ذهبي عماني فاخر', labelEn: 'Omani Gold' },
                  { id: 'dark', labelAr: 'داكن كحلي عميق', labelEn: 'Deep Navy' },
                  { id: 'glass', labelAr: 'زجاجي شفاف', labelEn: 'Glassmorphism' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setLocalSettings({ ...localSettings, textShadingStyle: st.id as any })}
                    className={`p-3 rounded-xl border font-bold text-center ${
                      localSettings.textShadingStyle === st.id
                        ? 'bg-[#C9A84C] text-[#0A1628] border-[#C9A84C]'
                        : 'bg-[#13233A] text-slate-300 border-slate-700'
                    }`}
                  >
                    {isAr ? st.labelAr : st.labelEn}
                  </button>
                ))}
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  {isAr ? 'مستوى الشفافية (0 - 100%):' : 'Opacity Level:'} {localSettings.textOpacity}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localSettings.textOpacity}
                  onChange={(e) => setLocalSettings({ ...localSettings, textOpacity: parseInt(e.target.value) || 0 })}
                  className="w-full accent-[#C9A84C]"
                />
              </div>

              <button onClick={handleSettingsSave} className="w-full bg-emerald-600 py-2.5 rounded-xl font-bold text-white hover:bg-emerald-500">
                {isAr ? 'حفظ المظهر' : 'Save Appearance'}
              </button>
            </div>
          )}

          {/* TAB 6: CONTACTS & SOCIAL */}
          {activeTab === 'contacts' && (
            <div className="bg-[#060D18] p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">{isAr ? 'رقم الهاتف الرئيسي:' : 'Phone 1:'}</label>
                  <input
                    type="text"
                    value={localSettings.phone1}
                    onChange={(e) => setLocalSettings({ ...localSettings, phone1: e.target.value })}
                    className="w-full bg-[#13233A] border border-slate-700 p-2.5 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold">{isAr ? 'رقم الواتساب المباشر:' : 'WhatsApp Number:'}</label>
                  <input
                    type="text"
                    value={localSettings.whatsappNumber}
                    onChange={(e) => setLocalSettings({ ...localSettings, whatsappNumber: e.target.value })}
                    className="w-full bg-[#13233A] border border-slate-700 p-2.5 rounded-xl text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-300 mb-1 font-bold">{isAr ? 'رابط الخريطة Google Maps:' : 'Google Maps URL:'}</label>
                  <input
                    type="text"
                    value={localSettings.googleMapsUrl}
                    onChange={(e) => setLocalSettings({ ...localSettings, googleMapsUrl: e.target.value })}
                    className="w-full bg-[#13233A] border border-slate-700 p-2.5 rounded-xl text-white"
                  />
                </div>
              </div>

              <button onClick={handleSettingsSave} className="w-full bg-emerald-600 py-3 rounded-xl font-bold text-white hover:bg-emerald-500">
                {isAr ? 'حفظ بيانات التواصل' : 'Save Contacts'}
              </button>
            </div>
          )}

          {/* TAB 7: BACKUP & JSON RESTORE */}
          {activeTab === 'backup' && (
            <div className="bg-[#060D18] p-5 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="font-extrabold text-[#C9A84C] text-sm">{isAr ? 'تصدير واستعادة نسخة احتياطية من جميع البيانات' : 'Export / Import Backup JSON:'}</h4>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onExportJSON}
                  className="flex-1 bg-[#C9A84C] text-[#0A1628] font-black py-3 rounded-xl shadow hover:bg-[#D8B65C] flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{isAr ? 'تصدير النسخة الاحتياطية (JSON)' : 'Export Full JSON Backup'}</span>
                </button>

                <label className="flex-1 bg-[#13233A] text-white font-bold py-3 rounded-xl border border-slate-700 hover:bg-[#1E3352] flex items-center justify-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4 text-[#C9A84C]" />
                  <span>{isAr ? 'استيراد نسخة من ملف (JSON)' : 'Import JSON Backup'}</span>
                  <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={async () => {
                    if (confirm(isAr ? 'هل أنت متأكد من مسح جميع أصول الصور؟' : 'Clear all custom image assets?')) {
                      await onClearAllAssets();
                      alert(isAr ? 'تمت إعادة الصور للوضع الافتراضي' : 'Assets cleared');
                    }
                  }}
                  className="w-full bg-rose-950/80 border border-rose-800 text-rose-300 font-bold py-2.5 rounded-xl hover:bg-rose-900"
                >
                  {isAr ? 'مسح كافة أصول الصور' : 'Clear All Image Assets'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: AUDIT LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="font-bold text-[#C9A84C]">{isAr ? 'سجل العمليات الأخير:' : 'Recent Audit Logs:'}</span>
              </div>

              <div className="space-y-2">
                {diagnosticLogs.map((log) => (
                  <div key={log.id} className="bg-[#060D18] p-3 rounded-xl border border-slate-800 font-mono text-[11px]">
                    <div className="flex justify-between text-[#C9A84C] mb-1">
                      <span>{log.action}</span>
                      <span className="text-slate-400 text-[10px]">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-300">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
