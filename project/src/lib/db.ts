import { Product, Category, HeroSlide, SiteSettings, ImageItem, AuditLog, SpecialRequest, OrderForm } from '../types';
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS, DEFAULT_HERO_SLIDES, DEFAULT_SITE_SETTINGS } from '../data/defaultData';

const DB_NAME = 'BinKalilah_AppDB';
const DB_VERSION = 1;

class IndexedDBStorage {
  private db: IDBDatabase | null = null;
  private isReady: boolean = false;
  private undoStack: Array<{ action: string; snapshot: any }> = [];
  private diagnosticLogs: AuditLog[] = [];

  constructor() {
    this.initDB();
  }

  private initDB(): Promise<void> {
    return new Promise((resolve) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB not supported, using localStorage fallback');
        this.isReady = true;
        resolve();
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('products')) db.createObjectStore('products', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('categories')) db.createObjectStore('categories', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('hero_slides')) db.createObjectStore('hero_slides', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('site_settings')) db.createObjectStore('site_settings', { keyPath: 'key' });
        if (!db.objectStoreNames.contains('image_library')) db.createObjectStore('image_library', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('audit_logs')) db.createObjectStore('audit_logs', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('special_requests')) db.createObjectStore('special_requests', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('orders')) db.createObjectStore('orders', { keyPath: 'id' });
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        this.isReady = true;
        resolve();
      };

