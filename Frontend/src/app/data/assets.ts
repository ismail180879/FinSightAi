export const ASSET_CATEGORIES = {
  kripto: {
    label: "Kripto Para",
    icon: "₿",
    color: "#F7931A",
    assets: [
      { id: "bitcoin", symbol: "BTC", name: "Bitcoin", icon: "₿" },
      { id: "ethereum", symbol: "ETH", name: "Ethereum", icon: "Ξ" },
      { id: "binancecoin", symbol: "BNB", name: "BNB", icon: "◈" },
      { id: "solana", symbol: "SOL", name: "Solana", icon: "◎" },
      { id: "ripple", symbol: "XRP", name: "XRP", icon: "✕" },
    ],
  },
  doviz: {
    label: "Döviz",
    icon: "💱",
    color: "#10B981",
    assets: [
      { id: "usd", symbol: "USD", name: "Amerikan Doları", icon: "$" },
      { id: "eur", symbol: "EUR", name: "Euro", icon: "€" },
      { id: "gbp", symbol: "GBP", name: "İngiliz Sterlini", icon: "£" },
      { id: "gold", symbol: "XAU", name: "Altın (gram)", icon: "🥇" },
      { id: "silver", symbol: "XAG", name: "Gümüş", icon: "🥈" },
    ],
  },
  hisse: {
    label: "Hisse Senedi",
    icon: "📈",
    color: "#6366F1",
    assets: [
      { id: "thyao", symbol: "THYAO", name: "Türk Hava Yolları", icon: "✈" },
      { id: "garan", symbol: "GARAN", name: "Garanti BBVA", icon: "🏦" },
      { id: "asels", symbol: "ASELS", name: "Aselsan", icon: "🛡" },
      { id: "eregl", symbol: "EREGL", name: "Ereğli Demir Çelik", icon: "⚙" },
      { id: "bimas", symbol: "BIMAS", name: "BİM Mağazaları", icon: "🛒" },
    ],
  },
};

export type CategoryKey = keyof typeof ASSET_CATEGORIES;
export type Asset = (typeof ASSET_CATEGORIES)["kripto"]["assets"][0];
export type Category = (typeof ASSET_CATEGORIES)[CategoryKey];
