import { CartItem, getMockPrice } from "../../services/api";
import { ASSET_CATEGORIES } from "../../data/assets";

interface PortfolioCartProps {
  cartItems: CartItem[];
  onRemove: (assetId: string) => void;
}

function fmt(n: number, decimals = 2) {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

function getCurrency(category: string) {
  return category === "kripto" ? "$" : "₺";
}

export function PortfolioCart({ cartItems, onRemove }: PortfolioCartProps) {
  // Calculate totals — group by currency (crypto = $, others = ₺)
  let totalCostUSD = 0;
  let totalCurrentUSD = 0;
  let totalCostTRY = 0;
  let totalCurrentTRY = 0;

  cartItems.forEach((item) => {
    const currentPrice = getMockPrice(item.asset.id);
    const cost = item.amount * item.buyPrice;
    const current = item.amount * currentPrice;
    if (item.category === "kripto") {
      totalCostUSD += cost;
      totalCurrentUSD += current;
    } else {
      totalCostTRY += cost;
      totalCurrentTRY += current;
    }
  });

  const hasCrypto = totalCostUSD > 0;
  const hasTRY = totalCostTRY > 0;
  const pnlUSD = totalCurrentUSD - totalCostUSD;
  const pnlTRY = totalCurrentTRY - totalCostTRY;
  const pnlPctUSD = totalCostUSD > 0 ? (pnlUSD / totalCostUSD) * 100 : 0;
  const pnlPctTRY = totalCostTRY > 0 ? (pnlTRY / totalCostTRY) * 100 : 0;

  return (
    <div
      className="rounded-2xl flex flex-col h-full"
      style={{
        background: "#111318",
        border: "1px solid #1E2028",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "18px" }}>📦</span>
          <h3 className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>Portföyüm</h3>
          {cartItems.length > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: "rgba(99,102,241,0.15)", color: "#818CF8" }}
            >
              {cartItems.length} varlık
            </span>
          )}
        </div>
      </div>

      {/* Cart items or empty state */}
      <div className="flex-1 overflow-y-auto px-3 pb-3" style={{ maxHeight: "calc(100vh - 360px)" }}>
        {cartItems.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-12 px-4 text-center"
            style={{ minHeight: "200px" }}
          >
            <div
              className="flex items-center justify-center rounded-full mb-4"
              style={{
                width: "64px",
                height: "64px",
                background: "#1E2028",
                fontSize: "28px",
              }}
            >
              🛒
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: "#64748B" }}>
              Portföyünüz boş
            </p>
            <p className="text-xs" style={{ color: "#475569" }}>
              Sol panelden varlık ekleyerek portföyünüzü oluşturun
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {cartItems.map((item) => {
              const currentPrice = getMockPrice(item.asset.id);
              const cost = item.amount * item.buyPrice;
              const current = item.amount * currentPrice;
              const pnl = current - cost;
              const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
              const currency = getCurrency(item.category);
              const catColor = ASSET_CATEGORIES[item.category].color;

              return (
                <div
                  key={item.asset.id}
                  className="rounded-xl px-3.5 py-3 transition-all duration-150"
                  style={{
                    background: "#0D0E12",
                    border: "1px solid #1E2028",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#2A2D3A";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#1E2028";
                  }}
                >
                  {/* Top row: icon + name + delete */}
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className="flex items-center justify-center rounded-full flex-shrink-0"
                      style={{
                        width: "30px",
                        height: "30px",
                        background: `${catColor}18`,
                        color: catColor,
                        fontSize: "14px",
                      }}
                    >
                      {item.asset.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "#F1F5F9" }}>
                        {item.asset.name}
                      </p>
                      <p className="text-xs" style={{ color: "#64748B" }}>
                        {item.amount} {item.asset.symbol} × {currency}{fmt(item.buyPrice)}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemove(item.asset.id)}
                      className="flex items-center justify-center rounded-lg transition-all duration-150 flex-shrink-0"
                      style={{
                        width: "28px",
                        height: "28px",
                        background: "transparent",
                        color: "#475569",
                        border: "1px solid transparent",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(239,68,68,0.1)";
                        e.currentTarget.style.color = "#EF4444";
                        e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#475569";
                        e.currentTarget.style.borderColor = "transparent";
                      }}
                      title="Sil"
                    >
                      🗑
                    </button>
                  </div>

                  {/* Bottom row: cost + current + pnl */}
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex-1">
                      <span style={{ color: "#475569" }}>Maliyet: </span>
                      <span style={{ color: "#94A3B8" }}>{currency}{fmt(cost)}</span>
                    </div>
                    <div
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        background: pnl >= 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                        color: pnl >= 0 ? "#10B981" : "#EF4444",
                      }}
                    >
                      {pnl >= 0 ? "+" : ""}{currency}{fmt(pnl)} ({pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary footer */}
      {cartItems.length > 0 && (
        <div
          className="px-5 py-4 flex flex-col gap-2"
          style={{
            borderTop: "1px solid #1E2028",
            background: "#0D0E12",
          }}
        >
          {hasCrypto && (
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span style={{ color: "#64748B" }}>Toplam Maliyet (Kripto)</span>
                <span className="font-medium" style={{ color: "#F1F5F9" }}>${fmt(totalCostUSD)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: "#64748B" }}>Mevcut Değer</span>
                <span className="font-medium" style={{ color: "#F1F5F9" }}>${fmt(totalCurrentUSD)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: "#64748B" }}>Anlık K/Z</span>
                <span
                  className="font-semibold"
                  style={{ color: pnlUSD >= 0 ? "#10B981" : "#EF4444" }}
                >
                  {pnlUSD >= 0 ? "+" : ""}${fmt(pnlUSD)} ({pnlPctUSD >= 0 ? "+" : ""}{pnlPctUSD.toFixed(1)}%)
                </span>
              </div>
            </div>
          )}

          {hasCrypto && hasTRY && (
            <div style={{ borderTop: "1px solid #1E2028", margin: "4px 0" }} />
          )}

          {hasTRY && (
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span style={{ color: "#64748B" }}>Toplam Maliyet (TRY)</span>
                <span className="font-medium" style={{ color: "#F1F5F9" }}>₺{fmt(totalCostTRY)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: "#64748B" }}>Mevcut Değer</span>
                <span className="font-medium" style={{ color: "#F1F5F9" }}>₺{fmt(totalCurrentTRY)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: "#64748B" }}>Anlık K/Z</span>
                <span
                  className="font-semibold"
                  style={{ color: pnlTRY >= 0 ? "#10B981" : "#EF4444" }}
                >
                  {pnlTRY >= 0 ? "+" : ""}₺{fmt(pnlTRY)} ({pnlPctTRY >= 0 ? "+" : ""}{pnlPctTRY.toFixed(1)}%)
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