      request.onerror = (event) => {
        console.error('IndexedDB open error:', event);
        this.isReady = true;
        resolve();
      };
    });
  }

  private async ensureDB(): Promise<void> {
    if (!this.isReady) {
      await this.initDB();
    }
  }

  public async init(): Promise<void> {
    await this.ensureDB();
  }

  public async getAllData(): Promise<{
    settings: SiteSettings;
    categories: Category[];
    products: Product[];
    heroSlides: HeroSlide[];
    imageLibrary: ImageItem[];
    orders: OrderForm[];
    diagnosticLogs: AuditLog[];
    undoStack: Array<{ action: string; snapshot: any }>;
  }> {
    const settings = await this.getSiteSettings();
    const categories = await this.getCategories();
    const products = await this.getProducts();
    const heroSlides = await this.getHeroSlides();
    const imageLibrary = await this.getImageLibrary();
    const orders = await this.getOrders();
    const diagnosticLogs = this.getDiagnosticLogs();
    const undoStack = this.getUndoStack();

    return {
      settings,
      categories,
      products,
      heroSlides,
      imageLibrary,
      orders,
      diagnosticLogs,
      undoStack,
    };
  }

  public logOperation(action: string, details: string) {
    const newLog: AuditLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toLocaleString('ar-OM', { hour12: true }),
      action,
      details,
    };
    this.diagnosticLogs.unshift(newLog);
    if (this.diagnosticLogs.length > 20) {
      this.diagnosticLogs.pop();
    }
    // save to storage
    this.setItem('audit_logs', newLog.id, newLog);
  }

  public getDiagnosticLogs(): AuditLog[] {
    return [...this.diagnosticLogs].slice(0, 10);
  }

  public pushUndoSnapshot(actionName: string, snapshotData: any) {
    this.undoStack.unshift({ action: actionName, snapshot: snapshotData });
    if (this.undoStack.length > 5) {
      this.undoStack.pop();
    }
  }

  public getUndoStack() {
    return this.undoStack;
  }

  // Generic Get Store Item
  private async getItem<T>(storeName: string, key: string): Promise<T | null> {
    await this.ensureDB();
    if (this.db) {
      return new Promise((resolve) => {
        try {
          const transaction = this.db!.transaction(storeName, 'readonly');
          const store = transaction.objectStore(storeName);
          const req = store.get(key);
          req.onsuccess = () => resolve(req.result ? req.result.data || req.result : null);
          req.onerror = () => resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    } else {
      const raw = localStorage.getItem(`${DB_NAME}_${storeName}_${key}`);
      return raw ? JSON.parse(raw) : null;
    }
  }

  // Generic Set Store Item
  private async setItem<T>(storeName: string, key: string, data: T): Promise<void> {
    await this.ensureDB();
    if (this.db) {
      return new Promise((resolve) => {
        try {
          const transaction = this.db!.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          store.put({ id: key, key: key, data: data, updatedAt: new Date().toISOString() });
          transaction.oncomplete = () => resolve();
          transaction.onerror = () => resolve();
        } catch (e) {
          localStorage.setItem(`${DB_NAME}_${storeName}_${key}`, JSON.stringify(data));
          resolve();
        }
      });
    } else {
      localStorage.setItem(`${DB_NAME}_${storeName}_${key}`, JSON.stringify(data));
    }
  }

  // Generic Get All
  private async getAllItems<T>(storeName: string): Promise<T[]> {
    await this.ensureDB();
    if (this.db) {
      return new Promise((resolve) => {
        try {
          const transaction = this.db!.transaction(storeName, 'readonly');
          const store = transaction.objectStore(storeName);
          const req = store.getAll();
          req.onsuccess = () => {
            const results = (req.result || []).map((r: any) => r.data || r);
            resolve(results);
          };
          req.onerror = () => resolve([]);
        } catch (e) {
          resolve([]);
        }
      });
    } else {
      const results: T[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(`${DB_NAME}_${storeName}_`)) {
          const val = localStorage.getItem(k);
          if (val) results.push(JSON.parse(val));
        }
      }
      return results;
    }
  }

  // Generic Delete
  private async deleteItem(storeName: string, key: string): Promise<void> {
    await this.ensureDB();
    if (this.db) {
      return new Promise((resolve) => {
        try {
          const transaction = this.db!.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          store.delete(key);
          transaction.oncomplete = () => resolve();
          transaction.onerror = () => resolve();
        } catch (e) {
          localStorage.removeItem(`${DB_NAME}_${storeName}_${key}`);
          resolve();
        }
      });
    } else {
      localStorage.removeItem(`${DB_NAME}_${storeName}_${key}`);
    }
  }

  // Clear Store
  private async clearStore(storeName: string): Promise<void> {
    await this.ensureDB();
    if (this.db) {
      return new Promise((resolve) => {
        try {
          const transaction = this.db!.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);
          store.clear();
          transaction.oncomplete = () => resolve();
          transaction.onerror = () => resolve();
        } catch (e) {
          resolve();
        }
      });
    }
  }

  // --- High Level API ---

  // Products
  public async getProducts(): Promise<Product[]> {
    const SEED_VER = 'v3_zero_prices';
    const currentVer = localStorage.getItem(`${DB_NAME}_products_ver`);
    const list = await this.getAllItems<Product>('products');

    if (currentVer === SEED_VER && list && list.length > 0) {
      return list;
    }

    // Force re-seed products to sync updated DEFAULT_PRODUCTS with 0 prices
    await this.clearStore('products');
    for (const p of DEFAULT_PRODUCTS) {
      await this.saveProduct(p);
    }
    localStorage.setItem(`${DB_NAME}_products_ver`, SEED_VER);
    localStorage.setItem(`${DB_NAME}_products_seeded`, 'true');
    return DEFAULT_PRODUCTS;
  }

  public async saveProduct(product: Product): Promise<void> {
    await this.setItem('products', product.id, product);
    localStorage.setItem(`${DB_NAME}_products_seeded`, 'true');
    this.logOperation('حفظ منتج / Save Product', `Product ID: ${product.id} - ${product.nameAr}`);
  }

  public async deleteProduct(productId: string): Promise<void> {
    const existing = await this.getItem<Product>('products', productId);
    if (existing) {
      this.pushUndoSnapshot('حذف منتج', { type: 'product', data: existing });
    }
    await this.deleteItem('products', productId);
    localStorage.setItem(`${DB_NAME}_products_seeded`, 'true');
    this.logOperation('حذف منتج / Delete Product', `Product ID: ${productId}`);
  }

  // Categories
  public async getCategories(): Promise<Category[]> {
    const isSeeded = localStorage.getItem(`${DB_NAME}_categories_seeded`);
    const list = await this.getAllItems<Category>('categories');
    if (isSeeded || (list && list.length > 0)) {
      if (!isSeeded) localStorage.setItem(`${DB_NAME}_categories_seeded`, 'true');
      return (list || []).sort((a, b) => a.displayOrder - b.displayOrder);
    }
    for (const c of DEFAULT_CATEGORIES) {
      await this.saveCategory(c);
    }
    localStorage.setItem(`${DB_NAME}_categories_seeded`, 'true');
    return DEFAULT_CATEGORIES;
  }

  public async saveCategory(category: Category): Promise<void> {
    await this.setItem('categories', category.id, category);
    localStorage.setItem(`${DB_NAME}_categories_seeded`, 'true');
    this.logOperation('حفظ فئة / Save Category', `Category: ${category.nameAr}`);
  }

  public async deleteCategory(categoryId: string): Promise<void> {
    await this.deleteItem('categories', categoryId);
    localStorage.setItem(`${DB_NAME}_categories_seeded`, 'true');
    this.logOperation('حذف فئة / Delete Category', `Category ID: ${categoryId}`);
  }

  // Hero Slides
  public async getHeroSlides(): Promise<HeroSlide[]> {
    const isSeeded = localStorage.getItem(`${DB_NAME}_slides_seeded`);
    const list = await this.getAllItems<HeroSlide>('hero_slides');
    if (isSeeded || (list && list.length > 0)) {
      if (!isSeeded) localStorage.setItem(`${DB_NAME}_slides_seeded`, 'true');
      return (list || []).sort((a, b) => a.displayOrder - b.displayOrder);
    }
    for (const s of DEFAULT_HERO_SLIDES) {
      await this.saveHeroSlide(s);
    }
    localStorage.setItem(`${DB_NAME}_slides_seeded`, 'true');
    return DEFAULT_HERO_SLIDES;
  }

  public async saveHeroSlide(slide: HeroSlide): Promise<void> {
    await this.setItem('hero_slides', slide.id, slide);
    localStorage.setItem(`${DB_NAME}_slides_seeded`, 'true');
    this.logOperation('حفظ سلايد شو / Save Slide', `Slide ID: ${slide.id}`);
  }

  public async deleteHeroSlide(slideId: string): Promise<void> {
    const existing = await this.getItem<HeroSlide>('hero_slides', slideId);
    if (existing) {
      this.pushUndoSnapshot('حذف صورة خلفية', { type: 'hero_slide', data: existing });
    }
    await this.deleteItem('hero_slides', slideId);
    localStorage.setItem(`${DB_NAME}_slides_seeded`, 'true');
    this.logOperation('حذف صورة خلفية / Delete Slide', `Slide ID: ${slideId}`);
  }

  // Settings
  public async getSiteSettings(): Promise<SiteSettings> {
    const settings = await this.getItem<SiteSettings>('site_settings', 'main_config');
    if (settings) {
      return { ...DEFAULT_SITE_SETTINGS, ...settings };
    }
    await this.saveSiteSettings(DEFAULT_SITE_SETTINGS);
    return DEFAULT_SITE_SETTINGS;
  }

  public async saveSiteSettings(settings: SiteSettings): Promise<void> {
    await this.setItem('site_settings', 'main_config', settings);
    this.logOperation('تحديث الإعدادات / Update Settings', 'Saved general settings & styling');
  }

  // Image Library
  public async getImageLibrary(): Promise<ImageItem[]> {
    return await this.getAllItems<ImageItem>('image_library');
  }

  public async saveImageItem(item: ImageItem): Promise<void> {
    await this.setItem('image_library', item.id, item);
    this.logOperation('إضافة صورة / Add Image', `Image ID: ${item.id} (${item.category})`);
  }

  public async deleteImageItem(imageId: string): Promise<void> {
    const existing = await this.getItem<ImageItem>('image_library', imageId);
    if (existing) {
      this.pushUndoSnapshot('حذف صورة من المعرض', { type: 'image_item', data: existing });
    }
    await this.deleteItem('image_library', imageId);
    this.logOperation('حذف صورة نهائياً / Delete Image', `Image ID: ${imageId}`);
  }

  // Orders & Special Requests
  public async saveOrder(order: OrderForm): Promise<void> {
    await this.setItem('orders', order.id, order);
    this.logOperation('تسجيل طلب جديد / Save Order', `Order ID: ${order.id} for ${order.customerName}`);
  }

  public async getOrders(): Promise<OrderForm[]> {
    return await this.getAllItems<OrderForm>('orders');
  }

  public async saveSpecialRequest(req: SpecialRequest): Promise<void> {
    await this.setItem('special_requests', req.id, req);
    this.logOperation('طلب خاص جديد / Special Request', `From: ${req.customerName} - ${req.companyName}`);
  }

  public async getSpecialRequests(): Promise<SpecialRequest[]> {
    return await this.getAllItems<SpecialRequest>('special_requests');
  }

  // Clear All Assets (resets images to placeholders while retaining texts/prices)
  public async clearAllAssets(): Promise<void> {
    this.logOperation('مسح الأصول والصور / Clear Assets', 'Resetting images to placeholders');
    const products = await this.getProducts();
    for (const p of products) {
      const defaultMatch = DEFAULT_PRODUCTS.find((dp) => dp.id === p.id);
      if (defaultMatch) {
        p.image = defaultMatch.image;
        await this.saveProduct(p);
      }
    }
    await this.clearStore('image_library');
  }

  // Full Export JSON
  public async exportFullBackupJSON(): Promise<string> {
    const products = await this.getProducts();
    const categories = await this.getCategories();
    const heroSlides = await this.getHeroSlides();
    const settings = await this.getSiteSettings();
    const imageLibrary = await this.getImageLibrary();

    const backupObj = {
      appName: 'Bin Kalilah Al-Aamri Catalog',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      products,
      categories,
      heroSlides,
      settings,
      imageLibrary,
    };

    return JSON.stringify(backupObj, null, 2);
  }

  // Restore Full JSON
  public async importFullBackupJSON(jsonStr: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonStr);
      if (!data.products || !data.settings) {
        throw new Error('Invalid backup file format');
      }

      await this.clearStore('products');
      await this.clearStore('categories');
      await this.clearStore('hero_slides');
      await this.clearStore('image_library');

      for (const p of data.products) await this.saveProduct(p);
      if (data.categories) for (const c of data.categories) await this.saveCategory(c);
      if (data.heroSlides) for (const s of data.heroSlides) await this.saveHeroSlide(s);
      if (data.settings) await this.saveSiteSettings(data.settings);
      if (data.imageLibrary) for (const img of data.imageLibrary) await this.saveImageItem(img);

      this.logOperation('استعادة النسخة الاحتياطية / Restore Backup', 'Restored successfully from JSON');
      return true;
    } catch (e) {
      console.error('Import backup failed:', e);
      return false;
    }
  }

  // Undo Last Delete
  public async undoLastDelete(): Promise<boolean> {
    if (this.undoStack.length === 0) return false;
    const top = this.undoStack.shift();
    if (!top) return false;

    if (top.snapshot.type === 'product') {
      await this.saveProduct(top.snapshot.data);
    } else if (top.snapshot.type === 'hero_slide') {
      await this.saveHeroSlide(top.snapshot.data);
    } else if (top.snapshot.type === 'image_item') {
      await this.saveImageItem(top.snapshot.data);
    }

    this.logOperation('تراجع عن الحذف / Undo Delete', `Restored item: ${top.action}`);
    return true;
  }
}

