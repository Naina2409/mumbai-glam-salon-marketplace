import { useState, useRef, useEffect } from "react";
import { Send, Bot, Sparkles, X } from "lucide-react";

interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
  time: string;
}

const BOT_RESPONSES: Record<string, string> = {
  default: "I can help you find the perfect salon in Mumbai! Try asking about 'best salons in Bandra', 'hair coloring', 'bridal packages', or 'monsoon hair care'.",
  hair: "🌧️ Mumbai monsoon tip: Deep conditioning treatments are a must! I recommend Looks Salon in Bandra or Jean-Claude Biguine in Juhu for their amazing keratin treatments starting at ₹2,500.",
  bridal: "💍 For bridal packages, YLG Salon and Naturals offer complete bridal packages starting at ₹15,000. Book at least 2 weeks in advance during wedding season!",
  bandra: "📍 Top picks in Bandra: Naturals (₹800+), Enrich Salon (₹1,200+), and Jean-Claude Biguine (₹2,000+). All are highly rated!",
  juhu: "📍 In Juhu: YLG Salon and Looks Salon are crowd favorites. YLG has great manicure/pedicure deals at ₹600!",
  monsoon: "🌧️ Great monsoon care tip! Anti-frizz treatments, scalp treatments, and keratin smoothening are trending this monsoon season. Shall I find salons near you?",
  price: "💰 Mumbai salons range from ₹500 (basic haircut) to ₹5,000+ (premium services). I can filter by budget — what's your range?",
};

function getBotReply(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("hair") || lower.includes("color") || lower.includes("keratin")) return BOT_RESPONSES.hair;
  if (lower.includes("bridal") || lower.includes("wedding") || lower.includes("bride")) return BOT_RESPONSES.bridal;
  if (lower.includes("bandra")) return BOT_RESPONSES.bandra;
  if (lower.includes("juhu")) return BOT_RESPONSES.juhu;
  if (lower.includes("monsoon") || lower.includes("rain") || lower.includes("frizz")) return BOT_RESPONSES.monsoon;
  if (lower.includes("price") || lower.includes("cost") || lower.includes("budget") || lower.includes("₹")) return BOT_RESPONSES.price;
  return BOT_RESPONSES.default;
}

const now = () => new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const QUICK_REPLIES = ["Best salons in Bandra", "Bridal packages", "Monsoon hair care", "Budget under ₹1000"];

interface ChatBotProps {
  onClose?: () => void;
  isExpanded?: boolean;
}

export function ChatBot({ isExpanded = true }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "bot", text: "🌸 Namaste! I'm GlamBot, your AI beauty assistant for Mumbai. How can I help you find the perfect salon today?", time: now() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", text, time: now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: Date.now() + 1, role: "bot", text: getBotReply(text), time: now() }]);
    }, 1200);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        height: isExpanded ? "420px" : "320px",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ background: "linear-gradient(90deg, rgba(168,85,247,0.4), rgba(124,58,237,0.4))", borderBottom: "1px solid var(--glass-border)" }}
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}>
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-purple-900" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-white font-semibold text-sm">GlamBot AI</span>
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          </div>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>Your Mumbai beauty guide</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ scrollbarWidth: "none" }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
            {msg.role === "bot" && (
              <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}>
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="max-w-[78%]">
              <div
                className="px-3 py-2 rounded-2xl text-sm leading-relaxed"
                style={
                  msg.role === "user"
                    ? { background: "linear-gradient(135deg, #a855f7, #7c3aed)", color: "#fff", borderBottomRightRadius: "4px" }
                    : { background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.18)", borderBottomLeftRadius: "4px" }
                }
              >
                {msg.text}
              </div>
              <div className="text-xs mt-1 px-1" style={{ color: "rgba(255,255,255,0.4)" }}>{msg.time}</div>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start gap-2">
            <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}>
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.18)" }}>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-purple-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="px-3 pb-2 flex gap-2 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: "none" }}>
        {QUICK_REPLIES.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95"
            style={{ background: "rgba(168,85,247,0.25)", color: "rgba(255,255,255,0.9)", border: "1px solid rgba(168,85,247,0.4)", whiteSpace: "nowrap" }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-3 pb-3 flex-shrink-0">
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
        >
          <input
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/40"
            placeholder="Ask about salons, services..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim()}
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 active:scale-95 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
