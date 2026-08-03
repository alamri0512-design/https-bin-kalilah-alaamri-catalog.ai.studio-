```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>بن كليلة العامري - الكتالوج الرقمي</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <!-- Cropper.js for image editing -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>
    <style>
        @layer base {
            html, body { margin: 0; padding: 0; }
            body { overscroll-behavior: none; font-family: 'Tajawal', 'Plus Jakarta Sans', sans-serif; background: #fcf9f8; }
            main>:first-child { margin-top: 0 !important; }
            main>:last-child { margin-bottom: 0 !important; }
            ::-webkit-scrollbar { display: none; }
            [dir="ltr"] { direction: ltr; text-align: left; }
            [dir="rtl"] { direction: rtl; text-align: right; }
        }
        .glass { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); }
        .glass-dark { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.1); }
        .glass-gold { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); background: rgba(201,168,76,0.25); border: 1px solid rgba(201,168,76,0.4); }
        .admin-toggle { position: fixed; bottom: 100px; right: 24px; z-index: 999; }
        ::-webkit-scrollbar { display: none; }
        .fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .product-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px -12px rgba(0,0,0,0.25); transition: all 0.3s ease; }
        .lang-toggle { cursor: pointer; }
    </style>
</head>
<body class="bg-background text-on-background">

    <!-- ===== HEADER ===== -->
    <header class="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-t-2 border-secondary shadow-[0_4px_30px_rgba(0,33,71,0.05)]">
        <div class="h-20 max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <img id="siteLogo" alt="Bin Kalilah Shield Logo" class="h-10 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcQtNHchtzYFI7dqMlM7HJcOOTp_svLnBjseKYaWnzzM7uu0tqK10HaW1hJGRovUfrA2pTO1_OTbclcXOlFEoH1DNjekGIojcUbz7FNKGsy_-SI5riNGoIDgfnGNqQ-KIMKgucBwZdeSz3Iiqv_fRSDgwqk5xCsf9q2vMUH6r75X-Hpu9I6PsFYLobBqLt3vldWoKIC7ATRuANIXN4ECljP9x8TuQ1mLMYkv5F6F28utT780AbETwLkb8BduSZu4CbGzqVW_A9muA"/>
                <span class="font-headline-sm text-headline-sm text-primary tracking-tight" id="companyName">بن كليلة العامري</span>
            </div>
            <nav class="hidden lg:flex items-center gap-6">
                <a class="text-secondary font-bold border-b-2 border-secondary px-2" href="#">الرئيسية</a>
                <a class="text-on-surface-variant hover:text-primary transition-all" href="#">الكتالوج</a>
                <a class="text-on-surface-variant hover:text-primary transition-all" href="#">بوابة B2B</a>
                <a class="text-on-surface-variant hover:text-primary transition-all" href="#">الشحن</a>
                <a class="text-on-surface-variant hover:text-primary transition-all" href="#">التتبع</a>
            </nav>
            <div class="flex items-center gap-4">
                <!-- Language Toggle -->
                <button id="langToggle" class="flex items-center gap-1 text-sm font-semibold text-primary bg-primary-container px-3 py-1 rounded-full">
                    <span class="material-symbols-outlined text-base">translate</span>
                    <span id="langLabel">EN</span>
                </button>
                <!-- WhatsApp -->
                <a class="flex items-center gap-2 text-secondary hover:text-secondary-fixed-dim transition-colors" href="https://wa.me/96899088000">
                    <span class="material-symbols-outlined">support_agent</span>
                    <span class="hidden md:inline text-xs font-medium">واتساب</span>
                </a>
                <!-- Admin icon -->
                <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer" id="adminIcon">
                    <span class="material-symbols-outlined text-on-primary text-[18px]">settings</span>
                </div>
            </div>
        </div>
    </header>

    <!-- ===== MAIN ===== -->
    <main class="w-full pt-20 bg-background min-h-screen">

        <!-- ===== HERO SECTION ===== -->
        <section class="relative w-full h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-primary" id="heroSection">
            <div class="absolute inset-0 z-0">
                <div class="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary z-10"></div>
                <div class="w-full h-full bg-cover bg-center" id="heroBg" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDqL5v1Eflhdd84BghqV9AETjTXgvWzgDeg9YgnBZBjfPa8D_s5xV3hC6GI1eCdM0HPNhdFLnLtHX3M3rFzNyijUEE-gvo212Qb9xH6JMHqzuzCGqLc6oHP3mDe_8Q2bZvh_lzWbjFvuEFxG1XWgjeAn6q3c4dbw02Iw9rrTJrlRgFjA_zjxa3G5hZhD-Nwb22PXVjLwRCFed19v6rhZ-UUFJcvoo2m3FvKRPfiVu8s4HxNkvhOwOCLcSPLEDYE6gCd2irtlZQ_I9U');"></div>
            </div>
            <div class="relative z-20 flex flex-col items-center text-center px-4 max-w-4xl">
                <div class="mb-8">
                    <img id="heroLogo" alt="Logo" class="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-[0_0_30px_rgba(255,224,136,0.3)]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcQtNHchtzYFI7dqMlM7HJcOOTp_svLnBjseKYaWnzzM7uu0tqK10HaW1hJGRovUfrA2pTO1_OTbclcXOlFEoH1DNjekGIojcUbz7FNKGsy_-SI5riNGoIDgfnGNqQ-KIMKgucBwZdeSz3Iiqv_fRSDgwqk5xCsf9q2vMUH6r75X-Hpu9I6PsFYLobBqLt3vldWoKIC7ATRuANIXN4ECljP9x8TuQ1mLMYkv5F6F28utT780AbETwLkb8BduSZu4CbGzqVW_A9muA"/>
                </div>
                <h1 class="font-display-lg text-display-lg text-on-primary mb-4 tracking-tight">
                    <span class="block text-secondary-fixed" id="heroTitle">بن كليلة العامري</span>
                    <span id="heroSubtitle" class="text-2xl md:text-4xl font-light">Bin Kalilah Al-Aamri</span>
                </h1>
                <p class="font-body-lg text-body-lg text-on-primary/80 mb-10 max-w-2xl mx-auto" id="heroDesc">Architecting the future of global commodity exchange through the historic maritime gateway of Oman. Precision. Transparency. Legacy.</p>
                <div class="flex flex-wrap items-center justify-center gap-6">
                    <button class="px-10 py-4 bg-secondary text-on-secondary font-label-md text-label-md rounded-lg shadow-xl hover:bg-secondary-fixed-dim transition-all flex items-center gap-2 group">
                        دخول بوابة B2B
                        <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                    <button class="px-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-on-primary font-label-md text-label-md rounded-lg hover:bg-white/20 transition-all">
                        عرض الكتالوج
                    </button>
                </div>
            </div>
        </section>

        <!-- ===== PRODUCT CATALOG ===== -->
        <section class="w-full py-24 bg-surface relative" id="catalogSection">
            <div class="max-w-[1440px] mx-auto px-4 md:px-8">
                <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div class="max-w-xl">
                        <span class="font-label-sm text-label-sm text-secondary uppercase tracking-[0.3em] mb-4 block">المخزون المؤسسي</span>
                        <h2 class="font-headline-md text-headline-md text-primary" id="catalogTitle">الكتالوج الديناميكي</h2>
                        <p class="font-body-md text-body-md text-on-surface-variant mt-4" id="catalogDesc">تقييمات السوق الفورية للمواد الغذائية الصناعية بالجملة. شراء مباشر من المنشأ إلى مركز التوزيع الخاص بك.</p>
                    </div>
                    <div class="flex gap-2 bg-surface-container p-1 rounded-lg" id="currencySwitcher">
                        <button class="px-6 py-2 bg-white shadow-sm rounded-md font-label-sm text-label-sm text-primary" data-currency="OMR">OMR</button>
                        <button class="px-6 py-2 hover:bg-white/50 rounded-md font-label-sm text-label-sm text-on-surface-variant transition-all" data-currency="USD">USD</button>
                        <button class="px-6 py-2 hover:bg-white/50 rounded-md font-label-sm text-label-sm text-on-surface-variant transition-all" data-currency="SAR">SAR</button>
                        <button class="px-6 py-2 hover:bg-white/50 rounded-md font-label-sm text-label-sm text-on-surface-variant transition-all" data-currency="AED">AED</button>
                    </div>
                </div>
                <div id="productGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- Products will be rendered dynamically -->
                </div>
            </div>
        </section>

        <!-- ===== B2B PORTAL ===== -->
        <section class="w-full py-24 bg-primary text-on-primary relative" id="b2bSection">
            <div class="max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div class="lg:col-span-5 flex flex-col justify-center">
                    <h2 class="font-headline-md text-display-lg-mobile md:text-headline-md mb-6" id="b2bTitle">هندسة البيان</h2>
                    <p class="font-body-lg text-body-lg text-on-primary/70 mb-12" id="b2bDesc">يتيح لك منشئ البيان الرقمي تحسين استخدام الحاويات في الوقت الفعلي. حدد الحمولة، واحسب الحجم، وقدم طلبات عروض الأسعار الرسمية مباشرة إلى مكتبنا اللوجستي.</p>
                    <div class="space-y-8">
                        <div class="flex items-start gap-4">
                            <div class="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                                <span class="material-symbols-outlined text-secondary">inventory_2</span>
                            </div>
                            <div>
                                <h4 class="font-label-md text-label-md text-on-primary">سعة الحاوية</h4>
                                <p class="font-body-md text-label-sm text-on-primary/60">حساب تلقائي للمساحة بناءً على كثافة السلعة.</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-4">
                            <div class="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                                <span class="material-symbols-outlined text-secondary">verified_user</span>
                            </div>
                            <div>
                                <h4 class="font-label-md text-label-md text-on-primary">توريد عماني مباشر</h4>
                                <p class="font-body-md text-label-sm text-on-primary/60">متوافق تمامًا مع لوائح التجارة السلطانية والمعايير الدولية.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lg:col-span-7 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
                    <div class="space-y-10">
                        <div>
                            <label class="font-label-md text-label-md text-secondary-fixed block mb-6 uppercase tracking-widest">حدد الحمولة (طن متري)</label>
                            <input class="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-secondary" id="tonnageSlider" type="range" min="1" max="5000" value="250">
                            <div class="flex justify-between mt-4 font-headline-sm text-headline-sm">
                                <span id="tonnageValue">250 طن</span>
                                <span class="text-secondary-fixed" id="containerCount">11 حاوية (20 قدم)</span>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="bg-white/10 p-6 rounded-lg border border-white/5">
                                <span class="font-label-sm text-label-sm text-on-primary/50 block mb-2">المدة التقديرية</span>
                                <span class="font-headline-sm text-headline-sm" id="leadTime">12-14 يوم</span>
                            </div>
                            <div class="bg-white/10 p-6 rounded-lg border border-white/5">
                                <span class="font-label-sm text-label-sm text-on-primary/50 block mb-2">ميناء المنشأ</span>
                                <span class="font-headline-sm text-headline-sm">ميناء صلالة</span>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <input class="w-full bg-white/10 border-b border-white/20 py-4 px-2 focus:border-secondary outline-none transition-all font-body-md text-on-primary" placeholder="اسم الشركة" type="text" id="b2bCompany">
                            <textarea class="w-full bg-white/10 border-b border-white/20 py-4 px-2 focus:border-secondary outline-none transition-all font-body-md text-on-primary h-32" placeholder="متطلبات خاصة (شهادات، تعبئة...)" id="b2bRequirements"></textarea>
                        </div>
                        <button class="w-full py-5 bg-secondary hover:bg-secondary-fixed-dim text-on-secondary font-label-md text-label-md rounded-lg flex items-center justify-center gap-3 transition-all" onclick="sendB2BOrder()">
                            <span class="material-symbols-outlined">send</span>
                            إرسال عبر واتساب المؤسسي
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== TRACKER ===== -->
        <section class="w-full py-24 bg-surface-container relative" id="trackerSection">
            <div class="max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div class="order-2 lg:order-1">
                    <div class="w-full aspect-video rounded-2xl shadow-2xl border-8 border-white overflow-hidden relative group bg-primary/20">
                        <div class="absolute inset-0 bg-primary/20 pointer-events-none z-10"></div>
                        <div class="absolute top-6 left-6 z-20 bg-primary/90 backdrop-blur-md p-4 rounded-lg border border-white/10 text-on-primary">
                            <div class="flex items-center gap-2 mb-2">
                                <div class="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                                <span class="font-label-sm text-label-sm uppercase tracking-widest">حالة السفينة</span>
                            </div>
                            <p class="font-label-md text-label-md" id="vesselStatus">BK-Explorer II (في الطريق)</p>
                        </div>
                        <div class="absolute bottom-6 right-6 z-20 bg-secondary p-4 rounded-lg shadow-xl text-on-secondary font-label-sm text-label-sm" id="etaDisplay">
                            الوصول: صلالة 04:30 بتوقيت جرينتش
                        </div>
                    </div>
                </div>
                <div class="order-1 lg:order-2">
                    <span class="font-label-sm text-label-sm text-secondary uppercase tracking-[0.3em] mb-4 block">إدارة الأسطول</span>
                    <h2 class="font-headline-md text-headline-md text-primary mb-6">متتبع الشحنات اللحظي</h2>
                    <p class="font-body-md text-body-md text-on-surface-variant mb-10 leading-relaxed">تتبع شحناتك عالميًا بدقة متناهية. يوفر نظامنا عبر الأقمار الصناعية بيانات حية عن الظروف البيئية وموقع السفن ونوافذ الوصول المقدرة.</p>
                    <div class="space-y-4">
                        <div class="p-6 bg-white rounded-xl shadow-sm border-l-4 border-secondary flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <span class="material-symbols-outlined text-primary text-3xl">local_shipping</span>
                                <div>
                                    <h4 class="font-label-md text-label-md text-primary">مسقط HQ إلى ميناء صلالة</h4>
                                    <p class="font-label-sm text-label-sm text-on-surface-variant">#BK-77420-OM</p>
                                </div>
                            </div>
                            <span class="px-4 py-2 bg-surface-container rounded-md font-label-sm text-label-sm text-primary">92%</span>
                        </div>
                        <div class="p-6 bg-white/60 rounded-xl shadow-sm border-l-4 border-surface-variant flex items-center justify-between opacity-70">
                            <div class="flex items-center gap-4">
                                <span class="material-symbols-outlined text-on-surface-variant text-3xl">glass</span>
                                <div>
                                    <h4 class="font-label-md text-label-md text-primary">صلالة إلى جبل علي</h4>
                                    <p class="font-label-sm text-label-sm text-on-surface-variant">في انتظار المغادرة</p>
                                </div>
                            </div>
                            <span class="px-4 py-2 bg-surface-container rounded-md font-label-sm text-label-sm text-on-surface-variant">مجدول</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== ADMIN PANEL (Hidden modal) ===== -->
        <div id="adminModal" class="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 hidden">
            <div class="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-10 relative">
                <button class="absolute top-4 right-4 text-on-surface-variant hover:text-primary" onclick="toggleAdmin(false)"><span class="material-symbols-outlined">close</span></button>
                <h2 class="font-headline-md text-headline-md text-primary mb-6">مركز القيادة الإداري</h2>
                <!-- Password gate -->
                <div id="adminGate" class="mb-8">
                    <label class="font-label-md text-label-md block mb-2">كلمة المرور</label>
                    <div class="flex gap-4">
                        <input type="password" id="adminPassword" class="border rounded-lg px-4 py-2 w-full max-w-xs" placeholder="أدخل كلمة المرور">
                        <button class="px-6 py-2 bg-primary text-on-primary rounded-lg" onclick="unlockAdmin()">فتح</button>
                    </div>
                    <p id="adminError" class="text-red-500 text-sm mt-2 hidden">كلمة المرور غير صحيحة</p>
                </div>
                <div id="adminContent" class="hidden">
                    <!-- Tabs -->
                    <div class="flex flex-wrap gap-2 border-b border-surface-variant pb-4 mb-6">
                        <button class="tab-btn px-4 py-2 rounded-t-lg bg-primary text-on-primary" data-tab="products">المنتجات</button>
                        <button class="tab-btn px-4 py-2 rounded-t-lg hover:bg-surface-container" data-tab="hero">الخلفيات</button>
                        <button class="tab-btn px-4 py-2 rounded-t-lg hover:bg-surface-container" data-tab="branding">الشعار والنصوص</button>
                        <button class="tab-btn px-4 py-2 rounded-t-lg hover:bg-surface-container" data-tab="gallery">معرض الصور</button>
                        <button class="tab-btn px-4 py-2 rounded-t-lg hover:bg-surface-container" data-tab="backup">النسخ الاحتياطي</button>
                    </div>
                    <!-- Products Tab -->
                    <div id="tab-products" class="tab-content">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-headline-sm text-headline-sm">إدارة المنتجات</h3>
                            <button onclick="addProduct()" class="px-4 py-2 bg-secondary text-on-secondary rounded-lg flex items-center gap-2"><span class="material-symbols-outlined">add</span>إضافة منتج</button>
                        </div>
                        <div id="adminProductList" class="space-y-4 max-h-96 overflow-y-auto"></div>
                    </div>
                    <!-- Hero Tab -->
                    <div id="tab-hero" class="tab-content hidden">
                        <h3 class="font-headline-sm text-headline-sm mb-4">إدارة خلفيات الهيرو</h3>
                        <div class="flex gap-4 flex-wrap">
                            <input type="file" accept="image/*" id="heroUpload" class="hidden" multiple>
                            <button onclick="document.getElementById('heroUpload').click()" class="px-4 py-2 bg-primary text-on-primary rounded-lg">رفع صور</button>
                            <label class="flex items-center gap-2"><span>سرعة العرض:</span>
                                <select id="heroSpeed" class="border rounded px-2 py-1">
                                    <option value="5000">5 ثواني</option>
                                    <option value="10000" selected>10 ثواني</option>
                                    <option value="15000">15 ثانية</option>
                                </select>
                            </label>
                        </div>
                        <div id="heroImageList" class="grid grid-cols-3 gap-4 mt-4"></div>
                    </div>
                    <!-- Branding Tab -->
                    <div id="tab-branding" class="tab-content hidden">
                        <h3 class="font-headline-sm text-headline-sm mb-4">الشعار والنصوص</h3>
                        <div class="space-y-4">
                            <div><label>رفع شعار:</label><input type="file" accept="image/*" id="logoUpload" class="block mt-1"></div>
                            <div><label>عنوان الهيرو (عربي):</label><input type="text" id="heroTitleAr" class="border rounded w-full px-3 py-2 mt-1"></div>
                            <div><label>عنوان الهيرو (إنجليزي):</label><input type="text" id="heroTitleEn" class="border rounded w-full px-3 py-2 mt-1"></div>
                            <div><label>نص الهيرو:</label><textarea id="heroDescText" class="border rounded w-full px-3 py-2 mt-1" rows="3"></textarea></div>
                            <div><label>نص "من نحن":</label><textarea id="aboutText" class="border rounded w-full px-3 py-2 mt-1" rows="4"></textarea></div>
                            <button onclick="saveBranding()" class="px-6 py-2 bg-secondary text-on-secondary rounded-lg">حفظ التغييرات</button>
                        </div>
                    </div>
                    <!-- Gallery Tab -->
                    <div id="tab-gallery" class="tab-content hidden">
                        <h3 class="font-headline-sm text-headline-sm mb-4">معرض الصور المركزي</h3>
                        <div id="galleryGrid" class="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto"></div>
                    </div>
                    <!-- Backup Tab -->
                    <div id="tab-backup" class="tab-content hidden">
                        <h3 class="font-headline-sm text-headline-sm mb-4">النسخ الاحتياطي والاستعادة</h3>
                        <div class="flex gap-4 flex-wrap">
                            <button onclick="exportBackup()" class="px-6 py-2 bg-primary text-on-primary rounded-lg">تصدير JSON</button>
                            <button onclick="document.getElementById('importJson').click()" class="px-6 py-2 bg-secondary text-on-secondary rounded-lg">استيراد JSON</button>
                            <input type="file" accept=".json" id="importJson" class="hidden" onchange="importBackup(event)">
                            <button onclick="clearAllAssets()" class="px-6 py-2 bg-red-600 text-white rounded-lg">مسح كافة الأصول</button>
                        </div>
                        <div class="mt-6">
                            <h4 class="font-label-md">سجل العمليات</h4>
                            <div id="logList" class="bg-surface-container p-4 rounded-lg max-h-48 overflow-y-auto text-sm font-mono"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ===== FLOATING WHATSAPP ===== -->
        <div class="fixed bottom-8 right-8 z-[100]">
            <a href="https://wa.me/96899088000" target="_blank" class="block w-16 h-16 rounded-full bg-[#25D366] shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-white text-3xl">chat</span>
            </a>
        </div>

        <!-- ===== FOOTER ===== -->
        <footer class="w-full bg-primary text-on-primary py-16">
            <div class="max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <img id="footerLogo" alt="Logo" class="h-12 w-auto object-contain brightness-0 invert" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcQtNHchtzYFI7dqMlM7HJcOOTp_svLnBjseKYaWnzzM7uu0tqK10HaW1hJGRovUfrA2pTO1_OTbclcXOlFEoH1DNjekGIojcUbz7FNKGsy_-SI5riNGoIDgfnGNqQ-KIMKgucBwZdeSz3Iiqv_fRSDgwqk5xCsf9q2vMUH6r75X-Hpu9I6PsFYLobBqLt3vldWoKIC7ATRuANIXN4ECljP9x8TuQ1mLMYkv5F6F28utT780AbETwLkb8BduSZu4CbGzqVW_A9muA"/>
                    <p class="font-body-md text-label-sm text-on-primary/70 leading-relaxed mt-4">بناء إرث تجاري عالمي من خلال الدقة والشفافية وتراث عُمان.</p>
                </div>
                <div><h4 class="font-label-md text-label-md text-secondary-fixed mb-4 uppercase tracking-widest">الحوكمة</h4>
                    <ul class="space-y-2 text-on-primary/80"><li>مجلس الإدارة</li><li>المعايير الأخلاقية</li><li>الميثاق المؤسسي</li></ul>
                </div>
                <div><h4 class="font-label-md text-label-md text-secondary-fixed mb-4 uppercase tracking-widest">علاقات المستثمرين</h4>
                    <ul class="space-y-2 text-on-primary/80"><li>التقارير السنوية 2023</li><li>الخارطة الاستراتيجية</li><li>نتائج التدقيق</li></ul>
                </div>
                <div><h4 class="font-label-md text-label-md text-secondary-fixed mb-4 uppercase tracking-widest">اتصل بنا</h4>
                    <p>مسقط، سلطنة عُمان</p>
                    <p>+968 990 88000</p>
                    <p>contact@binkalilah.om</p>
                </div>
            </div>
            <div class="max-w-[1440px] mx-auto px-4 md:px-8 mt-12 pt-8 border-t border-on-primary/10 text-center font-label-sm text-label-sm text-on-primary/50">
                © 2024 بن كليلة العامري. جميع الحقوق محفوظة. تفويض الشفافية المؤسسية.
            </div>
        </footer>
    </main>

    <script>
        // ============================================================
        // GLOBAL STATE & INDEXEDDB
        // ============================================================
        const DB_NAME = 'BinKalilahCatalog';
        const DB_VERSION = 1;
        const STORE_NAME = 'data';

        let db = null;
        let currentLang = 'ar'; // 'ar' or 'en'
        let currentCurrency = 'OMR';
        let exchangeRates = { OMR: 1, USD: 2.6, SAR: 9.75, AED: 9.55 }; // approximate

        // Default data structure
        const defaultData = {
            products: [
                { id: 'p1', nameAr: 'دقيق الخريف رقم 1', nameEn: 'Al-Khareef Flour No.1', descriptionAr: 'دقيق فاخر', descriptionEn: 'Premium flour', weights: ['1kg','2kg','5kg','10kg','25kg','50kg'], defaultWeight: '25kg', price: 0.245, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5qqcVeSQdQKI2nPr5AcyZ_QQLFBnYO-uImaSCJzWaeKLlc2Nh3LPjQIfJqxJ4_gtYCm97KfSBpg1GhVyMGBwXH1im_zigJd2fO60ba2gac_SAZU05miyGht5XYC7s6xnxX2JxLnbMYEZa0tR4gTherL9PIuVaac07c0PVIu0Up_DMyCZ5SC4rodlAhnlZeGhOZ__osHQe329wnRZCJgw93uefyotF6pRjfy4ctx47_ig9ifCKMYUU_5UfT5CANCLtN33gFiI_T8Y', category: 'flour' },
                { id: 'p2', nameAr: 'سكر الخريف الأبيض', nameEn: 'Al-Khareef White Sugar', descriptionAr: 'سكر مكرر ICUMSA 45', descriptionEn: 'Refined sugar ICUMSA 45', weights: ['1kg','2kg','5kg','10kg','25kg','50kg'], defaultWeight: '25kg', price: 0.310, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTyHmFkx9AkJedT0mn3K890GrKyDEU2x84PJX3n_0UPN_aHcui7txVdJBfMcgKZiwbRmOzx6iTlYSLjMgYXj5S0tHzN6r7NLpH1BUClX-Xmmpq5ela01VlBXsdy6LLZnuE-WG1QM_-CD-NyEL5E08SZx49e5b6uX_B-WdvaP7bHCBIowdNfQwJKednMp1qFcLd93bvN_hFSYvwM5S2d7jUjXqoYdgXF1Qa2hAt9pw3zOD_3JyqpHrvKr9XcQ2ZHIabTg1b2GuNyKE', category: 'sugar' },
                { id: 'p3', nameAr: 'باستا سباغيتي', nameEn: 'Spaghetti Pasta', descriptionAr: 'مكرونة إيطالية', descriptionEn: 'Italian pasta', weights: ['400g','500g','5kg','10kg'], defaultWeight: '5kg', price: 0.185, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkkFOX_Yy6pyLCxx0c4vLL4BNVTA3B_x7nowSsqyURTQrdeJnSOn2NvkoZFP6ScZ1btK0Acd5bWRLOE-Al-6-Q7MBwx8Wl7DQRKaR_Bj_HqoHIbAnWkBm9sNinIDsyOI_F5hgus7RXHZdTZ_KUWXk59TBFySxvCVJDKyxjbWyfh4Mlvon_HeqwgSiIiToCHFinkdscKeon_NrCrX9Qfl_Nky4BhicmMtAK-m-mcXHq4c40clpyNHGRNTBSAWQ_s6nVAtpDmnv8YZE', category: 'pasta' },
                { id: 'p4', nameAr: 'حليب مجفف كامل الدسم', nameEn: 'Full-Cream Milk Powder', descriptionAr: 'حليب سريع الذوبان', descriptionEn: 'Instant milk powder', weights: ['25kg'], defaultWeight: '25kg', price: 1.450, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB218zlJ2AiaIQnLXJhd34YXqpcllUZACotTF_lDdXyh5ZKUzOaCeaWPqGLHE1ZNhskul4S25CziokqVrVi2bPODdLRB0l34MNRyzmIPMk9qtnyDIXGQChHhH9cuxhPgpfCI2RpgaY7h9SaeaxBESJhKOXdrFnvB2hAmbficB6fxyqgBfquF3r4ZvGcvNePm0S5mbWVHOVUGfT6yuotebtavucLJZh_k2dnn3w3Y5-XjRXgkT0GwjY-aeuL9x1F9Kqpo-uIn3TOAeU', category: 'milk' }
            ],
            heroImages: [
                'https://lh3.googleusercontent.com/aida-public/AB6AXuDqL5v1Eflhdd84BghqV9AETjTXgvWzgDeg9YgnBZBjfPa8D_s5xV3hC6GI1eCdM0HPNhdFLnLtHX3M3rFzNyijUEE-gvo212Qb9xH6JMHqzuzCGqLc6oHP3mDe_8Q2bZvh_lzWbjFvuEFxG1XWgjeAn6q3c4dbw02Iw9rrTJrlRgFjA_zjxa3G5hZhD-Nwb22PXVjLwRCFed19v6rhZ-UUFJcvoo2m3FvKRPfiVu8s4HxNkvhOwOCLcSPLEDYE6gCd2irtlZQ_I9U'
            ],
            logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcQtNHchtzYFI7dqMlM7HJcOOTp_svLnBjseKYaWnzzM7uu0tqK10HaW1hJGRovUfrA2pTO1_OTbclcXOlFEoH1DNjekGIojcUbz7FNKGsy_-SI5riNGoIDgfnGNqQ-KIMKgucBwZdeSz3Iiqv_fRSDgwqk5xCsf9q2vMUH6r75X-Hpu9I6PsFYLobBqLt3vldWoKIC7ATRuANIXN4ECljP9x8TuQ1mLMYkv5F6F28utT780AbETwLkb8BduSZu4CbGzqVW_A9muA',
            heroTitleAr: 'بن كليلة العامري',
            heroTitleEn: 'Bin Kalilah Al-Aamri',
            heroDesc: 'Architecting the future of global commodity exchange through the historic maritime gateway of Oman. Precision. Transparency. Legacy.',
            aboutTextAr: 'نحن شركة بن كليلة العامري للتجارة والاستثمار، وكلاء إقليميون معتمدون لمطاحن صلالة (دقيق الخريف والمعكرونة) في اليمن والإمارات وأفريقيا، ووكلاء لمطاحن العمانية (منتجات بركات) في الإمارات واليمن.',
            aboutTextEn: 'We are Bin Kalilah Al-Aamri Trading & Investment Co., exclusive regional agents for Salalah Flour Mills (Al-Khareef flour & pasta) in Yemen, UAE, and Africa, and agents for Oman Mills (Barakat products) in UAE and Yemen.',
            heroSpeed: 10000,
            contact: { phone1: '+96899088000', phone2: '+96896070609', email: 'contact@binkalilah.om', whatsapp: 'https://wa.me/96899088000', map: 'https://maps.app.goo.gl/PA1CxY4vLxo55BrN7' }
        };

        let appData = { ...defaultData };
        let logHistory = [];
        let heroIndex = 0;
        let heroInterval = null;

        // ============================================================
        // DB INIT
        // ============================================================
        function initDB() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME, DB_VERSION);
                request.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        db.createObjectStore(STORE_NAME);
                    }
                };
                request.onsuccess = (e) => {
                    db = e.target.result;
                    resolve(db);
                };
                request.onerror = (e) => reject(e.target.error);
            });
        }

        async function loadData() {
            try {
                await initDB();
                const tx = db.transaction(STORE_NAME, 'readonly');
                const store = tx.objectStore(STORE_NAME);
                const req = store.get('appData');
                return new Promise((resolve) => {
                    req.onsuccess = () => {
                        if (req.result) {
                            appData = { ...defaultData, ...req.result };
                            if (!appData.products) appData.products = defaultData.products;
                            if (!appData.heroImages || appData.heroImages.length === 0) appData.heroImages = defaultData.heroImages;
                            if (!appData.logo) appData.logo = defaultData.logo;
                            resolve();
                        } else {
                            saveData();
                            resolve();
                        }
                    };
                    req.onerror = () => { appData = { ...defaultData }; saveData(); resolve(); };
                });
            } catch (e) {
                console.warn('DB error, using defaults', e);
                appData = { ...defaultData };
                saveData();
            }
        }

        async function saveData() {
            if (!db) await initDB();
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            store.put(appData, 'appData');
            const logTx = db.transaction(STORE_NAME, 'readwrite');
            const logStore = logTx.objectStore(STORE_NAME);
            logStore.put(logHistory, 'logHistory');
            addLog('تم حفظ البيانات');
            updateUI();
        }

        function addLog(msg) {
            const time = new Date().toLocaleString();
            logHistory.unshift({ time, msg });
            if (logHistory.length > 50) logHistory.pop();
            const logDiv = document.getElementById('logList');
            if (logDiv) {
                logDiv.innerHTML = logHistory.map(l => `<div>${l.time} - ${l.msg}</div>`).join('');
            }
        }

        // ============================================================
        // UI RENDER
        // ============================================================
        function updateUI() {
            renderProducts();
            renderHero();
            renderAdminProducts();
            renderGallery();
            renderHeroImages();
            updateBrandingFields();
            updateCurrencyButtons();
        }

        function renderProducts() {
            const grid = document.getElementById('productGrid');
            if (!grid) return;
            const lang = currentLang;
            grid.innerHTML = appData.products.map(p => {
                const name = lang === 'ar' ? p.nameAr : p.nameEn;
                const desc = lang === 'ar' ? p.descriptionAr : p.descriptionEn;
                const price = (p.price * exchangeRates[currentCurrency]).toFixed(3);
                return `
                    <div class="group relative bg-white overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 product-card">
                        <div class="h-64 overflow-hidden">
                            <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="${p.image || 'https://via.placeholder.com/400x300?text=Product'}" alt="${name}">
                        </div>
                        <div class="p-6">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h3 class="font-headline-sm text-headline-sm text-primary">${name}</h3>
                                    <p class="font-label-sm text-label-sm text-on-surface-variant">${desc}</p>
                                </div>
                            </div>
                            <div class="mt-8 pt-6 border-t border-surface-variant flex justify-between items-center">
                                <div>
                                    <span class="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest">سعر السوق</span>
                                    <span class="font-headline-sm text-headline-sm text-primary">${price} <span class="text-label-sm">${currentCurrency}</span></span>
                                </div>
                                <button onclick="addToB2B('${p.id}')" class="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-secondary transition-colors">
                                    <span class="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function renderHero() {
            const bg = document.getElementById('heroBg');
            if (bg && appData.heroImages.length > 0) {
                bg.style.backgroundImage = `url(${appData.heroImages[heroIndex]})`;
            }
            const titleEl = document.getElementById('heroTitle');
            const subEl = document.getElementById('heroSubtitle');
            const descEl = document.getElementById('heroDesc');
            if (titleEl) titleEl.textContent = currentLang === 'ar' ? appData.heroTitleAr : appData.heroTitleEn;
            if (subEl) subEl.textContent = currentLang === 'ar' ? '' : appData.heroTitleEn;
            if (descEl) descEl.textContent = appData.heroDesc;
        }

        function renderAdminProducts() {
            const list = document.getElementById('adminProductList');
            if (!list) return;
            list.innerHTML = appData.products.map((p, idx) => `
                <div class="flex items-center gap-4 bg-surface-container p-4 rounded-lg">
                    <img src="${p.image || 'https://via.placeholder.com/60'}" class="w-16 h-16 object-cover rounded" alt="">
                    <div class="flex-1">
                        <strong>${p.nameAr} / ${p.nameEn}</strong>
                        <span class="text-sm text-on-surface-variant">${p.weights.join(', ')}</span>
                    </div>
                    <button onclick="editProduct('${p.id}')" class="px-3 py-1 bg-primary text-on-primary rounded text-sm">تعديل</button>
                    <button onclick="deleteProduct('${p.id}')" class="px-3 py-1 bg-red-500 text-white rounded text-sm">حذف</button>
                </div>
            `).join('');
        }

        function renderGallery() {
            const gallery = document.getElementById('galleryGrid');
            if (!gallery) return;
            const allImages = [];
            if (appData.logo) allImages.push({ url: appData.logo, label: 'شعار' });
            appData.heroImages.forEach((img, i) => allImages.push({ url: img, label: `خلفية ${i+1}` }));
            appData.products.forEach(p => { if (p.image) allImages.push({ url: p.image, label: p.nameAr }); });
            gallery.innerHTML = allImages.map(img => `
                <div class="relative group">
                    <img src="${img.url}" class="w-full h-32 object-cover rounded-lg border border-surface-variant" alt="">
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <button onclick="window.open('${img.url}','_blank')" class="text-white text-xs bg-primary/70 px-2 py-1 rounded">عرض</button>
                        <button onclick="deleteImage('${img.url}')" class="text-white text-xs bg-red-500/70 px-2 py-1 rounded">حذف</button>
                    </div>
                    <p class="text-xs text-center mt-1">${img.label}</p>
                </div>
            `).join('');
        }

        function renderHeroImages() {
            const container = document.getElementById('heroImageList');
            if (!container) return;
            container.innerHTML = appData.heroImages.map((url, idx) => `
                <div class="relative group">
                    <img src="${url}" class="w-full h-24 object-cover rounded border" alt="">
                    <button onclick="removeHeroImage(${idx})" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">×</button>
                </div>
            `).join('');
        }

        function updateBrandingFields() {
            document.getElementById('heroTitleAr').value = appData.heroTitleAr || '';
            document.getElementById('heroTitleEn').value = appData.heroTitleEn || '';
            document.getElementById('heroDescText').value = appData.heroDesc || '';
            document.getElementById('aboutText').value = currentLang === 'ar' ? appData.aboutTextAr : appData.aboutTextEn;
        }

        function updateCurrencyButtons() {
            document.querySelectorAll('#currencySwitcher button').forEach(btn => {
                btn.classList.toggle('bg-white', btn.dataset.currency === currentCurrency);
                btn.classList.toggle('shadow-sm', btn.dataset.currency === currentCurrency);
            });
        }

        // ============================================================
        // LANGUAGE TOGGLE
        // ============================================================
        document.getElementById('langToggle').addEventListener('click', () => {
            currentLang = currentLang === 'ar' ? 'en' : 'ar';
            document.documentElement.lang = currentLang;
            document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
            document.getElementById('langLabel').textContent = currentLang === 'ar' ? 'EN' : 'عربي';
            updateUI();
            updateBrandingFields();
            localStorage.setItem('lang', currentLang);
        });

        const savedLang = localStorage.getItem('lang');
        if (savedLang) {
            currentLang = savedLang;
            document.documentElement.lang = currentLang;
            document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
            document.getElementById('langLabel').textContent = currentLang === 'ar' ? 'EN' : 'عربي';
        }

        // ============================================================
        // CURRENCY SWITCHER
        // ============================================================
        document.querySelectorAll('#currencySwitcher button').forEach(btn => {
            btn.addEventListener('click', () => {
                currentCurrency = btn.dataset.currency;
                updateUI();
            });
        });

        // ============================================================
        // TONNAGE SLIDER
        // ============================================================
        document.getElementById('tonnageSlider').addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            document.getElementById('tonnageValue').textContent = `${val} طن`;
            const containers = Math.ceil(val / 25);
            document.getElementById('containerCount').textContent = `${containers} حاوية (20 قدم)`;
        });

        // ============================================================
        // HERO SLIDESHOW
        // ============================================================
        function startHeroSlideshow() {
            if (heroInterval) clearInterval(heroInterval);
            const speed = appData.heroSpeed || 10000;
            heroInterval = setInterval(() => {
                if (appData.heroImages.length > 1) {
                    heroIndex = (heroIndex + 1) % appData.heroImages.length;
                    renderHero();
                }
            }, speed);
        }

        // ============================================================
        // ADMIN PANEL
        // ============================================================
        document.getElementById('adminIcon').addEventListener('click', () => toggleAdmin(true));

        function toggleAdmin(show) {
            const modal = document.getElementById('adminModal');
            if (show) {
                modal.classList.remove('hidden');
                document.getElementById('adminGate').classList.remove('hidden');
                document.getElementById('adminContent').classList.add('hidden');
                document.getElementById('adminPassword').value = '';
                document.getElementById('adminError').classList.add('hidden');
                renderAdminProducts();
                renderGallery();
                renderHeroImages();
                updateBrandingFields();
            } else {
                modal.classList.add('hidden');
            }
        }

        function unlockAdmin() {
            const pwd = document.getElementById('adminPassword').value;
            if (pwd === 'SALALAH2026') {
                document.getElementById('adminGate').classList.add('hidden');
                document.getElementById('adminContent').classList.remove('hidden');
                document.getElementById('adminError').classList.add('hidden');
                const logDiv = document.getElementById('logList');
                if (logDiv) {
                    logDiv.innerHTML = logHistory.map(l => `<div>${l.time} - ${l.msg}</div>`).join('');
                }
            } else {
                document.getElementById('adminError').classList.remove('hidden');
            }
        }

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('bg-primary', 'text-on-primary'));
                btn.classList.add('bg-primary', 'text-on-primary');
                const target = btn.dataset.tab;
                document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
                document.getElementById(`tab-${target}`).classList.remove('hidden');
            });
        });

        // ============================================================
        // PRODUCT CRUD
        // ============================================================
        function addProduct() {
            const newProd = {
                id: 'p' + Date.now(),
                nameAr: 'منتج جديد',
                nameEn: 'New Product',
                descriptionAr: 'وصف',
                descriptionEn: 'Description',
                weights: ['1kg'],
                defaultWeight: '1kg',
                price: 0.100,
                image: 'https://via.placeholder.com/400x300?text=Product',
                category: 'other'
            };
            appData.products.push(newProd);
            saveData();
            addLog('تم إضافة منتج جديد');
            renderAdminProducts();
            updateUI();
        }

        function deleteProduct(id) {
            if (!confirm('هل تريد حذف هذا المنتج نهائياً؟')) return;
            appData.products = appData.products.filter(p => p.id !== id);
            saveData();
            addLog('تم حذف منتج');
            renderAdminProducts();
            updateUI();
        }

        function editProduct(id) {
            const p = appData.products.find(p => p.id === id);
            if (!p) return;
            const newNameAr = prompt('الاسم بالعربية:', p.nameAr);
            if (newNameAr !== null) p.nameAr = newNameAr;
            const newNameEn = prompt('الاسم بالإنجليزية:', p.nameEn);
            if (newNameEn !== null) p.nameEn = newNameEn;
            const newPrice = prompt('السعر (OMR لكل كجم):', p.price);
            if (newPrice !== null) p.price = parseFloat(newPrice) || p.price;
            const weights = prompt('الأوزان المتاحة (مفصولة بفواصل):', p.weights.join(', '));
            if (weights !== null) p.weights = weights.split(',').map(s => s.trim());
            const imgUrl = prompt('رابط الصورة (اترك فارغاً للإبقاء):', p.image);
            if (imgUrl !== null && imgUrl !== '') p.image = imgUrl;
            saveData();
            addLog('تم تعديل منتج');
            renderAdminProducts();
            updateUI();
        }

        // ============================================================
        // HERO IMAGES
        // ============================================================
        document.getElementById('heroUpload').addEventListener('change', function(e) {
            const files = e.target.files;
            for (let f of files) {
                const reader = new FileReader();
                reader.onload = function(ev) {
                    appData.heroImages.push(ev.target.result);
                    saveData();
                    addLog('تم رفع خلفية جديدة');
                    renderHeroImages();
                    updateUI();
                };
                reader.readAsDataURL(f);
            }
            this.value = '';
        });

        function removeHeroImage(idx) {
            if (!confirm('حذف هذه الخلفية نهائياً؟')) return;
            appData.heroImages.splice(idx, 1);
            if (heroIndex >= appData.heroImages.length) heroIndex = 0;
            saveData();
            addLog('تم حذف خلفية');
            renderHeroImages();
            updateUI();
        }

        // ============================================================
        // LOGO & BRANDING
        // ============================================================
        document.getElementById('logoUpload').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(ev) {
                appData.logo = ev.target.result;
                saveData();
                addLog('تم تغيير الشعار');
                updateUI();
            };
            reader.readAsDataURL(file);
        });

        function saveBranding() {
            appData.heroTitleAr = document.getElementById('heroTitleAr').value;
            appData.heroTitleEn = document.getElementById('heroTitleEn').value;
            appData.heroDesc = document.getElementById('heroDescText').value;
            const aboutText = document.getElementById('aboutText').value;
            if (currentLang === 'ar') appData.aboutTextAr = aboutText;
            else appData.aboutTextEn = aboutText;
            saveData();
            addLog('تم حفظ بيانات العلامة التجارية');
            updateUI();
        }

        // ============================================================
        // DELETE IMAGE FROM GALLERY
        // ============================================================
        function deleteImage(url) {
            if (!confirm('حذف هذه الصورة نهائياً؟')) return;
            appData.products.forEach(p => { if (p.image === url) p.image = 'https://via.placeholder.com/400x300?text=Product'; });
            appData.heroImages = appData.heroImages.filter(img => img !== url);
            if (appData.logo === url) appData.logo = defaultData.logo;
            saveData();
            addLog('تم حذف صورة');
            renderGallery();
            renderHeroImages();
            updateUI();
        }

        // ============================================================
        // B2B ORDER
        // ============================================================
        function addToB2B(productId) {
            const p = appData.products.find(p => p.id === productId);
            if (!p) return;
            const name = currentLang === 'ar' ? p.nameAr : p.nameEn;
            alert(`تم إضافة ${name} إلى الطلب. انتقل إلى نموذج B2B لإكمال الطلب.`);
        }

        function sendB2BOrder() {
            const company = document.getElementById('b2bCompany').value || 'العميل';
            const requirements = document.getElementById('b2bRequirements').value || 'لا يوجد';
            const msg = `طلب شراء بالجملة\nالشركة: ${company}\nالمتطلبات: ${requirements}\nالمنتجات: (تم الإضافة من الكتالوج)`;
            const url = `https://wa.me/96899088000?text=${encodeURIComponent(msg)}`;
            window.open(url, '_blank');
        }

        // ============================================================
        // BACKUP / RESTORE
        // ============================================================
        function exportBackup() {
            const dataStr = JSON.stringify(appData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `binkalilah_backup_${new Date().toISOString().slice(0,10)}.json`;
            a.click();
            addLog('تم تصدير النسخة الاحتياطية');
        }

        function importBackup(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(ev) {
                try {
                    const data = JSON.parse(ev.target.result);
                    appData = { ...defaultData, ...data };
                    saveData();
                    addLog('تم استيراد النسخة الاحتياطية');
                    updateUI();
                    alert('تم استيراد الإعدادات بنجاح');
                } catch (e) {
                    alert('خطأ في الملف');
                }
            };
            reader.readAsText(file);
        }

        function clearAllAssets() {
            if (!confirm('تحذير: سيتم مسح جميع الصور واستبدالها بعناصر نائبة. استمر؟')) return;
            appData.heroImages = defaultData.heroImages;
            appData.logo = defaultData.logo;
            appData.products.forEach(p => p.image = 'https://via.placeholder.com/400x300?text=Product');
            saveData();
            addLog('تم مسح كافة الأصول');
            updateUI();
        }

        // ============================================================
        // INIT
        // ============================================================
        document.addEventListener('DOMContentLoaded', async function() {
            await loadData();
            if (appData.heroSpeed) {
                document.getElementById('heroSpeed').value = appData.heroSpeed;
            }
            document.getElementById('heroSpeed').addEventListener('change', function() {
                appData.heroSpeed = parseInt(this.value);
                saveData();
                startHeroSlideshow();
            });
            if (savedLang) {
                currentLang = savedLang;
                document.documentElement.lang = currentLang;
                document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
                document.getElementById('langLabel').textContent = currentLang === 'ar' ? 'EN' : 'عربي';
            }
            updateUI();
            startHeroSlideshow();
            if (db) {
                const tx = db.transaction(STORE_NAME, 'readonly');
                const store = tx.objectStore(STORE_NAME);
                const req = store.get('logHistory');
                req.onsuccess = () => {
                    if (req.result) logHistory = req.result;
                };
            }
            document.querySelector('#adminGate label').textContent = 'كلمة المرور (الافتراضية: SALALAH2026)';
        });

        document.getElementById('adminModal').addEventListener('click', function(e) {
            if (e.target === this) toggleAdmin(false);
        });
    </script>
</body>
</html>
```


<img width="1276" height="720" alt="Screenshot_20260604_191713738" src="https://github.com/user-attachments/assets/150f3396-4397-46d7-bcf2-380f94fd0465" />
<img width="1276" height="720" alt="Screenshot_20260604_040930048" src="https://github.com/user-attachments/assets/a556921c-f8fd-49d7-bc8e-0f293a9060b3" />
<img width="1024" height="1536" alt="IMG-20260522-WA0140" src="https://github.com/user-attachments/assets/dcade469-0c4e-4ea7-87c8-49f75a06c107" />
<img width="900" height="1600" alt="IMG-20260522-WA0138" src="https://github.com/user-attachments/assets/a1f65152-0bf8-4840-a03d-2fefa891b766" />
<img width="1080" height="1439" alt="TopSaver10735607" src="https://github.com/user-attachments/assets/3956086f-a5ab-41c0-802b-654effc9f2d0" />
<img width="2126" height="1200" alt="Honor_٢٠٢٦٠٦١٥_٠٢٢١٢٨~2" src="https://github.com/user-attachments/assets/b9ef5d87-0f3f-4c3a-8f40-f04701aac2a5" />
<img width="1126" height="2499" alt="صور الصوي_20260717_192151_40" src="https://github.com/user-attachments/assets/f10aaef6-de52-4b78-a50f-0795ea9bbb93" />
<img width="1200" height="1128" alt="صور الصوي_20260717_192151_42" src="https://github.com/user-attachments/assets/d8f3ac49-4a00-41c7-9abb-d52c7b01b06d" />
<img width="1280" height="800" alt="Videoframe_20260718_114655_com huawei himovie overseas" src="https://github.com/user-attachments/assets/1f909eef-e4be-4b90-a7b2-1782824c8ec5" />
<img width="1280" height="800" alt="Videoframe_20260718_114657_com huawei himovie overseas" src="https://github.com/user-attachments/assets/97f42979-a642-4e8b-94e1-8d2f4e340713" />
<img width="1280" height="800" alt="Videoframe_20260718_114700_com huawei himovie overseas" src="https://github.com/user-attachments/assets/e165f3a7-3dff-4a44-8a84-b2f35183caea" />
<img width="1280" height="800" alt="Videoframe_20260718_114703_com huawei himovie overseas" src="https://github.com/user-attachments/assets/5bc62a00-c10f-42eb-af27-bddadeeef72d" />
<img width="1280" height="800" alt="Videoframe_20260718_114715_com huawei himovie overseas" src="https://github.com/user-attachments/assets/fca4bc12-03bb-4a4a-aa64-5874dc35564d" />
<img width="1280" height="800" alt="Videoframe_20260718_114712_com huawei himovie overseas" src="https://github.com/user-attachments/assets/87cbd36d-7c69-4709-8f38-c3f5eed13143" />
<img width="1280" height="800" alt="Videoframe_20260718_114709_com huawei himovie overseas" src="https://github.com/user-attachments/assets/3ddda03f-6eb8-42dc-896a-96d79e9652b1" />
<img width="1280" height="800" alt="Videoframe_20260718_114706_com huawei himovie overseas" src="https://github.com/user-attachments/assets/a805681f-a18e-46a4-8e4d-09cd516f0dc9" />
<img width="1280" height="800" alt="Videoframe_20260718_114718_com huawei himovie overseas" src="https://github.com/user-attachments/assets/709b1e1e-4a53-4f81-8cc2-741483301e76" />
<img width="1280" height="800" alt="Videoframe_20260718_114721_com huawei himovie overseas" src="https://github.com/user-attachments/assets/89933947-d4ba-4332-9deb-5af5a871b035" />
<img width="1280" height="800" alt="Videoframe_20260718_114724_com huawei himovie overseas" src="https://github.com/user-attachments/assets/a3d08912-d494-4d24-a872-b71da2cf9488" />
<img width="1280" height="800" alt="Videoframe_20260718_114727_com huawei himovie overseas" src="https://github.com/user-attachments/assets/cc007d24-df94-4ba2-a514-addfff7dbcf8" />
<img width="1920" height="1079" alt="DJI_0689~2" src="https://github.com/user-attachments/assets/9d26c898-1666-487f-824f-88dec73b9ffb" />
<img width="1200" height="1163" alt="Screenshot_20260724_025312_com huawei himovie overseas_edit_230178625921645" src="https://github.com/user-attachments/assets/d276534a-7e2a-4431-93d2-10d1374208af" />
<img width="1200" height="1920" alt="Screenshot_20260724_030130_com huawei himovie overseas" src="https://github.com/user-attachments/assets/5f43043d-6732-44a9-a8b1-78058713d70e" />
<img width="1200" height="1920" alt="Screenshot_20260724_030123_com huawei himovie overseas" src="https://github.com/user-attachments/assets/db2c9396-608a-4798-ad9b-7f4e3c36922c" />
<img width="1200" height="1920" alt="Screenshot_20260724_030117_com huawei himovie overseas" src="https://github.com/user-attachments/assets/3790e052-f04a-48eb-bc30-718571b5e45e" />
<img width="1200" height="1920" alt="Screenshot_20260724_030118_com huawei himovie overseas" src="https://github.com/user-attachments/assets/5e01a87b-1cb0-4017-ba38-0e1c7b889adb" />
<img width="1200" height="1920" alt="Screenshot_20260724_030120_com huawei himovie overseas" src="https://github.com/user-attachments/assets/b6efd8a8-661f-437e-bb5e-ab2ae93bd33f" />
<img width="1200" height="1920" alt="Screenshot_20260724_030121_com huawei himovie overseas" src="https://github.com/user-attachments/assets/75d4694c-582a-43f8-8785-f5adec33b381" />
<img width="1099" height="1626" alt="Screenshot_20260724_030516_com huawei himovie overseas_edit_229703494505572" src="https://github.com/user-attachments/assets/8c13e0b1-01ad-4b0f-9c13-1cb905986389" />
<img width="921" height="577" alt="Screenshot_20260724_030640_com huawei himovie overseas_edit_229557894155594" src="https://github.com/user-attachments/assets/2654b186-d120-437f-812a-1e567b411056" />
<img width="925" height="611" alt="Screenshot_20260724_030642_com huawei himovie overseas_edit_229544415908200" src="https://github.com/user-attachments/assets/7078a7f6-31be-4b65-822c-1f35393736e3" />
<img width="954" height="673" alt="Screenshot_20260724_030648_com huawei himovie overseas_edit_229514052354559" src="https://github.com/user-attachments/assets/8cdb1c27-2303-49c2-a128-daaf4a6a08a4" />
<img width="1920" height="698" alt="Screenshot_20260724_030906_com huawei himovie overseas_edit_229408728907179" src="https://github.com/user-attachments/assets/e65f1f65-63d7-40f5-b023-2e041b411a21" />
<img width="1920" height="919" alt="Screenshot_20260724_030902_com huawei himovie overseas_edit_229420442995198" src="https://github.com/user-attachments/assets/ffdd127e-3541-4fc7-a1f1-15a246f37901" />
<img width="730" height="583" alt="Screenshot_20260724_031014_com huawei himovie overseas_edit_229339086841044" src="https://github.com/user-attachments/assets/f908e8bf-7a26-489a-9300-c9fd9d2682e9" />
<img width="1920" height="1200" alt="Screenshot_20260724_031430_com huawei himovie overseas" src="https://github.com/user-attachments/assets/e914b9f5-657a-4b97-8093-c29919e84e5e" />
<img width="1920" height="1043" alt="Screenshot_20260724_031640_com huawei himovie overseas_edit_229042115431193" src="https://github.com/user-attachments/assets/e846dc50-19f7-450b-8d33-28b15370eac6" />
<img width="1920" height="1070" alt="Screenshot_20260724_031610_com huawei himovie overseas_edit_229052003987963" src="https://github.com/user-attachments/assets/5d08ab5a-e2b7-4642-975a-f12c30b0747d" />
<img width="1079" height="1920" alt="Screenshot_20260724_031953" src="https://github.com/user-attachments/assets/921516f0-0bb6-4d8b-842b-29c64f5d5a80" />
<img width="1082" height="1141" alt="Screenshot_20260724_031814_1_com huawei himovie overseas_edit_228893864297883" src="https://github.com/user-attachments/assets/5f7578d1-1da6-4623-a192-3d976af015aa" />
<img width="1200" height="1920" alt="Screenshot_20260724_031812_com huawei himovie overseas" src="https://github.com/user-attachments/assets/37acac23-8345-43a7-930e-928d041af23d" />
<img width="1920" height="1200" alt="Screenshot_20260724_031751_com huawei himovie overseas" src="https://github.com/user-attachments/assets/64c17d8a-017b-49d9-bb5b-68aa3b0b342a" />
<img width="1200" height="1551" alt="Screenshot_20260724_031732_com huawei himovie overseas_edit_229006934696824" src="https://github.com/user-attachments/assets/f42a08b6-eef9-411c-887b-aa9f824f5596" />
<img width="1024" height="1024" alt="1785059352142" src="https://github.com/user-attachments/assets/93b091d8-7269-48ea-8729-54eddd4f82d8" />
<img width="768" height="1376" alt="1785069920994" src="https://github.com/user-attachments/assets/d8272da7-bc9b-4797-88b2-b08e1c4da706" />
<img width="1291" height="1722" alt="Photoroom-٢٠٢٦٠٧٢٧_٠٢٥٦٥٣٤٦٧" src="https://github.com/user-attachments/assets/94a6094c-e257-4af1-a6d1-2325f600fd96" />
<img width="1291" height="1722" alt="Photoroom-٢٠٢٦٠٧٢٧_٠٢٥٦٥٣٤٦٧ (2)" src="https://github.com/user-attachments/assets/3e152380-ac7b-424b-8458-7b506ae21cba" />
<img width="1080" height="1920" alt="Screenshot_٢٠٢٦٠٧٢٧_٠٢٥١٤٤٩٤٦" src="https://github.com/user-attachments/assets/7969d180-be48-44c3-ac5a-119816beb918" />
<img width="1080" height="1920" alt="Screenshot_٢٠٢٦٠٧٢٧_٠٢٥١٤٢٠١٨" src="https://github.com/user-attachments/assets/633ed7bc-ce41-471a-b5f7-6c9dd688412d" />
# https-bin-kalilah-alaamri-catalog.ai.studio-
Food &amp; Regional Supply Agencies 