export const dbStorage = new IndexedDBStorage();
export const dbManager = {
  init: () => dbStorage.init(),
  getAllData: () => dbStorage.getAllData(),
  getSiteSettings: () => dbStorage.getSiteSettings(),
  saveSiteSettings: (s: SiteSettings) => dbStorage.saveSiteSettings(s),
  getProducts: () => dbStorage.getProducts(),
  saveProduct: (p: Product) => dbStorage.saveProduct(p),
  deleteProduct: (id: string) => dbStorage.deleteProduct(id),
  getCategories: () => dbStorage.getCategories(),
  saveCategory: (c: Category) => dbStorage.saveCategory(c),
  deleteCategory: (id: string) => dbStorage.deleteCategory(id),
  getHeroSlides: () => dbStorage.getHeroSlides(),
  saveHeroSlide: (s: HeroSlide) => dbStorage.saveHeroSlide(s),
  deleteHeroSlide: (id: string) => dbStorage.deleteHeroSlide(id),
  getImageLibrary: () => dbStorage.getImageLibrary(),
  saveImageItem: (img: ImageItem) => dbStorage.saveImageItem(img),
  deleteImageItem: (id: string) => dbStorage.deleteImageItem(id),
  saveSpecialRequest: (req: any) => dbStorage.saveSpecialRequest(req),
  exportJSONBackup: async () => {
    const json = await dbStorage.exportFullBackupJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bin_Kalilah_AlAamri_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },
  importJSONBackup: (jsonStr: string) => dbStorage.importFullBackupJSON(jsonStr),
  clearAllAssets: () => dbStorage.clearAllAssets(),
  undoLastDelete: () => dbStorage.undoLastDelete(),
  getUndoStack: () => dbStorage.getUndoStack(),
};
