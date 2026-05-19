import { useEffect, useRef, useState } from "react";
import { Asset } from "../../data/assets";

declare global {
  interface Window {
    TradingView: {
      widget: new (config: Record<string, unknown>) => { remove?: () => void };
    };
  }
}

const SYMBOL_MAP: Record<string, string> = {
  bitcoin: "BINANCE:BTCUSDT",
  ethereum: "BINANCE:ETHUSDT",
  binancecoin: "BINANCE:BNBUSDT",
  solana: "BINANCE:SOLUSDT",
  ripple: "BINANCE:XRPUSDT",
  gold: "TVC:GOLD",
  usd: "FX_IDC:USDTRY",
  eur: "FX_IDC:EURTRY",
  gbp: "FX_IDC:GBPTRY",
  silver: "TVC:SILVER",
  thyao: "BIST:THYAO",
  garan: "BIST:GARAN",
  asels: "BIST:ASELS",
  eregl: "BIST:EREGL",
  bimas: "BIST:BIMAS",
};

const INTERVALS: { label: string; value: string }[] = [
  { label: "1S", value: "60" },
  { label: "1G", value: "D" },
  { label: "1H", value: "W" },
  { label: "1A", value: "M" },
  { label: "3A", value: "3M" },
];

interface ChartPanelProps {
  selectedAsset: Asset;
}

export function ChartPanel({ selectedAsset }: ChartPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<{ remove?: () => void } | null>(null);
  const [activeInterval, setActiveInterval] = useState("60");

  const buildWidget = (symbol: string, interval: string) => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";
    const divId = "tv-widget-container";
    const el = document.createElement("div");
    el.id = divId;
    containerRef.current.appendChild(el);

    if (window.TradingView) {
      widgetRef.current = new window.TradingView.widget({
        container_id: divId,
        symbol,
        interval,
        theme: "dark",
        style: "1",
        width: "100%",
        height: 380,
        locale: "tr",
        hide_top_toolbar: false,
        backgroundColor: "#111318",
        gridColor: "#1E2028",
        allow_symbol_change: false,
        save_image: false,
      });
    }
  };

  useEffect(() => {
    const symbol = SYMBOL_MAP[selectedAsset.id] || "BINANCE:BTCUSDT";

    if (window.TradingView) {
      buildWidget(symbol, activeInterval);
      return;
    }

    const existing = document.querySelector('script[src*="tradingview"]');
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = () => buildWidget(symbol, activeInterval);
      document.head.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if (window.TradingView) {
          clearInterval(interval);
          buildWidget(symbol, activeInterval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [selectedAsset.id, activeInterval]);

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#111318", border: "1px solid #1E2028" }}>
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <span style={{ color: "#F1F5F9" }} className="text-sm font-semibold">Fiyat Grafiği</span>
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{ background: "rgba(99,102,241,0.2)", color: "#6366F1" }}
          >
            {selectedAsset.symbol}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {INTERVALS.map((iv) => (
            <button
              key={iv.value}
              onClick={() => setActiveInterval(iv.value)}
              className="px-3 py-1 rounded text-xs transition-all duration-150"
              style={{
                background: activeInterval === iv.value ? "#6366F1" : "transparent",
                color: activeInterval === iv.value ? "white" : "#64748B",
                border: `1px solid ${activeInterval === iv.value ? "#6366F1" : "#1E2028"}`,
              }}
            >
              {iv.label}
            </button>
          ))}
        </div>
      </div>
      <div ref={containerRef} style={{ height: "380px" }} />
    </div>
  );
}
