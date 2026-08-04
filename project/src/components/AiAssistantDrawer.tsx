import React, { useState } from 'react';
import { Language, Currency, Product } from '../types';
import { Bot, Send, X, Sparkles, User, Loader2 } from 'lucide-react';

interface AiAssistantDrawerProps {
  language: Language;
  currency: Currency;
  products: Product[];
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  language,
  currency,
  products,
  onClose,
}) => {
  const isAr = language === 'ar';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: isAr
        ? 'مرحباً بك! أنا المساعد الذكي لشركة بن كليلة العامري للتجارة والاستثمار. كيف يمكنني مساعدتك اليوم في الاستفسار عن أصناف دقيق الخريف، معكرونة الباستا، السكر البرازيلي، الشحن لليمن، أو أسعار الجملة؟'
        : 'Welcome! I am the AI Smart Assistant for Bin Kalilah Al-Aamri Co. How can I assist you with Salalah Flour Mills, Oman Mills, shipping to Yemen, or B2B pricing?',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedPrompts = [
    isAr ? 'ما هي مواصفات دقيق الخريف ونسبة الاستخراج؟' : 'What are Al-Khareef flour specs?',
    isAr ? 'كيف يتم ترتيب شحن الحاويات إلى اليمن؟' : 'How does shipping to Yemen work?',
    isAr ? 'ما هي أصناف منتجات بركات والمطاحن العمانية؟' : 'What are Barakat products from Oman Mills?',
    isAr ? 'ما هي خيارات التعبئة والأوزان المتاحة للجملة؟' : 'What packaging options and weights are available for wholesale?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'u_' + Date.now(),
      sender: 'user',
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMsg('');
    setIsLoading(true);

    try {
      // Build context of products and company
      const productContext = products
        .map((p) => `${p.nameAr} (${p.nameEn}) - weights: ${p.weights.join(', ')}`)
        .join('; ');

      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text.trim(),
          context: `Bin Kalilah Al-Aamri Trading & Investment Co. LLC (شركة بن كليلة العامري للتجارة والاستثمار ش.م.م), authorized exclusive agent for Salalah Flour Mills (Al-Khareef flour & pasta) and Oman Mills (Barakat products & feed) in Yemen, UAE, and Africa. Phone: +96899088000. Catalog Products: ${productContext}. Language: ${language}. Currency: ${currency}.`,
        }),
      });

      const data = await res.json();
      const replyText =
        data.reply ||
        (isAr
          ? 'نعتذر، حدث انقطاع في الاتصال مع خادم الذكاء الاصطناعي. يمكنك التواصل مباشرة معنا عبر الواتساب +96899088000.'
          : 'Sorry, communication failed. Please contact our sales agent via WhatsApp +96899088000.');

      setMessages((prev) => [
        ...prev,
        {
          id: 'a_' + Date.now(),
          sender: 'assistant',
          text: replyText,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'a_err_' + Date.now(),
          sender: 'assistant',
          text: isAr
            ? 'يمكنك التواصل المباشر مع موظف المبيعات عبر الواتساب على الرقم +96899088000 للحصول على أفضل سعر للجملة.'
            : 'Please contact us via WhatsApp +96899088000 for instant wholesale assistance.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#0D1B2E] border-l border-[#C9A84C]/40 text-white shadow-2xl flex flex-col justify-between">
      {/* Drawer Header */}
      <div className="p-4 bg-[#0A1628] border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#C9A84C]/20 border border-[#C9A84C]/50 text-[#C9A84C]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white">
              {isAr ? 'المساعد الذكي للمبيعات والجملة' : 'AI Sales Assistant'}
            </h3>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              {isAr ? 'متصل وجاهز للإجابة' : 'Online & Ready'}
            </span>
          </div>
        </div>

        <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Message Chat List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`p-2 rounded-lg shrink-0 ${
                m.sender === 'user'
                  ? 'bg-[#C9A84C] text-[#0A1628]'
                  : 'bg-[#13233A] text-[#C9A84C] border border-[#C9A84C]/30'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#C9A84C] text-[#0A1628] font-bold rounded-tr-none'
                  : 'bg-[#060D18] text-slate-200 border border-slate-800 rounded-tl-none whitespace-pre-line'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#C9A84C]" />
            <span>{isAr ? 'جاري التفكير وصياغة الإجابة...' : 'AI is processing response...'}</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 bg-[#060D18] border-t border-slate-800">
        <div className="flex items-center gap-1 text-[10px] text-[#C9A84C] font-bold mb-2">
          <Sparkles className="w-3 h-3" />
          <span>{isAr ? 'أسئلة مقترحة وسريعة:' : 'Suggested Questions:'}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="text-[10px] bg-[#13233A] hover:bg-[#1E3352] text-slate-200 px-2.5 py-1 rounded border border-slate-700 text-right transition"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 bg-[#0A1628] border-t border-slate-700">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder={isAr ? 'اسأل المساعد الذكي عن أي منتج أو أسعار...' : 'Ask AI about products or pricing...'}
            className="flex-1 bg-[#060D18] text-white placeholder-slate-500 text-xs px-3 py-2.5 rounded-xl border border-slate-700 focus:border-[#C9A84C] focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-2.5 bg-[#C9A84C] text-[#0A1628] hover:bg-[#D8B65C] rounded-xl font-bold transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
