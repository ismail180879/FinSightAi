import { useState, useEffect } from "react";

const STEPS = [
  { icon: "📰", text: "Haberler toplanıyor" },
  { icon: "📊", text: "Teknik göstergeler hesaplanıyor" },
  { icon: "🧠", text: "Yapay zeka analiz ediyor" },
  { icon: "✨", text: "Sonuçlar hazırlanıyor" },
];

export function AnalysisLoading() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, 2000);
    return () => clearInterval(stepTimer);
  }, []);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((p) => Math.min(p + 1, 100));
    }, 100);
    return () => clearInterval(progressTimer);
  }, []);

  useEffect(() => {
    const dotsTimer = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 500);
    return () => clearInterval(dotsTimer);
  }, []);

  return (
    <div
      className="rounded-xl p-8 flex flex-col items-center"
      style={{ background: "#111318", border: "1px solid #1E2028" }}
    >
      <style>{`
        @keyframes ai-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.4), 0 0 40px rgba(99,102,241,0.2); }
          50% { box-shadow: 0 0 40px rgba(99,102,241,0.7), 0 0 80px rgba(99,102,241,0.4); }
        }
        @keyframes ai-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Pulsing circle */}
      <div className="relative mb-8" style={{ width: "100px", height: "100px" }}>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(#6366F1, #8B5CF6, #6366F1)",
            animation: "ai-spin 2s linear infinite",
            padding: "3px",
          }}
        >
          <div
            className="w-full h-full rounded-full flex items-center justify-center"
            style={{
              background: "#111318",
              animation: "ai-pulse 2s ease-in-out infinite",
            }}
          >
            <span style={{ fontSize: "36px" }}>🧠</span>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="w-full max-w-xs flex flex-col gap-3 mb-6">
        {STEPS.map((step, i) => {
          const isDone = i < currentStep;
          const isCurrent = i === currentStep;
          return (
            <div
              key={i}
              className="flex items-center gap-3"
              style={{
                opacity: i > currentStep ? 0.3 : 1,
                animation: i === currentStep ? "fadeInUp 0.4s ease-out" : "none",
              }}
            >
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0 text-sm"
                style={{
                  width: "28px",
                  height: "28px",
                  background: isDone ? "rgba(16,185,129,0.2)" : isCurrent ? "rgba(99,102,241,0.2)" : "#1E2028",
                  color: isDone ? "#10B981" : isCurrent ? "#6366F1" : "#64748B",
                }}
              >
                {isDone ? "✓" : isCurrent ? "⟳" : step.icon}
              </div>
              <span className="text-sm" style={{ color: isDone ? "#10B981" : isCurrent ? "#F1F5F9" : "#64748B" }}>
                {step.text}{isCurrent ? dots : ""}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full rounded-full overflow-hidden" style={{ height: "4px", background: "#1E2028" }}>
        <div
          className="h-full rounded-full transition-all duration-100"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(to right, #6366F1, #8B5CF6)",
          }}
        />
      </div>
    </div>
  );
}
