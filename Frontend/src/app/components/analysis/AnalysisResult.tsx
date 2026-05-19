import { useEffect, useRef, useState } from "react";
import { AnalysisData } from "../../services/api";

interface AnalysisResultProps {
  data: AnalysisData;
  assetName: string;
  onRefresh: () => void;
}

function CircularProgress({ score, color }: { score: number; color: string }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <svg viewBox="0 0 100 100" className="w-28 h-28">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#1E2028" strokeWidth="10" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dashoffset 1s ease-out" }}
      />
      <text x="50" y="54" textAnchor="middle" fill="#F1F5F9" fontSize="20" fontWeight="700">
        {score}
      </text>
    </svg>
  );
}

export function AnalysisResult({ data, assetName, onRefresh }: AnalysisResultProps) {
  const [confBarWidth, setConfBarWidth] = useState(0);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      setTimeout(() => setConfBarWidth(data.recommendation.confidence), 100);
    }
  }, []);

  const newsScore = data?.news_sentiment?.score ?? 0;
  const rsi = data?.technical?.rsi ?? 50;
  const techScore = Math.max(0, Math.min(100,
    (rsi < 30 ? 75 : rsi > 70 ? 35 : 65) +
    (data?.technical?.trend === "Yükselen" ? 15 : -15)
  ));

  const newsColor = newsScore > 50 ? "#10B981" : newsScore > 30 ? "#F59E0B" : "#EF4444";
  const techColor = techScore > 50 ? "#10B981" : techScore > 30 ? "#F59E0B" : "#EF4444";

  const action = data?.recommendation?.action ?? "BEKLE";
  const actionColor = action === "AL" ? "#10B981" : action === "SAT" ? "#EF4444" : "#F59E0B";
  const actionEmoji = action === "AL" ? "✅" : action === "SAT" ? "🔴" : "⏸";

  const sentDotColor = (s: string) => s === "positive" ? "#10B981" : s === "negative" ? "#EF4444" : "#64748B";

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
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="font-semibold" style={{ color: "#F1F5F9" }}>🧠 AI Analiz</span>
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(99,102,241,0.2)", color: "#6366F1" }}>
            {assetName}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: "#64748B" }}>Son güncelleme: az önce</span>
          <button
            onClick={onRefresh}
            className="text-xs px-3 py-1 rounded transition-colors"
            style={{ color: "#6366F1", border: "1px solid #6366F1" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            🔄 Yenile
          </button>
        </div>
      </div>

      {/* Two column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* News sentiment */}
        <div className="rounded-lg p-4" style={{ background: "#0A0B0E", border: "1px solid #1E2028" }}>
          <p className="text-xs font-semibold mb-3" style={{ color: "#64748B" }}>📰 Haber Analizi</p>
          <div className="flex flex-col items-center mb-3">
            <CircularProgress score={newsScore} color={newsColor} />
            <span
              className="mt-2 text-xs px-3 py-1 rounded-full font-bold"
              style={{ background: `${newsColor}22`, color: newsColor }}
            >
              {data.news_sentiment.label}
            </span>
          </div>
          <p className="text-xs italic mb-3" style={{ color: "#94A3B8" }}>{data.news_sentiment.summary}</p>
          <div className="flex flex-col gap-1.5">
            {data?.news_sentiment?.key_points?.map((pt, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="mt-1.5 rounded-full flex-shrink-0" style={{ width: "6px", height: "6px", background: newsColor }} />
                <span className="text-xs" style={{ color: "#94A3B8" }}>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical */}
        <div className="rounded-lg p-4" style={{ background: "#0A0B0E", border: "1px solid #1E2028" }}>
          <p className="text-xs font-semibold mb-3" style={{ color: "#64748B" }}>📈 Teknik Analiz</p>
          <div className="flex flex-col items-center mb-3">
            <CircularProgress score={techScore} color={techColor} />
            <span
              className="mt-2 text-xs px-3 py-1 rounded-full font-bold"
              style={{ background: `${techColor}22`, color: techColor }}
            >
              {data?.technical?.trend} Trend
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {data?.technical?.key_points?.map((pt, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="mt-1.5 rounded-full flex-shrink-0" style={{ width: "6px", height: "6px", background: techColor }} />
                <span className="text-xs" style={{ color: "#94A3B8" }}>{pt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div
        className="rounded-xl p-5 mb-5 text-center"
        style={{ background: `${actionColor}0D`, border: `2px solid ${actionColor}40` }}
      >
        <p className="text-xs mb-2" style={{ color: "#64748B" }}>Yapay Zeka Önerisi</p>
        <div className="text-4xl font-bold mb-3" style={{ color: actionColor }}>
          {actionEmoji} {action}
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span style={{ color: "#64748B" }}>Güven Skoru</span>
            <span style={{ color: "#F1F5F9" }}>{data.recommendation.confidence}%</span>
          </div>
          <div className="rounded-full overflow-hidden" style={{ height: "6px", background: "#1E2028" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${confBarWidth}%`,
                background: "linear-gradient(to right, #6366F1, #8B5CF6)",
                transition: "width 1s ease-out",
              }}
            />
          </div>
        </div>

        <p className="text-sm italic" style={{ color: "#94A3B8" }}>{data.recommendation.reason}</p>
      </div>

      {/* News list */}
      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #1E2028" }}>
        <p className="text-xs font-semibold px-4 py-3" style={{ color: "#64748B", background: "#0A0B0E" }}>
          📰 Haberlerden Öne Çıkanlar
        </p>
        {data?.news?.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 transition-colors"
            style={{ borderTop: i > 0 ? "1px solid #1E2028" : "none" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#1E2028"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
          >
            <div className="rounded-full flex-shrink-0" style={{ width: "8px", height: "8px", background: sentDotColor(item.sentiment) }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate" style={{ color: "#F1F5F9" }}>{item.title}</p>
              <p className="text-xs" style={{ color: "#64748B" }}>{item.source} · {item.published_at}</p>
            </div>
            <span className="text-xs flex-shrink-0" style={{ color: "#64748B" }}>↗</span>
          </a>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-center mt-4" style={{ color: "#475569" }}>
        ⚠️ Bu analiz yatırım tavsiyesi değildir. Yatırım kararlarınızı kendi araştırmanıza dayandırınız.
      </p>
    </div>
  );
}
