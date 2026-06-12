import { useState, useRef, useEffect } from "react";
import {
  Search, MapPin, Star, Sparkles, MessageCircle, X, Umbrella,
  Droplets, Send, Bot, Clock, IndianRupee, Scissors, Calendar,
  Phone, User, ChevronDown, CheckCircle2, SlidersHorizontal
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface Salon {
  id: number;
  name: string;
  location: string;
  area: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  services: string[];
  openUntil: string;
  badge?: string;
}

interface ChatMessage {
  id: number;
  role: "bot" | "user";
  text: string;
  time: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────

const SALONS: Salon[] = [
  {
    id: 1,
    name: "Jean-Claude Biguine",
    location: "Linking Road",
    area: "Bandra West",
    price: 2000,
    rating: 4.8,
    reviews: 412,
    image: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=600&h=400&fit=crop&auto=format",
    services: ["Hair Color", "Keratin", "Facial"],
    openUntil: "9 PM",
    badge: "Top Rated",
  },
  {
    id: 2,
    name: "Naturals Salon",
    location: "Hill Road",
    area: "Bandra",
    price: 850,
    rating: 4.5,
    reviews: 1024,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop&auto=format",
    services: ["Haircut", "Threading", "Waxing"],
    openUntil: "8 PM",
  },
  {
    id: 3,
    name: "Enrich Salon & Academy",
    location: "Juhu Circle",
    area: "Juhu",
    price: 1200,
    rating: 4.6,
    reviews: 789,
    image: "https://images.unsplash.com/photo-1626383137804-ff908d2753a2?w=600&h=400&fit=crop&auto=format",
    services: ["Bridal", "Makeup", "Hair Spa"],
    openUntil: "9:30 PM",
    badge: "Trending",
  },
  {
    id: 4,
    name: "YLG Salon",
    location: "Colaba Causeway",
    area: "Colaba",
    price: 600,
    rating: 4.4,
    reviews: 567,
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=600&h=400&fit=crop&auto=format",
    services: ["Mani-Pedi", "Haircut", "Facial"],
    openUntil: "8:30 PM",
  },
];

const AREAS = ["All", "Bandra", "Juhu", "Colaba", "Andheri", "Lower Parel"];
const SERVICES_LIST = ["Haircut & Styling", "Hair Coloring", "Keratin Treatment", "Facial", "Manicure & Pedicure", "Bridal Makeup", "Threading & Waxing", "Head Massage"];
const TIMES = ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"];

// ── Chatbot logic ─────────────────────────────────────────────────────────────

const BOT_ANSWERS: Record<string, string> = {
  hair: "🌧️ Monsoon tip: Deep conditioning & keratin treatments are a must this season! Jean-Claude Biguine in Bandra is excellent — starting ₹2,000.",
  bridal: "💍 For bridal packages, Enrich Salon in Juhu has full packages from ₹15,000. Book at least 2 weeks ahead during wedding season!",
  bandra: "📍 Top Bandra picks: Naturals (₹850+), Jean-Claude Biguine (₹2,000+). Both are highly rated!",
  juhu: "📍 In Juhu: Enrich Salon is the crowd favourite for bridal & hair spa. YLG Juhu is great for mani-pedis at ₹600!",
  monsoon: "🌧️ Monsoon care tip! Anti-frizz & scalp treatments are trending. Shall I find the best monsoon-special salons near you?",
  price: "💰 Mumbai salons range from ₹500 (basic cut) to ₹5,000+ (premium). Tell me your budget and I'll filter for you!",
  default: "🌸 I can help you find the perfect Mumbai salon! Try asking about 'best salons in Bandra', 'bridal packages', 'monsoon hair care', or 'budget under ₹1000'.",
};

function getBotReply(input: string): string {
  const l = input.toLowerCase();
  if (l.includes("hair") || l.includes("color") || l.includes("keratin")) return BOT_ANSWERS.hair;
  if (l.includes("bridal") || l.includes("wedding")) return BOT_ANSWERS.bridal;
  if (l.includes("bandra")) return BOT_ANSWERS.bandra;
  if (l.includes("juhu")) return BOT_ANSWERS.juhu;
  if (l.includes("monsoon") || l.includes("rain") || l.includes("frizz")) return BOT_ANSWERS.monsoon;
  if (l.includes("price") || l.includes("cost") || l.includes("budget") || l.includes("₹")) return BOT_ANSWERS.price;
  return BOT_ANSWERS.default;
}

const nowTime = () => new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
const QUICK = ["Best in Bandra", "Bridal packages", "Monsoon hair care", "Budget ₹1000"];

// ── Glass style helper ────────────────────────────────────────────────────────

const glass = {
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.22)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

// ── Rain animation ────────────────────────────────────────────────────────────

function Rain() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <style>{`
        @keyframes fall { 0%{transform:translateY(-40px);opacity:0} 10%{opacity:1} 90%{opacity:.5} 100%{transform:translateY(110vh);opacity:0} }
      `}</style>
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="absolute top-0 rounded-full"
          style={{
            left: `${(i * 5.2) % 100}%`,
            width: "1.5px",
            height: `${18 + (i % 5) * 7}px`,
            background: "linear-gradient(to bottom,transparent,rgba(255,255,255,0.2))",
            animation: `fall ${1.1 + (i % 5) * 0.28}s linear infinite`,
            animationDelay: `${(i * 0.19) % 2.2}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── Salon Card ────────────────────────────────────────────────────────────────

function SalonCard({ salon, onBook }: { salon: Salon; onBook: (s: Salon) => void }) {
  return (
    <div className="relative rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
      style={{ ...glass, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
      {salon.badge && (
        <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
          style={{ background: "linear-gradient(90deg,#f0abfc,#a855f7)", color: "#1a0533" }}>
          <Sparkles className="w-3 h-3" />{salon.badge}
        </div>
      )}
      <div className="relative h-44 overflow-hidden">
        <img src={salon.image} alt={salon.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(76,29,149,.75) 0%,transparent 60%)" }} />
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
          style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", color: "#fff" }}>
          <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
          {salon.rating} ({salon.reviews})
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white mb-1 truncate">{salon.name}</h3>
        <div className="flex items-center gap-1 mb-3" style={{ color: "rgba(255,255,255,.65)" }}>
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="text-xs truncate">{salon.location}, {salon.area}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {salon.services.slice(0, 3).map(s => (
            <span key={s} className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(168,85,247,.25)", color: "rgba(255,255,255,.9)", border: "1px solid rgba(168,85,247,.4)" }}>
              {s}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-0.5 text-white">
              <IndianRupee className="w-3.5 h-3.5" />
              <span className="font-semibold">{salon.price}</span>
              <span className="text-xs ml-0.5" style={{ color: "rgba(255,255,255,.55)" }}>/service</span>
            </div>
            <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: "rgba(255,255,255,.55)" }}>
              <Clock className="w-3 h-3" />Open till {salon.openUntil}
            </div>
          </div>
          <button onClick={() => onBook(salon)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 text-white"
            style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 4px 15px rgba(168,85,247,.4)" }}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Chatbot ───────────────────────────────────────────────────────────────────

function ChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: "bot", text: "🌸 Namaste! I'm GlamBot, your AI beauty assistant for Mumbai. How can I help you find the perfect salon today?", time: nowTime() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { id: Date.now(), role: "user", text, time: nowTime() }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { id: Date.now() + 1, role: "bot", text: getBotReply(text), time: nowTime() }]);
    }, 1100);
  };

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col" style={{ ...glass, boxShadow: "0 8px 32px rgba(0,0,0,.2)", height: "400px" }}>
      {/* header */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ background: "linear-gradient(90deg,rgba(168,85,247,.35),rgba(124,58,237,.35))", borderBottom: "1px solid rgba(255,255,255,.15)" }}>
        <div className="relative">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)" }}>
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-purple-900" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-white font-semibold text-sm">GlamBot AI</span>
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          </div>
          <span className="text-xs" style={{ color: "rgba(255,255,255,.6)" }}>Your Mumbai beauty guide · Online</span>
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ scrollbarWidth: "none" }}>
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
            {msg.role === "bot" && (
              <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)" }}>
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="max-w-[78%]">
              <div className="px-3 py-2 rounded-2xl text-sm leading-relaxed"
                style={msg.role === "user"
                  ? { background: "linear-gradient(135deg,#a855f7,#7c3aed)", color: "#fff", borderBottomRightRadius: 4 }
                  : { background: "rgba(255,255,255,.14)", color: "#fff", border: "1px solid rgba(255,255,255,.18)", borderBottomLeftRadius: 4 }}>
                {msg.text}
              </div>
              <div className="text-xs mt-0.5 px-1" style={{ color: "rgba(255,255,255,.35)" }}>{msg.time}</div>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start gap-2">
            <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)" }}>
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl" style={{ background: "rgba(255,255,255,.14)", border: "1px solid rgba(255,255,255,.18)" }}>
              <div className="flex gap-1">
                {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-purple-300 animate-bounce" style={{ animationDelay: `${i*.15}s` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* quick replies */}
      <div className="px-3 pb-2 flex gap-2 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: "none" }}>
        {QUICK.map(q => (
          <button key={q} onClick={() => send(q)}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            style={{ background: "rgba(168,85,247,.25)", color: "rgba(255,255,255,.9)", border: "1px solid rgba(168,85,247,.4)" }}>
            {q}
          </button>
        ))}
      </div>

      {/* input */}
      <div className="px-3 pb-3 flex-shrink-0">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)" }}>
          <input
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/40"
            placeholder="Ask about salons, services..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send(input)}
          />
          <button onClick={() => send(input)} disabled={!input.trim()}
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 active:scale-95 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)" }}>
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Booking Modal ─────────────────────────────────────────────────────────────

function BookingModal({ salon, onClose }: { salon: Salon | null; onClose: () => void }) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [form, setForm] = useState({ name: "", phone: "", service: "", date: "", time: "", notes: "" });

  useEffect(() => { if (!salon) { setStep("form"); setForm({ name:"",phone:"",service:"",date:"",time:"",notes:"" }); } }, [salon]);

  if (!salon) return null;

  const valid = !!(form.name && form.phone && form.service && form.date && form.time);

  const submit = (e: React.FormEvent) => { e.preventDefault(); if (valid) setStep("success"); };

  const bookingId = `#MB${Math.random().toString().slice(2, 8)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,.6)", backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden"
        style={{ background: "linear-gradient(160deg,rgba(103,62,162,.97) 0%,rgba(40,14,80,.99) 100%)", border: "1px solid rgba(255,255,255,.15)", maxHeight: "92vh", boxShadow: "0 -8px 40px rgba(0,0,0,.5)" }}>
        {/* drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,.3)" }} />
        </div>
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,.12)" }}>
          <div>
            <h2 className="text-white font-semibold">{step === "success" ? "Booking Confirmed! 🎉" : "Book Appointment"}</h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,.6)" }}>{salon.name} · {salon.area}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "rgba(255,255,255,.12)" }}>
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "calc(92vh - 90px)", scrollbarWidth: "none" }}>
          {step === "success" ? (
            <div className="flex flex-col items-center px-6 py-12 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 0 40px rgba(168,85,247,.55)" }}>
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">You're all set!</h3>
              <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,.7)" }}>
                {form.service} at <span className="text-white font-medium">{salon.name}</span>
              </p>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,.7)" }}>{form.date} · {form.time}</p>
              <div className="w-full p-4 rounded-xl mb-5" style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)" }}>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: "rgba(255,255,255,.55)" }}>Booking ID</span>
                  <span className="text-white font-mono">{bookingId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "rgba(255,255,255,.55)" }}>Estimated cost</span>
                  <span className="text-white font-medium">₹{salon.price}+</span>
                </div>
              </div>
              <p className="text-xs mb-6" style={{ color: "rgba(255,255,255,.45)" }}>
                🌧️ We'll SMS you if there are monsoon-related delays.
              </p>
              <button onClick={onClose}
                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-[.98]"
                style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 4px 20px rgba(168,85,247,.4)" }}>
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="px-5 py-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,.7)" }}>Your Name</label>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                  style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)" }}>
                  <User className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,.45)" }} />
                  <input required className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/40"
                    placeholder="e.g. Priya Sharma"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
              </div>
              {/* Phone */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,.7)" }}>Phone Number</label>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                  style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)" }}>
                  <Phone className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,.45)" }} />
                  <input required type="tel" className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/40"
                    placeholder="+91 98765 43210"
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              {/* Service */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,.7)" }}>Service</label>
                <div className="relative">
                  <Scissors className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,.45)" }} />
                  <select required
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl text-sm appearance-none outline-none"
                    style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)", color: form.service ? "#fff" : "rgba(255,255,255,.4)" }}
                    value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                    <option value="" disabled style={{ background: "#3b0764" }}>Select a service</option>
                    {SERVICES_LIST.map(s => <option key={s} value={s} style={{ background: "#3b0764" }}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "rgba(255,255,255,.45)" }} />
                </div>
              </div>
              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,.7)" }}>Date</label>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                    style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)" }}>
                    <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,.45)" }} />
                    <input required type="date" className="flex-1 bg-transparent text-white text-xs outline-none"
                      style={{ colorScheme: "dark" }}
                      min={new Date().toISOString().split("T")[0]}
                      value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,.7)" }}>Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,.45)" }} />
                    <select required
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl text-sm appearance-none outline-none"
                      style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)", color: form.time ? "#fff" : "rgba(255,255,255,.4)" }}
                      value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}>
                      <option value="" disabled style={{ background: "#3b0764" }}>Time</option>
                      {TIMES.map(t => <option key={t} value={t} style={{ background: "#3b0764" }}>{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "rgba(255,255,255,.45)" }} />
                  </div>
                </div>
              </div>
              {/* Notes */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,.7)" }}>
                  Special Requests <span style={{ color: "rgba(255,255,255,.35)" }}>(optional)</span>
                </label>
                <textarea rows={2}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none placeholder:text-white/40 text-white"
                  style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)" }}
                  placeholder="Any preferences, allergies, or special requests..."
                  value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>
              {/* Monsoon note */}
              <div className="flex items-start gap-2 p-3 rounded-xl"
                style={{ background: "rgba(168,85,247,.15)", border: "1px solid rgba(168,85,247,.3)" }}>
                <span className="text-base flex-shrink-0">🌧️</span>
                <p className="text-xs" style={{ color: "rgba(255,255,255,.7)" }}>
                  Monsoon season in Mumbai! We recommend scheduling hair treatments on clear-weather days for best results.
                </p>
              </div>
              <button type="submit" disabled={!valid}
                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: valid ? "0 4px 20px rgba(168,85,247,.45)" : "none" }}>
                Confirm Booking · ₹{salon.price}+
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [area, setArea] = useState("All");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("Popularity");
  const [bookingSalon, setBookingSalon] = useState<Salon | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const salons = SALONS
    .filter(s => {
      const matchArea = area === "All" || s.area.includes(area);
      const q = search.toLowerCase();
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.area.toLowerCase().includes(q) || s.services.some(sv => sv.toLowerCase().includes(q));
      return matchArea && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "Price: Low") return a.price - b.price;
      if (sortBy === "Price: High") return b.price - a.price;
      if (sortBy === "Rating") return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

  return (
    <div className="min-h-screen relative" style={{ background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)", fontFamily: "'Inter',sans-serif" }}>
      <Rain />

      <div className="relative z-10 max-w-md mx-auto px-4 pb-28">
        {/* ── Header ── */}
        <div className="pt-12 pb-2">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-purple-300" />
                <span className="text-xs" style={{ color: "rgba(255,255,255,.65)" }}>Mumbai, Maharashtra</span>
              </div>
              <h1 className="text-white">GlamMumbai 💜</h1>
            </div>
            {/* weather badge */}
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs"
                style={{ ...glass, color: "rgba(255,255,255,.85)" }}>
                <Droplets className="w-3 h-3 text-blue-300" />
                <span>27°C</span>
                <span style={{ color: "rgba(255,255,255,.35)" }}>|</span>
                <Umbrella className="w-3 h-3 text-purple-300" />
                <span>Monsoon</span>
              </div>
            </div>
          </div>
          <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,.65)" }}>
            Book top-rated salons across the city, rain or shine 🌧️
          </p>

          {/* search */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-3"
            style={{ ...glass, boxShadow: "0 4px 16px rgba(0,0,0,.1)" }}>
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,.55)" }} />
            <input
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/45"
              placeholder="Search salons, services, areas..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button onClick={() => setShowFilters(f => !f)}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-all"
              style={{ background: showFilters ? "rgba(168,85,247,.45)" : "rgba(255,255,255,.12)", color: "rgba(255,255,255,.85)" }}>
              <SlidersHorizontal className="w-3 h-3" />Filter
            </button>
          </div>

          {/* sort */}
          {showFilters && (
            <div className="p-3 rounded-xl mb-3" style={{ background: "rgba(255,255,255,.09)", border: "1px solid rgba(255,255,255,.14)" }}>
              <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,.55)" }}>Sort by</p>
              <div className="flex flex-wrap gap-2">
                {["Popularity", "Price: Low", "Price: High", "Rating"].map(opt => (
                  <button key={opt} onClick={() => setSortBy(opt)}
                    className="text-xs px-3 py-1.5 rounded-full transition-all text-white"
                    style={{
                      background: sortBy === opt ? "linear-gradient(135deg,#a855f7,#7c3aed)" : "rgba(255,255,255,.12)",
                      border: sortBy === opt ? "none" : "1px solid rgba(255,255,255,.2)",
                    }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* area pills */}
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {AREAS.map(a => (
              <button key={a} onClick={() => setArea(a)}
                className="flex-shrink-0 text-xs px-3.5 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95 text-white whitespace-nowrap"
                style={{
                  background: area === a ? "linear-gradient(135deg,#a855f7,#7c3aed)" : "rgba(255,255,255,.12)",
                  border: area === a ? "none" : "1px solid rgba(255,255,255,.2)",
                  boxShadow: area === a ? "0 4px 12px rgba(168,85,247,.4)" : "none",
                  fontWeight: area === a ? 600 : 400,
                }}>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* ── AI Chatbot ── */}
        <div className="my-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)" }}>
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <h2 className="text-white">AI Beauty Assistant</h2>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(168,85,247,.3)", color: "rgba(255,255,255,.85)" }}>Beta</span>
          </div>
          <ChatBot />
        </div>

        {/* ── Salon Cards ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white">{salons.length} Salons Found</h2>
            <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,.6)" }}>
              <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />Top rated first
            </div>
          </div>

          {salons.length === 0 ? (
            <div className="rounded-2xl p-10 text-center" style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)" }}>
              <p className="text-4xl mb-3">🌧️</p>
              <p className="text-white font-medium mb-1">No salons found</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,.55)" }}>Try a different area or search term</p>
            </div>
          ) : (
            <div className="space-y-4">
              {salons.map(s => <SalonCard key={s.id} salon={s} onBook={setBookingSalon} />)}
            </div>
          )}
        </div>

        {/* footer */}
        <p className="mt-8 text-center text-xs" style={{ color: "rgba(255,255,255,.35)" }}>
          🌧️ Mumbai Monsoon 2024 · 200+ salons listed
        </p>
      </div>

      {/* ── Floating chat button ── */}
      <button onClick={() => setChatOpen(o => !o)}
        className="fixed bottom-6 right-4 w-14 h-14 rounded-full flex items-center justify-center z-40 transition-all hover:scale-110 active:scale-95"
        style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 4px 24px rgba(168,85,247,.65)" }}>
        {chatOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
        {!chatOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-400 flex items-center justify-center text-white"
            style={{ fontSize: 10, fontWeight: 700 }}>1</span>
        )}
      </button>

      {/* ── Floating chat panel ── */}
      {chatOpen && (
        <div className="fixed bottom-24 right-4 w-80 z-40" style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,.35))" }}>
          <ChatBot />
        </div>
      )}

      {/* ── Booking Modal ── */}
      <BookingModal salon={bookingSalon} onClose={() => setBookingSalon(null)} />
    </div>
  );
}
