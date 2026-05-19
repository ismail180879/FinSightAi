import { useState } from "react";
import { CartItem, PortfolioPredictionData, predictPortfolio } from "../services/api";
import { AssetShop } from "../components/prediction/AssetShop";
import { PortfolioCart } from "../components/prediction/PortfolioCart";
import { PredictionLoading } from "../components/prediction/PredictionLoading";
import { PredictionPortfolioResult } from "../components/prediction/PredictionPortfolioResult";

type PredictionState = "idle" | "loading" | "done";

export function PredictionPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [predictionState, setPredictionState] = useState<PredictionState>("idle");
  const [predictionData, setPredictionData] = useState<PortfolioPredictionData | null>(null);

  const handleAddToCart = (item: CartItem) => {
    // Prevent duplicates
    if (cartItems.some((c) => c.asset.id === item.asset.id)) return;
    setCartItems((prev) => [...prev, item]);
  };

  const handleRemoveFromCart = (assetId: string) => {
    setCartItems((prev) => prev.filter((c) => c.asset.id !== assetId));
  };

  const handlePredict = async () => {
    if (cartItems.length === 0) return;
    setPredictionState("loading");
    try {
      const data = await predictPortfolio(cartItems);
      setPredictionData(data);
      setPredictionState("done");
    } catch (err) {
      console.error("Portfolio prediction error:", err);
      setPredictionState("idle");
    }
  };

  const handleReset = () => {
    setPredictionState("idle");
    setPredictionData(null);
  };

  const isReadyToPredict = cartItems.length > 0;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 pb-20 md:pb-6">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-bold mb-1 flex items-center gap-2" style={{ color: "#F1F5F9", fontSize: "24px" }}>
          <span>🔮</span>
          <span>Tahmin Hesaplama</span>
        </h1>
        <p className="text-sm" style={{ color: "#64748B" }}>
          Portföyündeki varlıkların gelecekteki değerini yapay zeka ile tahmin et
        </p>
      </div>

      {predictionState === "idle" && (
        <div className="flex flex-col gap-5" style={{ animation: "fadeIn 0.3s ease-out" }}>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>

          {/* Two-panel layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" style={{ minHeight: "480px" }}>
            {/* Left: Asset Shop */}
            <AssetShop cartItems={cartItems} onAddToCart={handleAddToCart} />

            {/* Right: Portfolio Cart */}
            <PortfolioCart cartItems={cartItems} onRemove={handleRemoveFromCart} />
          </div>

          {/* Predict button */}
          <button
            onClick={handlePredict}
            disabled={!isReadyToPredict}
            className="w-full font-bold text-white transition-all duration-200"
            style={{
              height: "56px",
              borderRadius: "14px",
              background: isReadyToPredict
                ? "linear-gradient(135deg, #7C3AED, #6366F1)"
                : "#1E2028",
              color: isReadyToPredict ? "white" : "#475569",
              boxShadow: isReadyToPredict ? "0 4px 24px rgba(124,58,237,0.35)" : "none",
              cursor: isReadyToPredict ? "pointer" : "not-allowed",
              border: "none",
              fontSize: "16px",
              letterSpacing: "0.3px",
            }}
            onMouseEnter={(e) => {
              if (isReadyToPredict) {
                e.currentTarget.style.background = "linear-gradient(135deg, #8B5CF6, #818CF8)";
                e.currentTarget.style.boxShadow = "0 4px 32px rgba(124,58,237,0.5)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (isReadyToPredict) {
                e.currentTarget.style.background = "linear-gradient(135deg, #7C3AED, #6366F1)";
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(124,58,237,0.35)";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            🔮 {cartItems.length > 0 ? `Portföyü Tahmin Et (${cartItems.length} varlık)` : "Portföyü Tahmin Et"}
          </button>

          {!isReadyToPredict && (
            <p className="text-xs text-center" style={{ color: "#475569", marginTop: "-8px" }}>
              Tahmin yapmak için en az 1 varlık eklemelisiniz
            </p>
          )}
        </div>
      )}

      {predictionState === "loading" && (
        <PredictionLoading itemCount={cartItems.length} />
      )}

      {predictionState === "done" && predictionData && (
        <PredictionPortfolioResult
          data={predictionData}
          cartItems={cartItems}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
