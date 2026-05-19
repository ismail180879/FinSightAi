import { useState } from "react";
import { Toaster } from "sonner";
import { ASSET_CATEGORIES, CategoryKey, Asset } from "./data/assets";
import { Navbar } from "./components/layout/Navbar";
import { Sidebar } from "./components/layout/Sidebar";
import { AlertModal } from "./components/shared/AlertModal";
import { AnalysisPage } from "./pages/AnalysisPage";
import { PredictionPage } from "./pages/PredictionPage";

type ActivePage = "analysis" | "prediction";

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>("analysis");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("kripto");
  const [selectedAsset, setSelectedAsset] = useState<Asset>(ASSET_CATEGORIES.kripto.assets[0]);
  const [showAlertModal, setShowAlertModal] = useState(false);

  const handleSetCategory = (cat: CategoryKey) => {
    setActiveCategory(cat);
    setSelectedAsset(ASSET_CATEGORIES[cat].assets[0]);
  };

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: "#0A0B0E", color: "#F1F5F9", fontFamily: "'Inter', sans-serif" }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111318",
            border: "1px solid #1E2028",
            color: "#F1F5F9",
          },
        }}
      />

      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        setShowAlertModal={setShowAlertModal}
      />

      <div className="flex" style={{ paddingTop: "56px" }}>
        {activePage === "analysis" && (
          <Sidebar
            activeCategory={activeCategory}
            setActiveCategory={handleSetCategory}
            selectedAsset={selectedAsset}
            setSelectedAsset={setSelectedAsset}
          />
        )}

        <main
          className="flex-1 overflow-y-auto"
          style={{
            minHeight: "calc(100vh - 56px)",
            transition: "opacity 0.2s ease",
          }}
        >
          {activePage === "analysis" ? (
            <AnalysisPage selectedAsset={selectedAsset} activeCategory={activeCategory} />
          ) : (
            <PredictionPage />
          )}
        </main>
      </div>

      {showAlertModal && (
        <AlertModal onClose={() => setShowAlertModal(false)} />
      )}
    </div>
  );
}
