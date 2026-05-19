import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { PortfolioPredictionData, CartItem, PredictionData } from "../../services/api";
import { ASSET_CATEGORIES } from "../../data/assets";

interface PortfolioResultProps {
  data: PortfolioPredictionData;
  cartItems: CartItem[];
  onReset: () => void;
}

function fmt(n: number, prefix = "$") {
  return `${prefix}${new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)}`;
}

const TIMEFRAMES = [
  { key: "1_hafta" as const, label: "1 Hafta", short: "1H" },
  { key: "1_ay" as const, label: "1 Ay", short: "1A" },
  { key: "3_ay" as const, label: "3 Ay", short: "3A" },
  { key: "6_ay" as const, label: "6 Ay", short: "6A" },
];

// Custom tooltip for charts
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  buyPrice?: number;
  prefix?: string;
}

function CustomTooltip({ active, payload, label, buyPrice, prefix = "$" }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const price = payload[0].value;
  const change = buyPrice ? ((price - buyPrice) / buyPrice) * 100 : 0;
  return (
    <div className="rounded-lg p-3" style={{ background: "#1E2028", border: "1px solid #374151" }}>
      <p className="text-xs mb-1" style={{ color: "#64748B" }}>{label}</p>
      <p className="text-sm font-bold" style={{ color: "#F1F5F9" }}>{fmt(price, prefix)}</p>
      {buyPrice && (
        <p className="text-xs" style={{ color: change >= 0 ? "#10B981" : "#EF4444" }}>
          {change >= 0 ? "+" : ""}{change.toFixed(2)}%
        </p>
      )}
    </div>
  );
}

// --- Sub-component: Portfolio Overview (Tüm Portföy) ---

