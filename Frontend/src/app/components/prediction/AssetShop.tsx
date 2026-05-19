import { useState, useRef, useEffect } from "react";
import { ASSET_CATEGORIES, CategoryKey, Asset } from "../../data/assets";
import { CartItem, getMockPrice } from "../../services/api";

interface AssetShopProps {
  cartItems: CartItem[];
  onAddToCart: (item: CartItem) => void;
}

function fmtPrice(n: number, category: string) {
  const prefix = category === "kripto" ? "$" : "₺";
  if (n >= 1000) {
    return `${prefix}${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(n)}`;
  }
  return `${prefix}${new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)}`;
}

interface AddPopupProps {
  asset: Asset;
  category: CategoryKey;
  onAdd: (item: CartItem) => void;
  onClose: () => void;
  anchorRect: DOMRect | null;
}

function AddPopup({ asset, category, onAdd, onClose, anchorRect }: AddPopupProps) {
  const [amount, setAmount] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [unit, setUnit] = useState("Gram");
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const currency = category === "kripto" ? "$" : "₺";
  const amountNum = parseFloat(amount) || 0;
  const buyPriceNum = parseFloat(buyPrice) || 0;
  const isValid = amountNum > 0 && buyPriceNum > 0;

  const handleSubmit = () => {
    if (!isValid) return;
    onAdd({
      asset,
      category,
      amount: amountNum,
      buyPrice: buyPriceNum,
      unit: category === "doviz" && asset.id === "gold" ? unit : undefined,
    });
    onClose();
  };

  // Calculate popup position
  const popupStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 100,
    width: "320px",
  };

  if (anchorRect) {
    popupStyle.top = anchorRect.bottom + 8;
    popupStyle.left = anchorRect.left;

    // Ensure popup stays within viewport
    if (anchorRect.left + 320 > window.innerWidth) {
      popupStyle.left = window.innerWidth - 340;
    }
    if (anchorRect.bottom + 280 > window.innerHeight) {
      popupStyle.top = anchorRect.top - 280;
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99,
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(2px)",
        }}
      />
      <div
        ref={popupRef}
        style={{
          ...popupStyle,
          background: "#161820",
          border: "1px solid #2A2D3A",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(99,102,241,0.15)",
          animation: "popupIn 0.2s ease-out",
        }}
      >
        <style>{`
          @keyframes popupIn {
            from { opacity: 0; transform: translateY(-8px) scale(0.96); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: "32px",
                height: "32px",
                background: `${ASSET_CATEGORIES[category].color}22`,
                color: ASSET_CATEGORIES[category].color,
                fontSize: "16px",
              }}
            >
              {asset.icon}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>{asset.name}</p>
              <p className="text-xs" style={{ color: "#64748B" }}>{asset.symbol}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg transition-colors"
            style={{
              width: "28px",
              height: "28px",
              background: "#1E2028",
              color: "#64748B",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#2A2D3A"; e.currentTarget.style.color = "#F1F5F9"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#1E2028"; e.currentTarget.style.color = "#64748B"; }}
          >
            ✕
          </button>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: "#64748B" }}>
              {category === "hisse" ? "Adet" : "Miktar"}
            </label>
            <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid #2A2D3A" }}>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={category === "kripto" ? "0.5" : category === "hisse" ? "100" : "10"}
                step={category === "hisse" ? "1" : "any"}
                autoFocus
                className="flex-1 px-3 py-2.5 text-sm outline-none"
                style={{ background: "#0D0E12", color: "#F1F5F9" }}
              />
              {category === "doviz" && asset.id === "gold" ? (
                <div className="flex" style={{ borderLeft: "1px solid #2A2D3A" }}>
                  {["Gram", "Ons", "Adet"].map((u) => (
                    <button
                      key={u}
                      onClick={() => setUnit(u)}
                      className="px-2.5 text-xs transition-colors"
                      style={{
                        background: unit === u ? "#6366F1" : "#0D0E12",
                        color: unit === u ? "white" : "#64748B",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  className="flex items-center px-3 text-xs font-medium"
                  style={{ background: "#1E2028", color: "#64748B" }}
                >
                  {asset.symbol}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: "#64748B" }}>
              Alış Fiyatı ({currency})
            </label>
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              placeholder={`Aldığınız fiyat (${currency})`}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: "#0D0E12", color: "#F1F5F9", border: "1px solid #2A2D3A" }}
            />
          </div>

          {/* Quick cost preview */}
          {amountNum > 0 && buyPriceNum > 0 && (
            <div
              className="rounded-lg px-3 py-2 flex justify-between items-center"
              style={{ background: "#0D0E12", border: "1px solid #1E2028" }}
            >
              <span className="text-xs" style={{ color: "#64748B" }}>Toplam Maliyet</span>
              <span className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>
                {currency}{new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amountNum * buyPriceNum)}
              </span>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{
              background: isValid ? "linear-gradient(135deg, #6366F1, #8B5CF6)" : "#1E2028",
              color: isValid ? "white" : "#64748B",
              border: "none",
              cursor: isValid ? "pointer" : "not-allowed",
              boxShadow: isValid ? "0 4px 16px rgba(99,102,241,0.35)" : "none",
            }}
            onMouseEnter={(e) => {
              if (isValid) {
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(99,102,241,0.5)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (isValid) {
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(99,102,241,0.35)";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            ➕ Sepete Ekle
          </button>
        </div>
      </div>
    </>
  );
}

export function AssetShop({ cartItems, onAddToCart }: AssetShopProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("kripto");
  const [popupAsset, setPopupAsset] = useState<Asset | null>(null);
  const [popupAnchor, setPopupAnchor] = useState<DOMRect | null>(null);

  const category = ASSET_CATEGORIES[activeCategory];
  const inCartIds = new Set(cartItems.map((c) => c.asset.id));

  const handleOpenPopup = (asset: Asset, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPopupAsset(asset);
    setPopupAnchor(rect);
  };

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
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2 mb-4">
          <span style={{ fontSize: "18px" }}>🏪</span>
          <h3 className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>Varlık Mağazası</h3>
        </div>

        {/* Category pills */}
        <div className="flex gap-1.5">
          {(Object.keys(ASSET_CATEGORIES) as CategoryKey[]).map((key) => {
            const cat = ASSET_CATEGORIES[key];
            const isActive = key === activeCategory;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-150"
                style={{
                  background: isActive ? "#6366F1" : "transparent",
                  color: isActive ? "white" : "#64748B",
                  border: `1px solid ${isActive ? "#6366F1" : "#1E2028"}`,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.borderColor = "#6366F180";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.borderColor = "#1E2028";
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Asset list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3" style={{ maxHeight: "calc(100vh - 280px)" }}>
        <div className="flex flex-col gap-1.5">
          {category.assets.map((asset) => {
            const isInCart = inCartIds.has(asset.id);
            const price = getMockPrice(asset.id);
            return (
              <div
                key={asset.id}
                className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150"
                style={{
                  background: isInCart ? "rgba(99,102,241,0.08)" : "transparent",
                  border: `1px solid ${isInCart ? "rgba(99,102,241,0.25)" : "transparent"}`,
                }}
                onMouseEnter={(e) => {
                  if (!isInCart) e.currentTarget.style.background = "#1A1B22";
                }}
                onMouseLeave={(e) => {
                  if (!isInCart) e.currentTarget.style.background = "transparent";
                }}
              >
                {/* Icon */}
                <div
                  className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{
                    width: "36px",
                    height: "36px",
                    background: `${category.color}18`,
                    color: category.color,
                    fontSize: "16px",
                  }}
                >
                  {asset.icon}
                </div>

                {/* Name + price */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "#F1F5F9" }}>
                    {asset.name}
                  </p>
                  <p className="text-xs" style={{ color: "#64748B" }}>
                    {fmtPrice(price, activeCategory)}
                  </p>
                </div>

                {/* Add button or "Added" badge */}
                {isInCart ? (
                  <span
                    className="text-xs px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{
                      background: "rgba(16,185,129,0.12)",
                      color: "#10B981",
                    }}
                  >
                    ✓ Eklendi
                  </span>
                ) : (
                  <button
                    onClick={(e) => handleOpenPopup(asset, e)}
                    className="text-xs px-3 py-1.5 rounded-lg flex-shrink-0 transition-all duration-150"
                    style={{
                      background: "rgba(99,102,241,0.12)",
                      color: "#818CF8",
                      border: "1px solid rgba(99,102,241,0.2)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(99,102,241,0.25)";
                      e.currentTarget.style.borderColor = "#6366F1";
                      e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(99,102,241,0.12)";
                      e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    + Ekle
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Popup */}
      {popupAsset && (
        <AddPopup
          asset={popupAsset}
          category={activeCategory}
          onAdd={onAddToCart}
          onClose={() => { setPopupAsset(null); setPopupAnchor(null); }}
          anchorRect={popupAnchor}
        />
      )}
    </div>
  );
}
