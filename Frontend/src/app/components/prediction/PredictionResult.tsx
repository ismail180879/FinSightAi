import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { PredictionData } from "../../services/api";

interface PredictionResultProps {
  data: PredictionData;
  assetName: string;
  onReset: () => void;
}

function fmt(n: number, prefix = "$") {
  return `${prefix}${new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)}`;
}

const TIMEFRAMES = [
  { key: "1_hafta" as const, label: "1 Hafta" },
  { key: "1_ay" as const, label: "1 Ay" },
  { key: "3_ay" as const, label: "3 Ay" },
  { key: "6_ay" as const, label: "6 Ay" },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  buyPrice: number;
}

function CustomTooltip({ active, payload, label, buyPrice }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const price = payload[0].value;
  const change = ((price - buyPrice) / buyPrice) * 100;
  const profit = price - buyPrice;
  return (
    <div className="rounded-lg p-3" style={{ background: "#1E2028", border: "1px solid #374151" }}>
      <p className="text-xs mb-1" style={{ color: "#64748B" }}>{label}</p>
      <p className="text-sm font-bold" style={{ color: "#F1F5F9" }}>{fmt(price)}</p>
      <p className="text-xs" style={{ color: change >= 0 ? "#10B981" : "#EF4444" }}>
        {change >= 0 ? "+" : ""}{change.toFixed(2)}% ({profit >= 0 ? "+" : ""}{fmt(profit)})
      </p>
    </div>
  );
}

export function PredictionResult({ data, assetName, onReset }: PredictionResultProps) {
  const isUp = data.current_price >= data.buy_price;
  const lineColor = isUp ? "#10B981" : "#EF4444";

  const riskColor = data.risk_level === "DÜŞÜK" ? "#10B981" : data.risk_level === "YÜKSEK" ? "#EF4444" : "#F59E0B";

  return (
    <div className="flex flex-col gap-5" style={{ animation: "fadeInUp 0.4s ease-out" }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div className="rounded-xl p-5" style={{ background: "#111318", border: "1px solid #1E2028" }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h2 className="font-bold" style={{ color: "#F1F5F9" }}>{assetName}</h2>
            <span
              className="text-xs px-3 py-1 rounded-full"
              style={{ background: `${riskColor}22`, color: riskColor }}
            >
              Risk: {data.risk_level}
            </span>
          </div>
          <div className="flex gap-4 text-sm" style={{ color: "#64748B" }}>
            <span>Toplam Yatırım: <strong style={{ color: "#F1F5F9" }}>{fmt(data.amount * data.buy_price)}</strong></span>
            <span>Alış: <strong style={{ color: "#F1F5F9" }}>{fmt(data.buy_price)}</strong></span>
          </div>
        </div>
      </div>

      {/* Prediction cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TIMEFRAMES.map(({ key, label }, i) => {
          const pred = data.predictions[key];
          const isProfit = pred.profit >= 0;
          const isBest = i === 3;
          return (
            <div
              key={key}
              className="rounded-xl p-4 flex flex-col gap-2"
              style={{
                background: "#111318",
                border: `1px solid ${isProfit ? "#10B98150" : "#EF444450"}`,
                boxShadow: isBest && isProfit ? "0 0 16px rgba(16,185,129,0.2)" : "none",
              }}
            >
              <p className="text-xs font-semibold" style={{ color: "#64748B" }}>{label}</p>
              <p className="text-base font-bold" style={{ color: "#F1F5F9" }}>{fmt(pred.price)}</p>
              <span
                className="text-xs px-2 py-0.5 rounded-full w-fit"
                style={{
                  background: isProfit ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                  color: isProfit ? "#10B981" : "#EF4444",
                }}
              >
                {isProfit ? "+" : ""}{pred.change.toFixed(1)}%
              </span>
              <p className="text-xs" style={{ color: isProfit ? "#10B981" : "#EF4444" }}>
                {isProfit ? "+" : ""}{fmt(pred.profit)} {isProfit ? "kâr" : "zarar"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="rounded-xl p-5" style={{ background: "#111318", border: "1px solid #1E2028" }}>
        <p className="text-xs font-semibold mb-4" style={{ color: "#64748B" }}>📈 Tahmin Grafiği</p>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data.chart_data} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2028" />
            <XAxis dataKey="label" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip buyPrice={data.buy_price} />} />
            <ReferenceLine
              y={data.buy_price}
              stroke="#6366F1"
              strokeDasharray="5 3"
              label={{ value: "Alış Fiyatınız", fill: "#6366F1", fontSize: 10, position: "insideTopRight" }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={lineColor}
              strokeWidth={2}
              fill="url(#areaGrad)"
              dot={{ fill: lineColor, r: 4 }}
              activeDot={{ r: 6, fill: lineColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI analysis */}
      <div className="rounded-xl p-5" style={{ background: "#111318", border: "1px solid #1E2028" }}>
        <p className="text-xs font-semibold mb-3" style={{ color: "#64748B" }}>🧠 Yapay Zeka Yorumu</p>
        <p className="text-sm" style={{ color: "#94A3B8" }}>{data.analysis}</p>
      </div>

      {/* Reset + Disclaimer */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onReset}
          className="py-3 rounded-xl text-sm transition-all duration-150"
          style={{ border: "1px solid #6366F1", color: "#6366F1", background: "transparent" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          🔄 Yeni Tahmin Yap
        </button>

        <div className="rounded-xl p-4" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" }}>
          <p className="text-xs font-bold mb-1" style={{ color: "#EF4444" }}>⚠️ ÖNEMLİ UYARI</p>
          <p className="text-xs" style={{ color: "#94A3B8" }}>
            Bu tahminler yapay zeka tarafından oluşturulmuş olup yatırım tavsiyesi niteliği taşımamaktadır.
            Geçmiş performans gelecek sonuçları garanti etmez.
          </p>
        </div>
      </div>
    </div>
  );
}
