import { Star, MapPin, Clock, IndianRupee, Sparkles } from "lucide-react";

export interface Salon {
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

interface SalonCardProps {
  salon: Salon;
  onBook: (salon: Salon) => void;
}

export function SalonCard({ salon, onBook }: SalonCardProps) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
      style={{
        background: "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      }}
    >
      {salon.badge && (
        <div
          className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: "linear-gradient(90deg, #f0abfc, #a855f7)", color: "#1a0533" }}
        >
          <Sparkles className="inline w-3 h-3 mr-1" />
          {salon.badge}
        </div>
      )}
      <div className="relative h-44 overflow-hidden">
        <img
          src={salon.image}
          alt={salon.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(103,62,162,0.7) 0%, transparent 60%)" }} />
        <div
          className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
          style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", color: "#fff" }}
        >
          <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
          {salon.rating} ({salon.reviews})
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white mb-1 truncate">{salon.name}</h3>
        <div className="flex items-center gap-1 mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="text-xs truncate">{salon.location}, {salon.area}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {salon.services.slice(0, 3).map((s) => (
            <span
              key={s}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(168,85,247,0.25)", color: "rgba(255,255,255,0.9)", border: "1px solid rgba(168,85,247,0.4)" }}
            >
              {s}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-0.5 text-white">
              <IndianRupee className="w-3 h-3" />
              <span className="font-semibold">{salon.price}</span>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>/service</span>
            </div>
            <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
              <Clock className="w-3 h-3" />
              Open till {salon.openUntil}
            </div>
          </div>
          <button
            onClick={() => onBook(salon)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #a855f7, #7c3aed)",
              color: "#fff",
              boxShadow: "0 4px 15px rgba(168,85,247,0.4)",
            }}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
