interface AnalyzeButtonProps {
  onAnalyze: () => void;
  isLoading?: boolean;
}

export function AnalyzeButton({ onAnalyze }: AnalyzeButtonProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onAnalyze}
        className="w-full text-white font-bold transition-all duration-200 active:scale-[0.98]"
        style={{
          height: "52px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
          boxShadow: "0 0 20px rgba(99,102,241,0.3)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "linear-gradient(135deg, #818CF8, #A78BFA)";
          e.currentTarget.style.boxShadow = "0 0 30px rgba(99,102,241,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "linear-gradient(135deg, #6366F1, #8B5CF6)";
          e.currentTarget.style.boxShadow = "0 0 20px rgba(99,102,241,0.3)";
        }}
      >
        🧠 Yapay Zeka ile Analiz Et
      </button>
      <p className="text-xs text-center" style={{ color: "#64748B" }}>
        Analiz yaklaşık 10-15 saniye sürebilir
      </p>
    </div>
  );
}
