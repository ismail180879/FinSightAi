interface NavbarProps {
  activePage: "analysis" | "prediction";
  setActivePage: (page: "analysis" | "prediction") => void;
  setShowAlertModal: (show: boolean) => void;
}

export function Navbar({ activePage, setActivePage, setShowAlertModal }: NavbarProps) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6"
      style={{
        height: "56px",
        background: "#0A0B0E",
        borderBottom: "1px solid #1E2028",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">⚡</span>
        <span className="text-lg">
          <span style={{ color: "#F1F5F9" }} className="font-bold">FinSight</span>
          <span style={{ color: "#6366F1" }} className="font-bold"> AI</span>
        </span>
      </div>

      <div className="flex items-center">
        <button
          onClick={() => setActivePage("analysis")}
          className="relative px-5 py-3 text-sm transition-colors duration-200"
          style={{ color: activePage === "analysis" ? "#F1F5F9" : "#64748B" }}
        >
          📊 Analiz
          {activePage === "analysis" && (
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{ height: "2px", background: "#6366F1" }}
            />
          )}
        </button>
        <button
          onClick={() => setActivePage("prediction")}
          className="relative px-5 py-3 text-sm transition-colors duration-200"
          style={{ color: activePage === "prediction" ? "#F1F5F9" : "#64748B" }}
        >
          🔮 Tahmin Hesapla
          {activePage === "prediction" && (
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{ height: "2px", background: "#6366F1" }}
            />
          )}
        </button>
      </div>

      <button
        onClick={() => setShowAlertModal(true)}
        className="px-4 py-2 rounded-lg text-sm transition-all duration-200"
        style={{ border: "1px solid #6366F1", color: "#6366F1", background: "transparent" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#6366F1";
          e.currentTarget.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#6366F1";
        }}
      >
        🔔 Alarm Kur
      </button>
    </nav>
  );
}
