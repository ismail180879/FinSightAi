import { useState, useEffect, useRef } from "react";
import { PriceData } from "../../services/api";
import { Asset } from "../../data/assets";

interface PriceCardProps {
  priceData: PriceData | null;
  selectedAsset: Asset;
  loading?: boolean;
}

function fmt(n: number, decimals = 2) {
  return new Intl.NumberFormat("tr-TR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
}

export function PriceCard({ priceData, selectedAsset, loading }: PriceCardProps) {
  const [flashColor, setFlashColor] = useState<string | null>(null);
  const prevPrice = useRef<number | null>(null);

  useEffect(() => {
    if (priceData && prevPrice.current !== null && prevPrice.current !== priceData.price) {
      const color = priceData.price > prevPrice.current ? "#10B981" : "#EF4444";
      setFlashColor(color);
      const t = setTimeout(() => setFlashColor(null), 1000);
      return () => clearTimeout(t);
    }
    if (priceData) prevPrice.current = priceData.price;
  }, [priceData?.price]);

  if (loading || !priceData) {
    return (
      <div
        className="rounded-xl p-5"
        style={{ background: "#111318", borderLeft: "3px solid #6366F1", border: "1px solid #1E2028", borderLeftWidth: "3px" }}
      >
        <div className="animate-pulse">
          <div className="h-3 rounded mb-3" style={{ background: "#1E2028", width: "60%" }} />
          <div className="h-9 rounded mb-3" style={{ background: "#1E2028", width: "80%" }} />
          <div className="h-6 rounded mb-4" style={{ background: "#1E2028", width: "40%" }} />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 rounded" style={{ background: "#1E2028" }} />
            <div className="h-10 rounded" style={{ background: "#1E2028" }} />
          </div>
        </div>
      </div>
    );
  }

  const isPositive = priceData.change_24h >= 0;

  return (
    <div
      className="rounded-xl p-5 transition-all duration-300"
      style={{
        background: flashColor ? `${flashColor}15` : "#111318",
        border: "1px solid #1E2028",
        borderLeft: `3px solid ${flashColor || "#6366F1"}`,
      }}
    >
      <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "#64748B" }}>
        {selectedAsset.name}
      </p>

      <div
        className="text-4xl font-bold mb-2 tabular-nums transition-colors duration-300"
        style={{ color: flashColor || "#F1F5F9" }}
      >
        ${fmt(priceData.price)}
      </div>

      <div className="mb-4">
        <span
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
          style={{
            background: isPositive ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
            color: isPositive ? "#10B981" : "#EF4444",
          }}
        >
          {isPositive ? "▲" : "▼"} {Math.abs(priceData.change_24h).toFixed(2)}% bugün
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg p-3" style={{ background: "rgba(16,185,129,0.08)" }}>
          <p className="text-xs mb-1" style={{ color: "#64748B" }}>24s Yüksek</p>
          <p className="text-sm font-semibold" style={{ color: "#10B981" }}>${fmt(priceData.high_24h)}</p>
        </div>
        <div className="rounded-lg p-3" style={{ background: "rgba(239,68,68,0.08)" }}>
          <p className="text-xs mb-1" style={{ color: "#64748B" }}>24s Düşük</p>
          <p className="text-sm font-semibold" style={{ color: "#EF4444" }}>${fmt(priceData.low_24h)}</p>
        </div>
      </div>
    </div>
  );
}
