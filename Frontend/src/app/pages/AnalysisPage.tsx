import { useState, useEffect } from "react";
import { Asset } from "../data/assets";
import { getPrice, analyzeAsset, PriceData, AnalysisData } from "../services/api";
import { PriceCard } from "../components/analysis/PriceCard";
import { TechnicalIndicators } from "../components/analysis/TechnicalIndicators";
import { ChartPanel } from "../components/analysis/ChartPanel";
import { AnalyzeButton } from "../components/analysis/AnalyzeButton";
import { AnalysisLoading } from "../components/analysis/AnalysisLoading";
import { AnalysisResult } from "../components/analysis/AnalysisResult";

import { toast } from "sonner";

interface AnalysisPageProps {
  selectedAsset: Asset;
  activeCategory: string;
}

type AnalysisState = "idle" | "loading" | "done";

export function AnalysisPage({ selectedAsset, activeCategory }: AnalysisPageProps) {
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle");
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);

  useEffect(() => {
    setAnalysisState("idle");
    setAnalysisData(null);
    setPriceData(null);
    setPriceLoading(true);

    getPrice(selectedAsset.id)
      .then((data) => setPriceData(data))
      .finally(() => setPriceLoading(false));
  }, [selectedAsset.id]);

  const handleAnalyze = async () => {
    setAnalysisState("loading");
    try {
      const data = await analyzeAsset(selectedAsset.id, activeCategory);
      setAnalysisData(data);
      setAnalysisState("done");
    } catch (err: any) {
      console.error("Analysis error:", err);
      toast.error(err.message || "Analiz sırasında bir hata oluştu.");
      setAnalysisState("idle");
    }
  };

  const handleRefresh = () => {
    setAnalysisState("idle");
    setAnalysisData(null);
    handleAnalyze();
  };

  return (
    <div
      className="flex flex-col md:flex-row gap-4 p-4 md:p-5 w-full"
      style={{ minHeight: "calc(100vh - 56px)" }}
    >
      {/* Left column - 35% */}
      <div className="flex flex-col gap-0 md:w-[35%] flex-shrink-0">
        <PriceCard priceData={priceData} selectedAsset={selectedAsset} loading={priceLoading} />
        <TechnicalIndicators
          priceData={priceData}
          technicalData={analysisData?.technical || null}
        />
      </div>

      {/* Right column - 65% */}
      <div className="flex-1 flex flex-col gap-4">
        <ChartPanel selectedAsset={selectedAsset} />

        {analysisState === "idle" && (
          <AnalyzeButton onAnalyze={handleAnalyze} />
        )}

        {analysisState === "loading" && (
          <AnalysisLoading />
        )}

        {analysisState === "done" && analysisData && (
          <AnalysisResult
            data={analysisData}
            assetName={selectedAsset.name}
            onRefresh={handleRefresh}
          />
        )}
      </div>
    </div>
  );
}
