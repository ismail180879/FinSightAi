import { useState } from "react";
import { Asset, CategoryKey } from "../../data/assets";

interface PredictionFormProps {
  selectedAsset: Asset;
  selectedCategory: CategoryKey;
  onSubmit: (amount: number, buyPrice: number, unit?: string) => void;
}

function fmt(n: number) {
  return new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

const MOCK_CURRENT: Record<string, number> = {
  bitcoin: 67430, ethereum: 3240, binancecoin: 580, solana: 145, ripple: 0.52,
  usd: 32.45, eur: 35.20, gbp: 41.30, gold: 2890, silver: 32.5,
  thyao: 248, garan: 89.5, asels: 42.8, eregl: 28.6, bimas: 415,
};

export function PredictionForm({ selectedAsset, selectedCategory, onSubmit }: PredictionFormProps) {
  const [amount, setAmount] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [unit, setUnit] = useState("Gram");

  const currentPrice = MOCK_CURRENT[selectedAsset.id] || 100;
  const amountNum = parseFloat(amount) || 0;
  const buyPriceNum = parseFloat(buyPrice) || 0;
  const totalCost = amountNum * buyPriceNum;
  const currentValue = amountNum * currentPrice;
  const pnl = currentValue - totalCost;
  const pnlPct = totalCost > 0 ? (pnl / totalCost) * 100 : 0;

  const currency = selectedCategory === "kripto" ? "$" : "₺";
  const isEnabled = amountNum > 0 && buyPriceNum > 0;

  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "#111318",
        border: "1px solid #1E2028",
        animation: "fadeInUp 0.4s ease-out",
      }}
    >
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <p className="text-xs uppercase tracking-wider mb-4" style={{ color: "#64748B" }}>
        Adım 2 — Ne kadar <span style={{ color: "#F1F5F9" }}>{selectedAsset.name}</span> var?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs mb-1 block" style={{ color: "#64748B" }}>
            {selectedCategory === "hisse" ? "Adet" : "Miktar"}
          </label>
          <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid #1E2028" }}>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={selectedCategory === "kripto" ? "0.5" : selectedCategory === "hisse" ? "10" : "100"}
              step={selectedCategory === "hisse" ? "1" : "any"}
              className="flex-1 px-3 py-2 text-sm outline-none"
              style={{ background: "#0A0B0E", color: "#F1F5F9" }}
            />
            {selectedCategory === "doviz" && selectedAsset.id === "gold" ? (
              <div className="flex" style={{ borderLeft: "1px solid #1E2028" }}>
                {["Gram", "Ons", "Adet"].map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className="px-2 text-xs transition-colors"
                    style={{
                      background: unit === u ? "#6366F1" : "#0A0B0E",
                      color: unit === u ? "white" : "#64748B",
                    }}
                  >
                    {u}
                  </button>
                ))}
              </div>
            ) : (
              <div
                className="flex items-center px-3 text-sm"
                style={{ background: "#1E2028", color: "#64748B" }}
              >
                {selectedAsset.symbol}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs mb-1 block" style={{ color: "#64748B" }}>
            Alış Fiyatı ({currency})
          </label>
          <input
            type="number"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            placeholder={`Aldığınız fiyat (${currency})`}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: "#0A0B0E", color: "#F1F5F9", border: "1px solid #1E2028" }}
          />
        </div>
      </div>

      {/* Live calc */}
      {(amountNum > 0 || buyPriceNum > 0) && (
        <div
          className="rounded-lg p-4 mb-4 grid grid-cols-3 gap-3"
          style={{ background: "#0A0B0E", border: "1px solid #1E2028" }}
        >
          <div>
            <p className="text-xs mb-1" style={{ color: "#64748B" }}>Toplam Maliyet</p>
            <p className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>{currency}{fmt(totalCost)}</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: "#64748B" }}>Mevcut Değer</p>
            <p className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>{currency}{fmt(currentValue)}</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: "#64748B" }}>Anlık K/Z</p>
            <p
              className="text-sm font-semibold"
              style={{ color: pnl >= 0 ? "#10B981" : "#EF4444" }}
            >
              {pnl >= 0 ? "+" : ""}{currency}{fmt(pnl)} ({pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(1)}%)
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => isEnabled && onSubmit(amountNum, buyPriceNum, unit)}
        disabled={!isEnabled}
        className="w-full font-bold text-white transition-all duration-200"
        style={{
          height: "52px",
          borderRadius: "12px",
          background: isEnabled
            ? "linear-gradient(135deg, #7C3AED, #6366F1)"
            : "#1E2028",
          color: isEnabled ? "white" : "#64748B",
          boxShadow: isEnabled ? "0 0 20px rgba(124,58,237,0.35)" : "none",
          cursor: isEnabled ? "pointer" : "not-allowed",
        }}
        onMouseEnter={(e) => {
          if (isEnabled) {
            e.currentTarget.style.background = "linear-gradient(135deg, #8B5CF6, #818CF8)";
            e.currentTarget.style.boxShadow = "0 0 30px rgba(124,58,237,0.55)";
          }
        }}
        onMouseLeave={(e) => {
          if (isEnabled) {
            e.currentTarget.style.background = "linear-gradient(135deg, #7C3AED, #6366F1)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(124,58,237,0.35)";
          }
        }}
      >
        🔮 Tahmin Et
      </button>
    </div>
  );
}
