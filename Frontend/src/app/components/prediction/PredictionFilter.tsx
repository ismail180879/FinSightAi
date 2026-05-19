import { ASSET_CATEGORIES, CategoryKey, Asset } from "../../data/assets";

interface PredictionFilterProps {
  selectedCategory: CategoryKey;
  setSelectedCategory: (cat: CategoryKey) => void;
  selectedAsset: Asset | null;
  setSelectedAsset: (asset: Asset) => void;
}

export function PredictionFilter({
  selectedCategory,
  setSelectedCategory,
  selectedAsset,
  setSelectedAsset,
}: PredictionFilterProps) {
  const category = ASSET_CATEGORIES[selectedCategory];

  return (
    <div className="rounded-xl p-5" style={{ background: "#111318", border: "1px solid #1E2028" }}>
      <p className="text-xs uppercase tracking-wider mb-4" style={{ color: "#64748B" }}>
        Adım 1 — Varlık Seçin
      </p>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {(Object.keys(ASSET_CATEGORIES) as CategoryKey[]).map((key) => {
          const cat = ASSET_CATEGORIES[key];
          const isActive = key === selectedCategory;
          return (
            <button
              key={key}
              onClick={() => { setSelectedCategory(key); setSelectedAsset(ASSET_CATEGORIES[key].assets[0]); }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-150"
              style={{
                background: isActive ? "#6366F1" : "transparent",
                color: isActive ? "white" : "#64748B",
                border: `1px solid ${isActive ? "#6366F1" : "#1E2028"}`,
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Asset grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {category.assets.map((asset) => {
          const isSelected = selectedAsset?.id === asset.id;
          return (
            <button
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-150"
              style={{
                background: isSelected ? "rgba(99,102,241,0.12)" : "#0A0B0E",
                border: `1px solid ${isSelected ? "#6366F1" : "#1E2028"}`,
                boxShadow: isSelected ? "0 0 12px rgba(99,102,241,0.25)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = "#6366F1";
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = "#1E2028";
              }}
            >
              <div
                className="flex items-center justify-center rounded-full text-lg"
                style={{
                  width: "40px",
                  height: "40px",
                  background: `${category.color}22`,
                  color: category.color,
                }}
              >
                {asset.icon}
              </div>
              <span className="text-xs text-center" style={{ color: isSelected ? "#F1F5F9" : "#94A3B8" }}>
                {asset.name}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded"
                style={{ background: "#1E2028", color: "#64748B" }}
              >
                {asset.symbol}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
