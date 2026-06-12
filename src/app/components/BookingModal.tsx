import { X, Calendar, Clock, User, Phone, Scissors, ChevronDown, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import type { Salon } from "./SalonCard";

interface BookingModalProps {
  salon: Salon | null;
  onClose: () => void;
}

const SERVICES = ["Haircut & Styling", "Hair Coloring", "Keratin Treatment", "Facial", "Manicure & Pedicure", "Bridal Makeup", "Threading & Waxing", "Head Massage"];
const TIMES = ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"];

export function BookingModal({ salon, onClose }: BookingModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [form, setForm] = useState({ name: "", phone: "", service: "", date: "", time: "", notes: "" });

  if (!salon) return null;

  const isValid = form.name && form.phone && form.service && form.date && form.time;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setStep("success");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, rgba(103,62,162,0.95) 0%, rgba(50,20,90,0.98) 100%)",
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.4)",
          maxHeight: "92vh",
        }}
      >
        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
          <div>
            <h2 className="text-white font-semibold">{step === "success" ? "Booking Confirmed!" : "Book Appointment"}</h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>{salon.name} · {salon.area}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "calc(92vh - 100px)", scrollbarWidth: "none" }}>
          {step === "success" ? (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)", boxShadow: "0 0 40px rgba(168,85,247,0.5)" }}>
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">You're all set!</h3>
              <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>
                {form.service} at <span className="text-white font-medium">{salon.name}</span>
              </p>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.7)" }}>
                {form.date} at {form.time}
              </p>
              <div className="w-full p-4 rounded-xl mb-6" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>Booking ID</span>
                  <span className="text-white font-mono">#MB{Math.random().toString().slice(2, 8)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>Estimated cost</span>
                  <span className="text-white font-medium">₹{salon.price}+</span>
                </div>
              </div>
              <p className="text-xs mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
                🌧️ Mumbai weather tip: We'll SMS you if there are monsoon delays.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 active:scale-95"
                style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)", boxShadow: "0 4px 20px rgba(168,85,247,0.4)" }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "rgba(255,255,255,0.7)" }}>Your Name</label>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <User className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.5)" }} />
                  <input
                    required
                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/40"
                    placeholder="e.g. Priya Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "rgba(255,255,255,0.7)" }}>Phone Number</label>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <Phone className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.5)" }} />
                  <input
                    required
                    type="tel"
                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/40"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* Service */}
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "rgba(255,255,255,0.7)" }}>Service</label>
                <div className="relative">
                  <Scissors className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.5)" }} />
                  <select
                    required
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl text-sm appearance-none outline-none"
                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: form.service ? "#fff" : "rgba(255,255,255,0.4)" }}
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                  >
                    <option value="" disabled style={{ background: "#3b0764" }}>Select a service</option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s} style={{ background: "#3b0764" }}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "rgba(255,255,255,0.5)" }} />
                </div>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "rgba(255,255,255,0.7)" }}>Date</label>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.5)" }} />
                    <input
                      required
                      type="date"
                      className="flex-1 bg-transparent text-white text-sm outline-none"
                      style={{ colorScheme: "dark" }}
                      min={new Date().toISOString().split("T")[0]}
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "rgba(255,255,255,0.7)" }}>Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.5)" }} />
                    <select
                      required
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl text-sm appearance-none outline-none"
                      style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: form.time ? "#fff" : "rgba(255,255,255,0.4)" }}
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                    >
                      <option value="" disabled style={{ background: "#3b0764" }}>Time</option>
                      {TIMES.map((t) => (
                        <option key={t} value={t} style={{ background: "#3b0764" }}>{t}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "rgba(255,255,255,0.5)" }} />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "rgba(255,255,255,0.7)" }}>Special Requests <span style={{ color: "rgba(255,255,255,0.4)" }}>(optional)</span></label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none placeholder:text-white/40 text-white"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
                  placeholder="Any preferences, allergies, or special requests..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              {/* Monsoon note */}
              <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)" }}>
                <span className="text-base flex-shrink-0">🌧️</span>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Monsoon season in Mumbai! We recommend booking hair treatments on dry days for best results.
                </p>
              </div>

              <button
                type="submit"
                disabled={!isValid}
                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)", boxShadow: isValid ? "0 4px 20px rgba(168,85,247,0.4)" : "none" }}
              >
                Confirm Booking · ₹{salon.price}+
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
