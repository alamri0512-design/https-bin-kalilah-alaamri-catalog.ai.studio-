/**
 * Bin Kalilah Al-Aamri Trading & Investment Co. LLC
 * Data Types and Interfaces
 */

export type Language = 'ar' | 'en';

export type Currency = 'OMR' | 'SAR' | 'YER' | 'USD' | 'AED';

export interface CurrencyRate {
  code: Currency;
  symbolAr: string;
  symbolEn: string;
  rateToOMR: number; // 1 OMR = X Currency
}

export type ProductUnit = 'bag' | 'carton' | 'ton' | 'kg' | 'piece';

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  categoryId: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string; // Base64 data URL or asset path
  weights: string[]; // e.g. ["1kg", "2kg", "5kg", "10kg", "25kg", "50kg"]
  defaultWeight: string;
  priceOption: 'market' | 'fixed';
  fixedPriceOMR: number; // Base price in OMR
  unit: ProductUnit;
  isAvailable: boolean;
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  bgImage?: string;
  displayOrder: number;
}

export interface OrderItem {
  productId: string;
  productNameAr: string;
  productNameEn: string;
  weight: string;
  quantity: number;
  unit: ProductUnit;
  unitPriceOMR: number;
  priceOption: 'market' | 'fixed';
}

export interface OrderForm {
  id: string;
  customerName: string;
  region: string;
  phone: string;
  businessType: 'bakery' | 'grocery' | 'restaurant' | 'farm' | 'wholesaler' | 'exporter' | 'other';
  notes: string;
  items: OrderItem[];
  currency: Currency;
  status: 'received' | 'review' | 'approved' | 'processing' | 'shipped';
  createdAt: string;
}

export interface HeroSlide {
  id: string;
  imageUrl: string;
  titleAr?: string;
  titleEn?: string;
  subtitleAr?: string;
  subtitleEn?: string;
  displayOrder: number;
}

export interface NavLinkItem {
  id: string;
  labelAr: string;
  labelEn: string;
  href: string;
}

export interface SiteSettings {
  logo: string;
  logoWidth?: number; // width in px
  logoAlignment?: 'left' | 'center' | 'right';
  headerTitleAr?: string;
  headerTitleEn?: string;
  headerSubtitleAr?: string;
  headerSubtitleEn?: string;
  headerNavLinks?: NavLinkItem[];
  visibleSections?: {
    hero?: boolean;
    about?: boolean;
    catalog?: boolean;
    orderPortal?: boolean;
    shipping?: boolean;
    tracker?: boolean;
    specialOrders?: boolean;
  };
  productGridColumns?: number;
  productCardStyle?: '3d' | 'minimal' | 'compact';
  globalBgImage?: string;
  globalBgBlur?: number; // 0 to 20
  globalBgOpacity?: number; // 0 to 100
  animatedBgStyle?: 'particles' | 'aurora' | 'mesh' | 'orbs' | 'matrix' | 'off';
  animatedBgSpeed?: number; // 1 to 5
  animatedBgOpacity?: number; // 10 to 100
  aboutImage: string;
  phone1: string;
  phone2: string;
  emails: string[];
  whatsappNumber: string;
  googleMapsUrl: string;
  adminPassword: string; // Default: SALALAH2026
  heroSpeed: number; // 5, 10, 15 seconds
  textShadingStyle: 'glass' | 'dark' | 'gold';
  textOpacity: number; // 0 - 100
  textBlur: number; // 0 - 30
  marqueeEnabled: boolean;
  marqueeTextAr?: string;
  marqueeTextEn?: string;
  autoSaveEnabled: boolean;
  heroTitleAr: string;
  heroTitleEn: string;
  heroSubtitleAr: string;
  heroSubtitleEn: string;
  aboutTextAr: string;
  aboutTextEn: string;
  customSeaRatePerTonOMR: number;
  customLandRatePerTruckOMR: number;
  defaultCurrency: Currency;
}

export interface ImageItem {
  id: string;
  url: string;
  category: 'logo' | 'background' | 'product' | 'about' | 'general' | 'archived';
  name: string;
  dateAdded: string;
  associatedId?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

export interface SpecialRequest {
  id: string;
  customerName: string;
  companyName: string;
  phone: string;
  email: string;
  details: string;
  customImage?: string;
  currency: Currency;
  createdAt: string;
}

export interface ShippingCalculation {
  totalWeightTons: number;
  containers20ft: number; // 25 tons per 20ft container
  seaCostOMR: number;
  landCostOMR: number;
  destination: string;
  readyToShip: boolean;
}
