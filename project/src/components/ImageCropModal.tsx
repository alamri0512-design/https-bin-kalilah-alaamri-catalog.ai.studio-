import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Trash2,
  Check,
  X,
  Sliders,
  Sun,
  Contrast as ContrastIcon,
  Palette,
  Download,
  RotateCcw as ResetIcon,
  Sparkles,
} from 'lucide-react';

interface ImageCropModalProps {
  language: Language;
  imageUrl: string;
  onCropSave: (croppedDataUrl: string) => void;
  onDeleteImage?: () => void;
  onClose: () => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  language,
  imageUrl,
  onCropSave,
  onDeleteImage,
  onClose,
}) => {
  const isAr = language === 'ar';

  const [aspectRatio, setAspectRatio] = useState<string>('free'); // free, 16:9, 3:4, 1:1, 4:3, fill
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Filters & Color Adjustments
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [blur, setBlur] = useState<number>(0);
  const [isGrayscale, setIsGrayscale] = useState<boolean>(false);
  const [isSepia, setIsSepia] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'crop' | 'adjust' | 'presets'>('crop');
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    drawCanvas();
  }, [
    imageUrl,
    zoom,
    rotation,
    flipH,
    flipV,
    aspectRatio,
    brightness,
    contrast,
    saturation,
    blur,
    isGrayscale,
    isSepia,
  ]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Setup Target Dimensions
      let targetWidth = 600;
      let targetHeight = 600;

      if (aspectRatio === '16:9') targetHeight = (targetWidth * 9) / 16;
      else if (aspectRatio === '3:4') targetHeight = (targetWidth * 4) / 3;
      else if (aspectRatio === '4:3') targetHeight = (targetWidth * 3) / 4;
      else if (aspectRatio === '1:1') targetHeight = targetWidth;
      else if (aspectRatio === 'fill' || aspectRatio === 'original') {
        targetWidth = img.width || 800;
        targetHeight = img.height || 600;
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.clearRect(0, 0, targetWidth, targetHeight);
      ctx.save();

      // Filter string
      let filterStr = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;
      if (isGrayscale) filterStr += ' grayscale(100%)';
      if (isSepia) filterStr += ' sepia(100%)';
      ctx.filter = filterStr;

      // Transform
      ctx.translate(targetWidth / 2, targetHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -zoom : zoom, flipV ? -zoom : zoom);

      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
    };
    img.src = imageUrl;
  };

  const handleApplyCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onCropSave(croppedDataUrl);
    onClose();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `edited-image-${Date.now()}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
  };

  const resetAllAdjustments = () => {
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setIsGrayscale(false);
    setIsSepia(false);
  };

  const applyPreset = (preset: string) => {
    resetAllAdjustments();
    if (preset === 'vivid') {
      setContrast(120);
      setSaturation(150);
    } else if (preset === 'golden') {
      setBrightness(110);
      setContrast(110);
      setSaturation(125);
    } else if (preset === 'bw') {
      setIsGrayscale(true);
      setContrast(125);
    } else if (preset === 'vintage') {
      setIsSepia(true);
      setBrightness(105);
      setContrast(95);
    } else if (preset === 'soft') {
      setBrightness(105);
      setContrast(90);
      setBlur(1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#0D1B2E] border border-[#C9A84C]/50 rounded-2xl max-w-3xl w-full p-5 text-white shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#C9A84C]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#C9A84C]">
                {isAr ? 'محرر ومصمم الصور الشامل والاحترافي' : 'Comprehensive Image Crop & Edit Studio'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isAr ? 'قص، تدوير، تحسين الألوان والتأثيرات مع الحفظ الفوري' : 'Crop, rotate, enhance colors, filters & instant save'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Preview Box */}
        <div className="bg-[#060D18] rounded-xl p-3 border border-slate-800 flex items-center justify-center overflow-hidden min-h-[260px] max-h-[360px] relative shrink-0">
          <canvas ref={canvasRef} className="max-w-full max-h-[340px] object-contain shadow-2xl rounded-lg" />
          <div className="absolute top-3 left-3 bg-[#0A1628]/80 backdrop-blur text-[10px] text-amber-400 font-mono px-2 py-1 rounded border border-[#C9A84C]/30">
            {zoom.toFixed(1)}x | {rotation}° | {brightness}% Bright
          </div>
        </div>

        {/* Controls Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-800 mt-3 pb-2 shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('crop')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeTab === 'crop'
                ? 'bg-[#C9A84C] text-[#0A1628]'
                : 'bg-[#13233A] text-slate-300 hover:bg-slate-700'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isAr ? 'القص والتحويل' : 'Crop & Transform'}</span>
          </button>

          <button
            onClick={() => setActiveTab('adjust')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeTab === 'adjust'
                ? 'bg-[#C9A84C] text-[#0A1628]'
                : 'bg-[#13233A] text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isAr ? 'تعديل الألوان والسطوع' : 'Color & Brightness'}</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeTab === 'presets'
                ? 'bg-[#C9A84C] text-[#0A1628]'
                : 'bg-[#13233A] text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>{isAr ? 'التأثيرات الجاهزة' : 'Presets'}</span>
          </button>

          <button
            onClick={resetAllAdjustments}
            className="mr-auto px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] flex items-center gap-1"
            title={isAr ? 'إعادة التعيين الافتراضية' : 'Reset All'}
          >
            <ResetIcon className="w-3 h-3" />
            <span>{isAr ? 'إعادة ضبط' : 'Reset'}</span>
          </button>
        </div>

        {/* Tab Controls Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 text-xs scrollbar-thin">
          {/* TAB 1: CROP & TRANSFORM */}
          {activeTab === 'crop' && (
            <div className="space-y-3">
              {/* Aspect Ratios */}
              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  {isAr ? 'نسبة قص الصورة:' : 'Aspect Ratio:'}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'free', label: isAr ? 'قص حر' : 'Free' },
                    { id: '16:9', label: '16:9 (عريض)' },
                    { id: '3:4', label: '3:4 (عمودي)' },
                    { id: '1:1', label: '1:1 (مربع)' },
                    { id: '4:3', label: '4:3 (شاشة)' },
                    { id: 'fill', label: isAr ? 'الأبعاد الأصلية' : 'Original' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setAspectRatio(item.id)}
                      className={`px-3 py-1 rounded-lg border font-bold text-[11px] transition ${
                        aspectRatio === item.id
                          ? 'bg-[#C9A84C] text-[#0A1628] border-[#C9A84C]'
                          : 'bg-[#13233A] text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zoom Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300 font-bold text-[11px]">
                  <span>{isAr ? 'التكبير / التصغير (Zoom):' : 'Zoom Level:'}</span>
                  <span className="text-[#C9A84C] font-mono">{zoom.toFixed(1)}x</span>
                </div>
                <div className="flex items-center gap-3">
                  <ZoomOut className="w-4 h-4 text-slate-400 cursor-pointer" onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))} />
                  <input
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 accent-[#C9A84C]"
                  />
                  <ZoomIn className="w-4 h-4 text-slate-400 cursor-pointer" onClick={() => setZoom((z) => Math.min(5, z + 0.2))} />
                </div>
              </div>

              {/* Rotate & Flips */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setRotation((prev) => (prev - 90) % 360)}
                    className="p-2 bg-[#13233A] hover:bg-[#1E3352] rounded-lg border border-slate-700 text-slate-200 flex items-center gap-1"
                    title={isAr ? 'تدوير -90' : 'Rotate Left'}
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#C9A84C]" />
                    <span>-90°</span>
                  </button>

                  <button
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    className="p-2 bg-[#13233A] hover:bg-[#1E3352] rounded-lg border border-slate-700 text-slate-200 flex items-center gap-1"
                    title={isAr ? 'تدوير +90' : 'Rotate Right'}
                  >
                    <RotateCw className="w-3.5 h-3.5 text-[#C9A84C]" />
                    <span>+90°</span>
                  </button>

                  <button
                    onClick={() => setFlipH((prev) => !prev)}
                    className={`p-2 rounded-lg border flex items-center gap-1 ${
                      flipH
                        ? 'bg-[#C9A84C] text-[#0A1628] border-[#C9A84C]'
                        : 'bg-[#13233A] text-slate-200 border-slate-700'
                    }`}
                  >
                    <FlipHorizontal className="w-3.5 h-3.5" />
                    <span>{isAr ? 'قلب أفقي' : 'Flip H'}</span>
                  </button>

                  <button
                    onClick={() => setFlipV((prev) => !prev)}
                    className={`p-2 rounded-lg border flex items-center gap-1 ${
                      flipV
                        ? 'bg-[#C9A84C] text-[#0A1628] border-[#C9A84C]'
                        : 'bg-[#13233A] text-slate-200 border-slate-700'
                    }`}
                  >
                    <FlipVertical className="w-3.5 h-3.5" />
                    <span>{isAr ? 'قلب رأسي' : 'Flip V'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COLOR ADJUSTMENTS */}
          {activeTab === 'adjust' && (
            <div className="space-y-3">
              {/* Brightness */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300 font-bold text-[11px]">
                  <span className="flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    {isAr ? 'السطوع (Brightness):' : 'Brightness:'}
                  </span>
                  <span className="text-[#C9A84C] font-mono">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full accent-[#C9A84C]"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300 font-bold text-[11px]">
                  <span className="flex items-center gap-1">
                    <ContrastIcon className="w-3.5 h-3.5 text-blue-400" />
                    {isAr ? 'التباين (Contrast):' : 'Contrast:'}
                  </span>
                  <span className="text-[#C9A84C] font-mono">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value))}
                  className="w-full accent-[#C9A84C]"
                />
              </div>

              {/* Saturation */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300 font-bold text-[11px]">
                  <span className="flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-emerald-400" />
                    {isAr ? 'تشبع الألوان (Saturation):' : 'Saturation:'}
                  </span>
                  <span className="text-[#C9A84C] font-mono">{saturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => setSaturation(parseInt(e.target.value))}
                  className="w-full accent-[#C9A84C]"
                />
              </div>

              {/* Blur */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300 font-bold text-[11px]">
                  <span>{isAr ? 'التنعيم والضبابية (Blur):' : 'Blur Filter:'}</span>
                  <span className="text-[#C9A84C] font-mono">{blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={blur}
                  onChange={(e) => setBlur(parseInt(e.target.value))}
                  className="w-full accent-[#C9A84C]"
                />
              </div>

              {/* Quick Filter Toggles */}
              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setIsGrayscale(!isGrayscale)}
                  className={`flex-1 py-1.5 rounded-lg border font-bold text-center transition ${
                    isGrayscale
                      ? 'bg-[#C9A84C] text-[#0A1628] border-[#C9A84C]'
                      : 'bg-[#13233A] text-slate-300 border-slate-700'
                  }`}
                >
                  {isAr ? 'أبيض وأسود' : 'Grayscale'}
                </button>

                <button
                  onClick={() => setIsSepia(!isSepia)}
                  className={`flex-1 py-1.5 rounded-lg border font-bold text-center transition ${
                    isSepia
                      ? 'bg-[#C9A84C] text-[#0A1628] border-[#C9A84C]'
                      : 'bg-[#13233A] text-slate-300 border-slate-700'
                  }`}
                >
                  {isAr ? 'تأثير السيبيا الكلاسيكي' : 'Sepia'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PRESETS */}
          {activeTab === 'presets' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'normal', nameAr: 'طبيعي عادي', nameEn: 'Normal' },
                { id: 'vivid', nameAr: 'ألوان حية مشبعة', nameEn: 'Vivid Colors' },
                { id: 'golden', nameAr: 'لمعة ذهبية فاخرة', nameEn: 'Golden Glow' },
                { id: 'bw', nameAr: 'أسود وأبيض متباين', nameEn: 'B&W Contrast' },
                { id: 'vintage', nameAr: 'تراثي كلاسيكي', nameEn: 'Vintage' },
                { id: 'soft', nameAr: 'ناعم وضبابي خفيف', nameEn: 'Soft Blur' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className="p-3 bg-[#13233A] hover:bg-[#1E3352] border border-slate-700 hover:border-[#C9A84C] rounded-xl text-center text-slate-200 font-bold transition flex flex-col items-center justify-center gap-1"
                >
                  <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                  <span>{isAr ? p.nameAr : p.nameEn}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-700 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div>
            {onDeleteImage && (
              <div>
                {confirmDelete ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-rose-400 font-bold">{isAr ? 'تأكيد الحذف؟' : 'Confirm?'}</span>
                    <button
                      onClick={() => {
                        onDeleteImage();
                        onClose();
                      }}
                      className="px-2 py-1 bg-rose-600 text-white font-bold rounded text-xs"
                    >
                      {isAr ? 'نعم' : 'Yes'}
                    </button>
                    <button onClick={() => setConfirmDelete(false)} className="px-2 py-1 bg-slate-700 rounded text-xs">
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="p-2 bg-rose-950/60 text-rose-300 border border-rose-800 rounded-lg hover:bg-rose-900 flex items-center gap-1 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'حذف الصورة' : 'Delete'}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleDownload}
              className="p-2 bg-[#13233A] text-amber-300 hover:bg-[#1E3352] border border-slate-700 rounded-xl font-bold text-xs flex items-center gap-1"
              title={isAr ? 'تحميل الصورة المعدلة' : 'Download Image'}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isAr ? 'تحميل' : 'Download'}</span>
            </button>

            <button onClick={onClose} className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs">
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              onClick={handleApplyCrop}
              className="px-5 py-2 rounded-xl bg-[#C9A84C] text-[#0A1628] hover:bg-[#D8B65C] font-extrabold text-xs shadow-lg flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isAr ? 'حفظ وتطبيق جميع التغيرات' : 'Save & Apply All Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

