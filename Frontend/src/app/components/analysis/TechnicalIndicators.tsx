import { PriceData } from "../../services/api";

interface TechnicalIndicatorsProps {
  priceData: PriceData | null;
  technicalData?: {
    rsi: number;
    rsi_label: string;
    trend: string;
    ma7: number;
    ma30: number;
    support: number;
    resistance: number;
  } | null;
}

function fmt(n: number) {
  return new Intl.NumberFormat("tr-TR").format(Math.round(n));
}

function RSIGauge({ rsi }: { rsi: number }) {
  const cx = 100;
  const cy = 95;
  const r = 75;

  const getArcPoint = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy - r * Math.sin(rad),
    };
  };

  const startPt = getArcPoint(180);
  const endPt = getArcPoint(0);

  const valueAngle = 180 - (rsi / 100) * 180;
  const valuePt = getArcPoint(valueAngle);
  const largeArc = rsi > 50 ? 0 : 0;

  const rsiColor = rsi < 30 ? "#10B981" : rsi > 70 ? "#EF4444" : "#F59E0B";

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 115" className="w-full" style={{ maxHeight: "115px" }}>
        {/* Background arc */}
        <path
          d={`M ${startPt.x},${startPt.y} A ${r},${r} 0 0,1 ${endPt.x},${endPt.y}`}
          fill="none"
          stroke="#1E2028"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Value arc */}
        {rsi > 0 && (
          <path
            d={`M ${startPt.x},${startPt.y} A ${r},${r} 0 ${largeArc},1 ${valuePt.x},${valuePt.y}`}
            fill="none"
            stroke={rsiColor}
            strokeWidth="12"
            strokeLinecap="round"
          />
        )}
        {/* Center value */}
        <text x={cx} y={cy - 5} textAnchor="middle" fill="#F1F5F9" fontSize="28" fontWeight="700">
          {rsi}
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" fill="#64748B" fontSize="10">
          {rsi < 30 ? "Aşırı Satım" : rsi > 70 ? "Aşırı Alım" : "Normal Bölge"}
        </text>
        {/* Labels */}
        <text x="18" y="108" textAnchor="middle" fill="#64748B" fontSize="8">Aşırı</text>
        <text x="18" y="116" textAnchor="middle" fill="#64748B" fontSize="8">Satım</text>
        <text x="182" y="108" textAnchor="middle" fill="#64748B" fontSize="8">Aşırı</text>
        <text x="182" y="116" textAnchor="middle" fill="#64748B" fontSize="8">Alım</text>
      </svg>
    </div>
  );
}

export function TechnicalIndicators({ priceData, technicalData }: TechnicalIndicatorsProps) {
  const data = technicalData || {
    rsi: 58,
    rsi_label: "Normal",
    trend: "Yükselen",
    ma7: 66200,
    ma30: 63800,
    support: 64000,
    resistance: 69500,
  };

  const price = priceData?.price || data.support + (data.resistance - data.support) / 2;
  const pricePos = Math.max(0, Math.min(100, ((price - data.support) / (data.resistance - data.support)) * 100));
  const isTrendUp = data.ma7 > data.ma30;

  return (
    <div
      className="rounded-xl p-5 mt-3"
      style={{ background: "#111318", border: "1px solid #1E2028" }}
    >
      <p className="text-xs uppercase tracking-wider mb-3" style={{ color: "#64748B" }}>
        Teknik Göstergeler
      </p>

      <RSIGauge rsi={data.rsi} />

      <div style={{ height: "1px", background: "#1E2028", margin: "12px 0" }} />

      {/* MA Row */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-lg p-2" style={{ background: "#0A0B0E" }}>
          <p className="text-xs mb-1" style={{ color: "#64748B" }}>MA7</p>
          <p className="text-sm font-semibold" style={{ color: "#6366F1" }}>${fmt(data.ma7)}</p>
        </div>
        <div className="rounded-lg p-2" style={{ background: "#0A0B0E" }}>
          <p className="text-xs mb-1" style={{ color: "#64748B" }}>MA30</p>
          <p className="text-sm font-semibold" style={{ color: "#64748B" }}>${fmt(data.ma30)}</p>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <span
          className="text-xs px-3 py-1 rounded-full font-medium"
          style={{
            background: isTrendUp ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
            color: isTrendUp ? "#10B981" : "#EF4444",
          }}
        >
          {isTrendUp ? "📈 Yükselen Trend" : "📉 Düşen Trend"}
        </span>
      </div>

      <div style={{ height: "1px", background: "#1E2028", marginBottom: "12px" }} />

      {/* Support / Resistance */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <p className="text-xs mb-1" style={{ color: "#64748B" }}>Destek</p>
          <p className="text-sm font-semibold" style={{ color: "#10B981" }}>${fmt(data.support)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs mb-1" style={{ color: "#64748B" }}>Direnç</p>
          <p className="text-sm font-semibold" style={{ color: "#EF4444" }}>${fmt(data.resistance)}</p>
        </div>
      </div>

      <div className="relative rounded-full overflow-hidden" style={{ height: "6px", background: "#1E2028" }}>
        <div
          className="absolute left-0 top-0 h-full"
          style={{ width: `${pricePos}%`, background: "linear-gradient(to right, #10B981, #6366F1)" }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-full border-2"
          style={{
            left: `calc(${pricePos}% - 5px)`,
            width: "10px",
            height: "10px",
            background: "white",
            borderColor: "#6366F1",
          }}
        />
      </div>
    </div>
  );
}
