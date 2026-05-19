import { useState } from "react";
import { toast } from "sonner";
import { ASSET_CATEGORIES, CategoryKey } from "../../data/assets";

interface AlertModalProps {
  onClose: () => void;
}

const ALARM_TYPES = [
  { id: "above", label: "📈 Fiyat Üstüne Çıkarsa" },
  { id: "below", label: "📉 Fiyat Altına Düşerse" },
  { id: "news", label: "📰 Yeni Haber Gelince" },
];

export function AlertModal({ onClose }: AlertModalProps) {
  const [category, setCategory] = useState<CategoryKey>("kripto");
  const [assetId, setAssetId] = useState("bitcoin");
  const [alarmType, setAlarmType] = useState("above");
  const [targetPrice, setTargetPrice] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const assets = ASSET_CATEGORIES[category].assets;

  const handleCategoryChange = (cat: CategoryKey) => {
    setCategory(cat);
    setAssetId(ASSET_CATEGORIES[cat].assets[0].id);
  };

  const handleSubmit = async () => {
    if (!email) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    onClose();
    toast.success("✅ Alarm başarıyla kuruldu!", {
      description: `${assets.find((a) => a.id === assetId)?.name} için alarm aktif.`,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-2xl p-6"
        style={{ maxWidth: "480px", background: "#111318", border: "1px solid #1E2028" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold" style={{ color: "#F1F5F9" }}>🔔 Alarm Kur</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors"
            style={{ color: "#64748B" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#1E2028"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            ✕
          </button>
        </div>

        {/* Category */}
        <div className="mb-4">
          <p className="text-xs mb-2" style={{ color: "#64748B" }}>Kategori</p>
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(ASSET_CATEGORIES) as CategoryKey[]).map((key) => {
              const cat = ASSET_CATEGORIES[key];
              const isActive = key === category;
              return (
                <button
                  key={key}
                  onClick={() => handleCategoryChange(key)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all"
                  style={{
                    background: isActive ? "#6366F1" : "transparent",
                    color: isActive ? "white" : "#64748B",
                    border: `1px solid ${isActive ? "#6366F1" : "#1E2028"}`,
                  }}
                >
                  {cat.icon} {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Asset */}
        <div className="mb-4">
          <p className="text-xs mb-2" style={{ color: "#64748B" }}>Varlık</p>
          <select
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style={{ background: "#0A0B0E", color: "#F1F5F9", border: "1px solid #1E2028" }}
          >
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id} style={{ background: "#111318" }}>
                {asset.icon} {asset.name} ({asset.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Alarm type */}
        <div className="mb-4">
          <p className="text-xs mb-2" style={{ color: "#64748B" }}>Alarm Türü</p>
          <div className="flex flex-col gap-2">
            {ALARM_TYPES.map((type) => {
              const isActive = alarmType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setAlarmType(type.id)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left transition-all"
                  style={{
                    background: isActive ? "rgba(99,102,241,0.12)" : "transparent",
                    color: isActive ? "#F1F5F9" : "#64748B",
                    border: `1px solid ${isActive ? "#6366F1" : "#1E2028"}`,
                  }}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Target price */}
        {alarmType !== "news" && (
          <div className="mb-4">
            <p className="text-xs mb-2" style={{ color: "#64748B" }}>Hedef Fiyat</p>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="Hedef fiyat girin..."
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: "#0A0B0E", color: "#F1F5F9", border: "1px solid #1E2028" }}
            />
          </div>
        )}

        {/* Email */}
        <div className="mb-6">
          <p className="text-xs mb-2" style={{ color: "#64748B" }}>E-posta</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alarm@email.com"
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style={{ background: "#0A0B0E", color: "#F1F5F9", border: "1px solid #1E2028" }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!email || submitting}
          className="w-full py-3 rounded-xl text-white font-bold transition-all duration-200"
          style={{
            background: email && !submitting ? "linear-gradient(135deg, #6366F1, #8B5CF6)" : "#1E2028",
            color: email && !submitting ? "white" : "#64748B",
            cursor: email && !submitting ? "pointer" : "not-allowed",
          }}
        >
          {submitting ? "Alarm Kuruluyor..." : "🔔 Alarmı Kur"}
        </button>
      </div>
    </div>
  );
}
