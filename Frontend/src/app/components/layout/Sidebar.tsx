import { ASSET_CATEGORIES, CategoryKey, Asset } from "../../data/assets";

interface SidebarProps {
  activeCategory: CategoryKey;
  setActiveCategory: (cat: CategoryKey) => void;
  selectedAsset: Asset;
  setSelectedAsset: (asset: Asset) => void;
}

export function Sidebar({ activeCategory, setActiveCategory, selectedAsset, setSelectedAsset }: SidebarProps) {
  const category = ASSET_CATEGORIES[activeCategory];

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col flex-shrink-0 overflow-y-auto"
        style={{
          width: "240px",
          background: "#0D0E12",
          borderRight: "1px solid #1E2028",
          height: "calc(100vh - 56px)",
          padding: "16px",
        }}
      >
        <div className="flex flex-col gap-1 mb-4">
          {(Object.keys(ASSET_CATEGORIES) as CategoryKey[]).map((key) => {
            const cat = ASSET_CATEGORIES[key];
            const isActive = key === activeCategory;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className="flex items-center gap-2 rounded-lg text-sm transition-all duration-150 text-left"
                style={{
                  padding: "10px 12px",
                  background: isActive ? "rgba(99,102,241,0.15)" : "transparent",
                  borderLeft: isActive ? "3px solid #6366F1" : "3px solid transparent",
                  color: isActive ? "#6366F1" : "#64748B",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "#1E2028";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{ height: "1px", background: "#1E2028", margin: "4px 0 12px" }} />

        <p className="text-xs mb-2 tracking-wider" style={{ color: "#64748B" }}>
          VARLIK SEÇ
        </p>

        <div className="flex flex-col gap-1">
          {category.assets.map((asset) => {
            const isSelected = selectedAsset?.id === asset.id;
            return (
              <button
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className="flex items-center gap-2 rounded-md text-left transition-all duration-150"
                style={{
                  padding: "8px 10px",
                  background: isSelected ? "rgba(99,102,241,0.12)" : "transparent",
                  borderLeft: isSelected ? "2px solid #6366F1" : "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "#1E2028";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "transparent";
                }}
              >
                <div
                  className="flex items-center justify-center rounded-full flex-shrink-0 text-xs font-bold"
                  style={{
                    width: "28px",
                    height: "28px",
                    background: `${category.color}22`,
                    color: category.color,
                  }}
                >
                  {asset.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs truncate" style={{ color: isSelected ? "#F1F5F9" : "#94A3B8" }}>
                    {asset.name}
                  </div>
                </div>
                <span className="text-xs" style={{ color: "#64748B" }}>
                  {asset.symbol}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex"
        style={{ background: "#0D0E12", borderTop: "1px solid #1E2028" }}
      >
        {(Object.keys(ASSET_CATEGORIES) as CategoryKey[]).map((key) => {
          const cat = ASSET_CATEGORIES[key];
          const isActive = key === activeCategory;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className="flex-1 flex flex-col items-center justify-center py-3 text-xs transition-colors"
              style={{ color: isActive ? "#6366F1" : "#64748B" }}
            >
              <span className="text-lg">{cat.icon}</span>
              <span className="mt-1">{cat.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