function PortfolioOverview({ data, cartItems }: { data: PortfolioPredictionData; cartItems: CartItem[] }) {
  const isUp = data.totalCurrentValue >= data.totalCost;
  const lineColor = isUp ? "#10B981" : "#EF4444";

  // Check if mixed currencies
  const hasCrypto = cartItems.some(i => i.category === "kripto");
  const hasTRY = cartItems.some(i => i.category !== "kripto");
  const prefix = hasCrypto && !hasTRY ? "$" : hasTRY && !hasCrypto ? "₺" : "";

  return (
    <div className="flex flex-col gap-4">
      {/* Prediction cards for total portfolio */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TIMEFRAMES.map(({ key, label }, i) => {
          const pred = data.totalPredictions[key];
          const isProfit = pred.profit >= 0;
          const isBest = i === 3;
          return (
            <div
              key={key}
              className="rounded-xl p-4 flex flex-col gap-1.5 transition-all duration-150"
              style={{
                background: "#111318",
                border: `1px solid ${isProfit ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                boxShadow: isBest && isProfit ? "0 0 20px rgba(16,185,129,0.15)" : "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 8px 24px ${isProfit ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = isBest && isProfit ? "0 0 20px rgba(16,185,129,0.15)" : "none";
              }}
            >
              <p className="text-xs font-semibold" style={{ color: "#64748B" }}>{label}</p>
              <p className="text-lg font-bold" style={{ color: "#F1F5F9", fontVariantNumeric: "tabular-nums" }}>
                {prefix ? fmt(pred.value, prefix) : `${fmt(pred.value, "")}`}
              </p>
              <span
                className="text-xs px-2 py-0.5 rounded-full w-fit"
                style={{
                  background: isProfit ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                  color: isProfit ? "#10B981" : "#EF4444",
                }}
              >
                {isProfit ? "+" : ""}{pred.change.toFixed(1)}%
              </span>
              <p className="text-xs font-medium" style={{ color: isProfit ? "#10B981" : "#EF4444" }}>
                {isProfit ? "+" : ""}{prefix ? fmt(pred.profit, prefix) : fmt(pred.profit, "")} {isProfit ? "kâr" : "zarar"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Total portfolio chart */}
      <div className="rounded-xl p-5" style={{ background: "#111318", border: "1px solid #1E2028" }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold" style={{ color: "#64748B" }}>
            📈 Toplam Portföy Tahmini
          </p>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#1E2028", color: "#64748B" }}>
            {cartItems.length} varlık
          </span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data.totalChartData} margin={{ top: 5, right: 5, bottom: 5, left: 15 }}>
            <defs>
              <linearGradient id="totalAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2028" />
            <XAxis dataKey="label" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip buyPrice={data.totalCost} prefix={prefix || "$"} />} />
            <ReferenceLine
              y={data.totalCost}
              stroke="#6366F1"
              strokeDasharray="5 3"
              label={{ value: "Toplam Maliyet", fill: "#6366F1", fontSize: 10, position: "insideTopRight" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={lineColor}
              strokeWidth={2}
              fill="url(#totalAreaGrad)"
              dot={{ fill: lineColor, r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: lineColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Per-asset contribution table */}
      <div className="rounded-xl p-5" style={{ background: "#111318", border: "1px solid #1E2028" }}>
        <p className="text-xs font-semibold mb-3" style={{ color: "#64748B" }}>📊 Varlık Bazlı Özet</p>
        <div className="flex flex-col gap-1">
          {/* Header */}
          <div className="grid grid-cols-5 gap-2 px-2 py-1.5 text-xs" style={{ color: "#475569" }}>
            <span>Varlık</span>
            <span className="text-right">Maliyet</span>
            <span className="text-right">1 Hafta</span>
            <span className="text-right">3 Ay</span>
            <span className="text-right">6 Ay</span>
          </div>
          {cartItems.map((item) => {
            const pred = data.items[item.asset.id];
            if (!pred) return null;
            const cur = item.category === "kripto" ? "$" : "₺";
            const cost = item.amount * item.buyPrice;
            return (
              <div
                key={item.asset.id}
                className="grid grid-cols-5 gap-2 px-2 py-2 rounded-lg text-xs transition-colors"
                onMouseEnter={(e) => { e.currentTarget.style.background = "#1A1B22"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <div className="flex items-center gap-1.5">
                  <span style={{ color: ASSET_CATEGORIES[item.category].color, fontSize: "12px" }}>
                    {item.asset.icon}
                  </span>
                  <span style={{ color: "#F1F5F9" }}>{item.asset.symbol}</span>
                </div>
                <span className="text-right" style={{ color: "#94A3B8" }}>{cur}{fmt(cost, "").replace(cur, "")}</span>
                <span className="text-right" style={{ color: pred.predictions["1_hafta"].profit >= 0 ? "#10B981" : "#EF4444" }}>
                  {pred.predictions["1_hafta"].profit >= 0 ? "+" : ""}{pred.predictions["1_hafta"].change.toFixed(1)}%
                </span>
                <span className="text-right" style={{ color: pred.predictions["3_ay"].profit >= 0 ? "#10B981" : "#EF4444" }}>
                  {pred.predictions["3_ay"].profit >= 0 ? "+" : ""}{pred.predictions["3_ay"].change.toFixed(1)}%
                </span>
                <span className="text-right" style={{ color: pred.predictions["6_ay"].profit >= 0 ? "#10B981" : "#EF4444" }}>
                  {pred.predictions["6_ay"].profit >= 0 ? "+" : ""}{pred.predictions["6_ay"].change.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- Sub-component: Individual Asset View ---

function AssetDetail({ pred, cartItem }: { pred: PredictionData; cartItem: CartItem }) {
  const isUp = pred.current_price >= pred.buy_price;
  const lineColor = isUp ? "#10B981" : "#EF4444";
  const currency = cartItem.category === "kripto" ? "$" : "₺";
  const riskColor = pred.risk_level === "DÜŞÜK" ? "#10B981" : pred.risk_level === "YÜKSEK" ? "#EF4444" : "#F59E0B";
  const catColor = ASSET_CATEGORIES[cartItem.category].color;

  return (
    <div className="flex flex-col gap-4">
      {/* Asset header */}
      <div className="rounded-xl p-5" style={{ background: "#111318", border: "1px solid #1E2028" }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: "40px",
                height: "40px",
                background: `${catColor}18`,
                color: catColor,
                fontSize: "20px",
              }}
            >
              {cartItem.asset.icon}
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: "#F1F5F9" }}>{pred.asset}</h2>
              <p className="text-xs" style={{ color: "#64748B" }}>
                {cartItem.amount} {cartItem.asset.symbol} × {currency}{fmt(pred.buy_price, "")}
              </p>
            </div>
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{ background: `${riskColor}18`, color: riskColor }}
            >
              Risk: {pred.risk_level}
            </span>
          </div>
          <div className="flex gap-4 text-xs" style={{ color: "#64748B" }}>
            <span>Maliyet: <strong style={{ color: "#F1F5F9" }}>{fmt(cartItem.amount * pred.buy_price, currency)}</strong></span>
            <span>Güncel: <strong style={{ color: "#F1F5F9" }}>{fmt(pred.current_price, currency)}</strong></span>
          </div>
        </div>
      </div>

      {/* Prediction cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TIMEFRAMES.map(({ key, label }, i) => {
          const p = pred.predictions[key];
          const isProfit = p.profit >= 0;
          const isBest = i === 3;
          return (
            <div
              key={key}
              className="rounded-xl p-4 flex flex-col gap-1.5 transition-all duration-150"
              style={{
                background: "#111318",
                border: `1px solid ${isProfit ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                boxShadow: isBest && isProfit ? "0 0 20px rgba(16,185,129,0.15)" : "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <p className="text-xs font-semibold" style={{ color: "#64748B" }}>{label}</p>
              <p className="text-lg font-bold" style={{ color: "#F1F5F9", fontVariantNumeric: "tabular-nums" }}>
                {fmt(p.price, currency)}
              </p>
              <span
                className="text-xs px-2 py-0.5 rounded-full w-fit"
                style={{
                  background: isProfit ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                  color: isProfit ? "#10B981" : "#EF4444",
                }}
              >
                {isProfit ? "+" : ""}{p.change.toFixed(1)}%
              </span>
              <p className="text-xs font-medium" style={{ color: isProfit ? "#10B981" : "#EF4444" }}>
                {isProfit ? "+" : ""}{fmt(p.profit, currency)} {isProfit ? "kâr" : "zarar"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Individual chart */}
      <div className="rounded-xl p-5" style={{ background: "#111318", border: "1px solid #1E2028" }}>
        <p className="text-xs font-semibold mb-4" style={{ color: "#64748B" }}>
          📈 {pred.asset} Tahmin Grafiği
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={pred.chart_data} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
            <defs>
              <linearGradient id={`areaGrad-${cartItem.asset.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2028" />
            <XAxis dataKey="label" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip buyPrice={pred.buy_price} prefix={currency} />} />
            <ReferenceLine
              y={pred.buy_price}
              stroke="#6366F1"
              strokeDasharray="5 3"
              label={{ value: "Alış Fiyatınız", fill: "#6366F1", fontSize: 10, position: "insideTopRight" }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={lineColor}
              strokeWidth={2}
              fill={`url(#areaGrad-${cartItem.asset.id})`}
              dot={{ fill: lineColor, r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: lineColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI Analysis */}
      <div className="rounded-xl p-5" style={{ background: "#111318", border: "1px solid #1E2028" }}>
        <p className="text-xs font-semibold mb-3" style={{ color: "#64748B" }}>🧠 Yapay Zeka Yorumu</p>
        <p className="text-sm mb-3" style={{ color: "#94A3B8", lineHeight: 1.6 }}>{pred.analysis}</p>
        {pred.key_factors && pred.key_factors.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold" style={{ color: "#64748B" }}>Temel Etkenler:</p>
            {pred.key_factors.map((factor, i) => (
              <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "#94A3B8" }}>
                <span style={{ color: "#6366F1", marginTop: "2px" }}>•</span>
                <span>{factor}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main Component ---

export function PredictionPortfolioResult({ data, cartItems, onReset }: PortfolioResultProps) {
  const [activeTab, setActiveTab] = useState<string>("portfolio");

  return (
    <div className="flex flex-col gap-5" style={{ animation: "fadeInUp 0.4s ease-out" }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Toolbar */}
      <div
        className="rounded-xl p-2 flex flex-wrap gap-1.5"
        style={{ background: "#111318", border: "1px solid #1E2028" }}
      >
        {/* "Tüm Portföy" button */}
        <button
          onClick={() => setActiveTab("portfolio")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-150"
          style={{
            background: activeTab === "portfolio" ? "linear-gradient(135deg, #6366F1, #8B5CF6)" : "transparent",
            color: activeTab === "portfolio" ? "white" : "#64748B",
            border: "none",
            cursor: "pointer",
            boxShadow: activeTab === "portfolio" ? "0 2px 12px rgba(99,102,241,0.3)" : "none",
          }}
          onMouseEnter={(e) => {
            if (activeTab !== "portfolio") e.currentTarget.style.background = "#1E2028";
          }}
          onMouseLeave={(e) => {
            if (activeTab !== "portfolio") e.currentTarget.style.background = "transparent";
          }}
        >
          <span>📊</span>
          <span>Tüm Portföy</span>
        </button>

        {/* Separator */}
        <div style={{ width: "1px", background: "#1E2028", margin: "4px 4px" }} />

        {/* Individual asset buttons */}
        {cartItems.map((item) => {
          const isActive = activeTab === item.asset.id;
          const catColor = ASSET_CATEGORIES[item.category].color;
          return (
            <button
              key={item.asset.id}
              onClick={() => setActiveTab(item.asset.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150"
              style={{
                background: isActive ? `${catColor}20` : "transparent",
                color: isActive ? "#F1F5F9" : "#64748B",
                border: isActive ? `1px solid ${catColor}50` : "1px solid transparent",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "#1E2028";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ fontSize: "14px" }}>{item.asset.icon}</span>
              <span>{item.asset.symbol}</span>
            </button>
          );
        })}
      </div>

      {/* Content based on active tab */}
      {activeTab === "portfolio" ? (
        <PortfolioOverview data={data} cartItems={cartItems} />
      ) : (
        (() => {
          const item = cartItems.find(c => c.asset.id === activeTab);
          const pred = data.items[activeTab];
          if (!item || !pred) return null;
          return <AssetDetail pred={pred} cartItem={item} />;
        })()
      )}

      {/* Reset + Disclaimer */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onReset}
          className="py-3 rounded-xl text-sm transition-all duration-150"
          style={{ border: "1px solid #6366F1", color: "#6366F1", background: "transparent", cursor: "pointer" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          🔄 Yeni Tahmin Yap
        </button>

        <div className="rounded-xl p-4" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <p className="text-xs font-bold mb-1" style={{ color: "#EF4444" }}>⚠️ ÖNEMLİ UYARI</p>
          <p className="text-xs" style={{ color: "#94A3B8", lineHeight: 1.5 }}>
            Bu tahminler yapay zeka tarafından oluşturulmuş olup yatırım tavsiyesi niteliği taşımamaktadır.
            Geçmiş performans gelecek sonuçları garanti etmez. Yatırım kararlarınızı kendi araştırmanıza dayandırınız.
          </p>
        </div>
      </div>
    </div>
  );
}
