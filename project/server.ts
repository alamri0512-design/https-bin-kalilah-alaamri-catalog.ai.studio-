import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '60mb' }));

  // Central published state. This is shared by every visitor instead of browser-only IndexedDB.
  const statePath = path.join(process.cwd(), 'data', 'site-state.json');
  const adminPassword = process.env.ADMIN_PASSWORD || 'SALALAH2026';
  async function readPublishedState() {
    try { return JSON.parse(await fs.readFile(statePath, 'utf8')); }
    catch { return null; }
  }
  async function writePublishedState(state: unknown) {
    await fs.mkdir(path.dirname(statePath), { recursive: true });
    const tempPath = `${statePath}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(state), 'utf8');
    await fs.rename(tempPath, statePath);
  }
  app.get('/api/site-state', async (_req, res) => {
    const state = await readPublishedState();
    res.json({ state, updatedAt: state?.publishedAt || null });
  });
  app.put('/api/site-state', async (req, res) => {
    if (req.header('x-admin-password') !== adminPassword) return res.status(401).json({ error: 'Unauthorized' });
    const state = { ...req.body, publishedAt: new Date().toISOString() };
    await writePublishedState(state);
    res.json({ ok: true, updatedAt: state.publishedAt });
  });

  // Initialize Gemini AI lazily/safely
  let aiClient: GoogleGenAI | null = null;
  function getAiClient(): GoogleGenAI | null {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        aiClient = new GoogleGenAI({ apiKey });
      }
    }
    return aiClient;
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', company: 'Bin Kalilah Al-Aamri Trading & Investment Co. LLC' });
  });

  // AI Smart Assistant route
  app.post('/api/ai-chat', async (req, res) => {
    try {
      const { message, language = 'ar', context } = req.body;
      const ai = getAiClient();

      const systemInstruction = `You are the AI Smart Assistant for "Bin Kalilah Al-Aamri Trading & Investment Co. LLC" (شركة بن كليلة العامري للتجارة والاستثمار ش.م.م), headquartered in Salalah, Sultanate of Oman.
We are the exclusive authorized agent for:
1. Salalah Flour Mills (Al-Khareef Flour & Pasta) in Yemen, UAE, and Africa.
2. Oman Mills (Barakat Products) in UAE and Yemen.
3. Brazilian Fine Sugar & New Zealand Full-Cream Milk Powder.
Our contact phone numbers: +96899088000, +96896070609. Email: bs@binkalilahalaamri.com, alamri0512@gmail.com.
Headquarters: Salalah, Sultanate of Oman (Google Maps link provided on site).

Answer customer queries professionally, concisely, and accurately in ${language === 'en' ? 'English' : 'Arabic'}.
You can answer questions about:
- Product specifications (Flour No.1, No.2, Maida, Chakki Atta, Semolina, Pasta varieties, Sugar ICUMSA 45, Milk Powder 25kg, Animal Feed & Wheat raw materials).
- B2B Wholesale ordering process via WhatsApp (+96899088000).
- Shipping calculations (Sea & Land routes to Yemen: 20ft containers capacity 25 tons).
- Halal certification and 100% durum wheat semolina guarantees.
- Custom quotations and special requests.

Current customer message: "${message}"`;

      if (!ai) {
        // Fallback intelligent response if API key is not configured yet
        const fallbackAr = `أهلاً بك في شركة بن كليلة العامري للتجارة والاستثمار ش.م.م - صلالة، عُمان.\nالوكيل المعتمد لمطاحن صلالة (منتجات الخريف) والمطاحن العمانية (منتجات بركات).\nبخصوص سؤالك ("${message}"):\nيمكنك التواصل المباشر مع إدارة المبيعات والجملة عبر الواتساب على الرقم: +96899088000 أو الهاتف: +96896070609.\nنوفر شحن بحري وبري للجمهورية اليمنية ودول الخليج وإفريقيا بكفاءة عالية وأسعار تنافسية.`;
        const fallbackEn = `Welcome to Bin Kalilah Al-Aamri Trading & Investment Co. LLC - Salalah, Oman.\nExclusive authorized agent for Salalah Flour Mills (Al-Khareef) and Oman Mills (Barakat).\nRegarding your query ("${message}"):\nYou can contact our wholesale sales department directly via WhatsApp: +96899088000 or Phone: +96896070609.\nWe provide sea and land logistics to Yemen, GCC, and Africa with high efficiency.`;
        
        return res.json({
          reply: language === 'en' ? fallbackEn : fallbackAr,
          source: 'local_assistant'
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: systemInstruction }] }
        ]
      });

      const replyText = response.text || (language === 'en' ? 'Thank you for reaching out. Please contact us via WhatsApp at +96899088000.' : 'شكراً لتواصلك معنا. يرجى التواصل عبر الواتساب على الرقم +96899088000.');

      return res.json({
        reply: replyText,
        source: 'gemini_api'
      });
    } catch (error: any) {
      console.error('Error in /api/ai-chat:', error);
      const language = req.body?.language || 'ar';
      const fallbackAr = `يسرنا خدمتك في شركة بن كليلة العامري للتجارة والاستثمار. يسعدنا استقبال طلباتك واستفساراتك عبر الواتساب المباشر: +96899088000.`;
      const fallbackEn = `We are pleased to serve you at Bin Kalilah Al-Aamri Trading & Investment Co. LLC. Please contact us directly via WhatsApp at +96899088000.`;
      res.json({
        reply: language === 'en' ? fallbackEn : fallbackAr,
        source: 'fallback'
      });
    }
  });

  // Vite middleware for dev / static for prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
