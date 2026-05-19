const BASE_URL = "http://localhost:8000/api";
const MOCK = false;

export interface PriceData {
  price: number;
  change_24h: number;
  high_24h: number;
  low_24h: number;
  symbol: string;
  name: string;
}

export interface AnalysisData {
  news_sentiment: {
    score: number;
    label: string;
    summary: string;
    key_points: string[];
  };
  technical: {
    rsi: number;
    rsi_label: string;
    trend: string;
    ma7: number;
    ma30: number;
    support: number;
    resistance: number;
    key_points: string[];
  };
  recommendation: {
    action: string;
    confidence: number;
    reason: string;
    disclaimer: string;
  };
  news: {
    title: string;
    source: string;
    published_at: string;
    sentiment: string;
    url: string;
  }[];
}

export interface PredictPayload {
  asset_name: string;
  amount: number;
  buy_price: number;
  unit?: string;
}

export interface PredictionPeriod {
  price: number;
  change: number;
  profit: number;
}

export interface PredictionData {
  asset: string;
  asset_id: string;
  amount: number;
  buy_price: number;
  current_price: number;
  predictions: {
    "1_hafta": PredictionPeriod;
    "1_ay": PredictionPeriod;
    "3_ay": PredictionPeriod;
    "6_ay": PredictionPeriod;
  };
  chart_data: { label: string; price: number }[];
  analysis: string;
  key_factors: string[];
  risk_level: string;
  disclaimer: string;
}

// --- Cart System Types ---

export interface CartItem {
  asset: {
    id: string;
    symbol: string;
    name: string;
    icon: string;
  };
  category: "kripto" | "doviz" | "hisse";
  amount: number;
  buyPrice: number;
  unit?: string;
}

export interface PortfolioPredictionData {
  items: Record<string, PredictionData>;
  totalChartData: { label: string; value: number }[];
  totalPredictions: {
    "1_hafta": { value: number; cost: number; profit: number; change: number };
    "1_ay": { value: number; cost: number; profit: number; change: number };
    "3_ay": { value: number; cost: number; profit: number; change: number };
    "6_ay": { value: number; cost: number; profit: number; change: number };
  };
  totalCost: number;
  totalCurrentValue: number;
}

// --- Mock current prices ---

const MOCK_CURRENT: Record<string, number> = {
  bitcoin: 67430, ethereum: 3240, binancecoin: 580, solana: 145, ripple: 0.52,
  usd: 32.45, eur: 35.20, gbp: 41.30, gold: 2890, silver: 32.5,
  thyao: 248, garan: 89.5, asels: 42.8, eregl: 28.6, bimas: 415,
};

export const getMockPrice = (assetId: string): number => {
  return MOCK_CURRENT[assetId] || 100;
};

// --- Mock analysis texts per asset ---

const MOCK_ANALYSES: Record<string, { analysis: string; key_factors: string[]; risk_level: string }> = {
  bitcoin: {
    analysis: "Bitcoin teknik göstergeler ve haber sentimenti birlikte değerlendirildiğinde orta-uzun vadeli pozitif bir görünüm öne çıkmaktadır. ETF girişleri ve kurumsal talep güçlü seyretmeye devam ediyor.",
    key_factors: ["ETF girişleri rekor seviyede", "Halving etkisi fiyatı destekliyor", "Makroekonomik belirsizlik risk oluşturuyor"],
    risk_level: "ORTA",
  },
  ethereum: {
    analysis: "Ethereum ekosistemindeki DeFi ve Layer-2 gelişmeleri orta vadede olumlu bir tablo çiziyor. Ancak rekabet baskısı göz ardı edilmemeli.",
    key_factors: ["Layer-2 ekosistemi büyüyor", "Staking getirileri cazip", "Solana ile rekabet devam ediyor"],
    risk_level: "ORTA",
  },
  binancecoin: {
    analysis: "BNB, Binance ekosisteminin güçlü kullanıcı tabanından destek almaya devam ediyor. Ancak düzenleyici riskler dikkatle takip edilmeli.",
    key_factors: ["Binance kullanıcı tabanı güçlü", "Token yakım mekanizması aktif", "Regülasyon riskleri mevcut"],
    risk_level: "YÜKSEK",
  },
  solana: {
    analysis: "Solana ağı performans artışı ve meme coin aktivitesiyle dikkat çekiyor. Yüksek volatilite beklenebilir.",
    key_factors: ["Ağ performansı iyileşiyor", "DeFi TVL artışı pozitif", "Meme coin bağımlılığı risk oluşturuyor"],
    risk_level: "YÜKSEK",
  },
  ripple: {
    analysis: "XRP, SEC davasının çözüme kavuşmasının ardından kurumsal benimseme potansiyeli taşıyor. Bankacılık sektöründeki adaptasyon belirleyici olacak.",
    key_factors: ["SEC davası sonuçlandı", "Bankacılık ortaklıkları genişliyor", "SWIFT alternatifi olarak konumlanma"],
    risk_level: "ORTA",
  },
  usd: {
    analysis: "Amerikan doları, Fed'in faiz politikası doğrultusunda TRY karşısında kademeli değer kazanmaya devam edebilir.",
    key_factors: ["Fed faiz politikası belirleyici", "TCMB kararları etkili", "Cari denge açığı baskı yapıyor"],
    risk_level: "DÜŞÜK",
  },
  eur: {
    analysis: "Euro, ECB faiz kararları ve Avrupa ekonomisindeki yavaşlama sinyalleri arasında dengeli seyrediyor.",
    key_factors: ["ECB faiz politikası", "Avrupa ekonomisinde yavaşlama", "TL'deki değer kaybı destekleyici"],
    risk_level: "DÜŞÜK",
  },
  gbp: {
    analysis: "İngiliz sterlini, BoE'nin temkinli para politikası ve İngiltere ekonomisindeki toparlanma ile destekleniyor.",
    key_factors: ["BoE faiz politikası", "Enflasyon verileri yakından izleniyor", "Brexit sonrası ticaret anlaşmaları"],
    risk_level: "DÜŞÜK",
  },
  gold: {
    analysis: "Altın, jeopolitik riskler ve merkez bankası alımlarıyla desteklenerek güvenli liman özelliğini korumaya devam ediyor.",
    key_factors: ["Merkez bankası alımları rekor seviyede", "Jeopolitik riskler altını destekliyor", "Reel faiz oranları belirleyici"],
    risk_level: "DÜŞÜK",
  },
  silver: {
    analysis: "Gümüş, endüstriyel talep ve altınla pozitif korelasyon sayesinde değer kazanmaya devam edebilir.",
    key_factors: ["Yeşil enerji sektörü talebi", "Altın ile korelasyon güçlü", "Arz kısıtları fiyatı destekliyor"],
    risk_level: "ORTA",
  },
  thyao: {
    analysis: "Türk Hava Yolları, yolcu trafiğindeki artış ve filosundaki genişleme ile güçlü bir büyüme trendi sergiliyor.",
    key_factors: ["Yolcu trafiği rekor seviyede", "Filo genişlemesi devam ediyor", "Yakıt maliyetleri risk oluşturuyor"],
    risk_level: "ORTA",
  },
  garan: {
    analysis: "Garanti BBVA, güçlü bilanço yapısı ve aktif büyümesiyle bankacılık sektöründe öne çıkıyor.",
    key_factors: ["Net faiz marjı yüksek", "Aktif kalitesi güçlü", "Faiz oranları belirsizliği devam ediyor"],
    risk_level: "ORTA",
  },
  asels: {
    analysis: "Aselsan, savunma sanayi yatırımları ve ihracat artışıyla uzun vadeli büyüme potansiyeli taşıyor.",
    key_factors: ["Savunma bütçesi artışı", "İhracat siparişleri genişliyor", "Teknolojik yetkinlik avantaj sağlıyor"],
    risk_level: "DÜŞÜK",
  },
  eregl: {
    analysis: "Ereğli Demir Çelik, küresel çelik talebi ve iç pazar dinamikleriyle değerlendirildiğinde temkinli bir görünüm sunuyor.",
    key_factors: ["Küresel çelik talebi zayıf", "İç pazar dinamikleri destekleyici", "Enerji maliyetleri baskı yapıyor"],
    risk_level: "ORTA",
  },
  bimas: {
    analysis: "BİM, perakende sektöründeki güçlü konumu ve mağaza ağı genişlemesiyle istikrarlı büyüme potansiyeli sunuyor.",
    key_factors: ["Mağaza ağı genişliyor", "Enflasyon ortamında güçlü fiyatlama gücü", "Lojistik maliyetler yönetilebilir düzeyde"],
    risk_level: "DÜŞÜK",
  },
};

// --- Mock multipliers per asset for varied predictions ---

const MOCK_MULTIPLIERS: Record<string, { w1: number; m1: number; m3: number; m6: number }> = {
  bitcoin: { w1: 1.03, m1: 1.09, m3: 1.22, m6: 1.38 },
  ethereum: { w1: 1.04, m1: 1.11, m3: 1.26, m6: 1.42 },
  binancecoin: { w1: 0.98, m1: 1.05, m3: 1.15, m6: 1.28 },
  solana: { w1: 1.06, m1: 1.15, m3: 1.35, m6: 1.55 },
  ripple: { w1: 1.02, m1: 1.08, m3: 1.18, m6: 1.30 },
  usd: { w1: 1.005, m1: 1.02, m3: 1.06, m6: 1.12 },
  eur: { w1: 1.004, m1: 1.018, m3: 1.05, m6: 1.10 },
  gbp: { w1: 1.003, m1: 1.015, m3: 1.04, m6: 1.08 },
  gold: { w1: 1.008, m1: 1.03, m3: 1.08, m6: 1.15 },
  silver: { w1: 1.01, m1: 1.04, m3: 1.10, m6: 1.18 },
  thyao: { w1: 1.03, m1: 1.08, m3: 1.20, m6: 1.35 },
  garan: { w1: 1.02, m1: 1.06, m3: 1.15, m6: 1.25 },
  asels: { w1: 1.01, m1: 1.05, m3: 1.12, m6: 1.22 },
  eregl: { w1: 0.99, m1: 1.03, m3: 1.08, m6: 1.14 },
  bimas: { w1: 1.015, m1: 1.04, m3: 1.10, m6: 1.18 },
};

// --- API Functions ---

export const getPrice = async (assetId: string): Promise<PriceData> => {
  console.log(`[API] getPrice: ${assetId}`);
  if (MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    const mockPrices: Record<string, Partial<PriceData>> = {
      bitcoin: { price: 67430, change_24h: 2.3, high_24h: 68200, low_24h: 65100, symbol: "BTC", name: "Bitcoin" },
      ethereum: { price: 3240, change_24h: 1.8, high_24h: 3310, low_24h: 3150, symbol: "ETH", name: "Ethereum" },
      binancecoin: { price: 580, change_24h: -0.5, high_24h: 595, low_24h: 572, symbol: "BNB", name: "BNB" },
      solana: { price: 145, change_24h: 4.2, high_24h: 149, low_24h: 138, symbol: "SOL", name: "Solana" },
      ripple: { price: 0.52, change_24h: -1.2, high_24h: 0.54, low_24h: 0.50, symbol: "XRP", name: "XRP" },
      usd: { price: 32.45, change_24h: 0.3, high_24h: 32.60, low_24h: 32.30, symbol: "USD", name: "Amerikan Doları" },
      eur: { price: 35.20, change_24h: -0.2, high_24h: 35.45, low_24h: 35.10, symbol: "EUR", name: "Euro" },
      gbp: { price: 41.30, change_24h: 0.1, high_24h: 41.50, low_24h: 41.10, symbol: "GBP", name: "İngiliz Sterlini" },
      gold: { price: 2890, change_24h: 0.8, high_24h: 2910, low_24h: 2870, symbol: "XAU", name: "Altın" },
      silver: { price: 32.5, change_24h: -0.4, high_24h: 33.0, low_24h: 32.1, symbol: "XAG", name: "Gümüş" },
      thyao: { price: 248, change_24h: 2.1, high_24h: 252, low_24h: 243, symbol: "THYAO", name: "Türk Hava Yolları" },
      garan: { price: 89.5, change_24h: 1.3, high_24h: 91.0, low_24h: 88.2, symbol: "GARAN", name: "Garanti BBVA" },
      asels: { price: 42.8, change_24h: -0.7, high_24h: 43.5, low_24h: 42.2, symbol: "ASELS", name: "Aselsan" },
      eregl: { price: 28.6, change_24h: 3.2, high_24h: 29.1, low_24h: 27.8, symbol: "EREGL", name: "Ereğli Demir Çelik" },
      bimas: { price: 415, change_24h: 0.5, high_24h: 420, low_24h: 410, symbol: "BIMAS", name: "BİM Mağazaları" },
    };
    return (mockPrices[assetId] || { price: 1000, change_24h: 0, high_24h: 1100, low_24h: 900, symbol: "???", name: "Unknown" }) as PriceData;
  }
  const res = await fetch(`${BASE_URL}/price/${assetId}`);
  return res.json();
};

export const analyzeAsset = async (assetId: string, category: string): Promise<AnalysisData> => {
  console.log(`[API] analyzeAsset: ${assetId} (${category})`);
  if (MOCK) {
    // ... (mock logic kept as is)
    await new Promise((r) => setTimeout(r, 3000));
    return {
      news_sentiment: {
        score: 72,
        label: "POZİTİF",
        summary: "Bitcoin piyasası genel olarak olumlu seyrediyor. Kurumsal ilgi artmaya devam ediyor.",
        key_points: [
          "Bitcoin ETF'e rekor giriş gerçekleşti",
          "Fed faiz kararı bu hafta açıklanacak",
          "Kurumsal alımlar son 30 günde arttı",
        ],
      },
      technical: {
        rsi: 58,
        rsi_label: "Normal",
        trend: "Yükselen",
        ma7: 66200,
        ma30: 63800,
        support: 64000,
        resistance: 69500,
        key_points: [
          "RSI aşırı alım bölgesine yakın",
          "Direnç seviyesi test ediliyor",
          "Hacim ortalamanın altında seyrediyor",
        ],
      },
      recommendation: {
        action: "BEKLE",
        confidence: 71,
        reason: "Haber sentimenti pozitif ancak fiyat direnç bölgesine yaklaşmış durumda. Kırılım onayı beklenmesi önerilir.",
        disclaimer: "Bu öneri yatırım tavsiyesi değildir.",
      },
      news: [
        { title: "Bitcoin spot ETF'lerine günlük giriş rekor kırdı", source: "CoinDesk", published_at: "2 saat önce", sentiment: "positive", url: "#" },
        { title: "Fed toplantısı öncesi piyasalar temkinli", source: "BloombergHT", published_at: "4 saat önce", sentiment: "neutral", url: "#" },
        { title: "Kurumsal yatırımcılar BTC alımlarını artırıyor", source: "CoinTürk", published_at: "6 saat önce", sentiment: "positive", url: "#" },
      ],
    };
  }
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ asset: assetId, category: category }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    console.error("[API Error] analyzeAsset failed:", res.status, errData);
    throw new Error(errData.detail || "Analiz başarısız oldu");
  }

  return res.json();
};

export const predictAsset = async (assetId: string, payload: PredictPayload): Promise<PredictionData> => {
  console.log(`[API] predictAsset:`, assetId, payload);
  if (MOCK) {
    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));
    const currentPrice = MOCK_CURRENT[assetId] || payload.buy_price * 1.02;
    const mult = MOCK_MULTIPLIERS[assetId] || { w1: 1.03, m1: 1.08, m3: 1.18, m6: 1.30 };
    const info = MOCK_ANALYSES[assetId] || {
      analysis: "Teknik göstergeler ve piyasa koşulları birlikte değerlendirildiğinde dengeli bir görünüm söz konusudur.",
      key_factors: ["Piyasa koşulları takip edilmeli", "Teknik göstergeler nötr bölgede", "Küresel gelişmelere dikkat"],
      risk_level: "ORTA",
    };

    const makePred = (multiplier: number): PredictionPeriod => {
      const price = currentPrice * multiplier;
      const change = (multiplier - 1) * 100;
      const profit = payload.amount * (price - payload.buy_price);
      return { price: Math.round(price * 100) / 100, change: Math.round(change * 100) / 100, profit: Math.round(profit * 100) / 100 };
    };

    return {
      asset: payload.asset_name,
      asset_id: assetId,
      amount: payload.amount,
      buy_price: payload.buy_price,
      current_price: currentPrice,
      predictions: {
        "1_hafta": makePred(mult.w1),
        "1_ay": makePred(mult.m1),
        "3_ay": makePred(mult.m3),
        "6_ay": makePred(mult.m6),
      },
      chart_data: [
        { label: "Şimdi", price: currentPrice },
        { label: "1 Hafta", price: Math.round(currentPrice * mult.w1 * 100) / 100 },
        { label: "1 Ay", price: Math.round(currentPrice * mult.m1 * 100) / 100 },
        { label: "3 Ay", price: Math.round(currentPrice * mult.m3 * 100) / 100 },
        { label: "6 Ay", price: Math.round(currentPrice * mult.m6 * 100) / 100 },
      ],
      analysis: info.analysis,
      key_factors: info.key_factors,
      risk_level: info.risk_level,
      disclaimer: "Bu tahminler yatırım tavsiyesi değildir.",
    };
  }
  const res = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};

// --- Portfolio Prediction (multiple assets at once) ---

export const predictPortfolio = async (cartItems: CartItem[]): Promise<PortfolioPredictionData> => {
  console.log(`[API] predictPortfolio: ${cartItems.length} items`);

  // Predict all assets in parallel
  const predictions = await Promise.all(
    cartItems.map((item) =>
      predictAsset(item.asset.id, {
        asset_name: item.asset.name,
        amount: item.amount,
        buy_price: item.buyPrice,
        unit: item.unit,
      })
    )
  );

  // Build items map
  const items: Record<string, PredictionData> = {};
  predictions.forEach((pred) => {
    items[pred.asset_id] = pred;
  });

  // Calculate totals
  let totalCost = 0;
  let totalCurrentValue = 0;
  cartItems.forEach((item) => {
    totalCost += item.amount * item.buyPrice;
    totalCurrentValue += item.amount * (MOCK_CURRENT[item.asset.id] || item.buyPrice);
  });

  // Calculate total portfolio predictions for each period
  const periods = ["1_hafta", "1_ay", "3_ay", "6_ay"] as const;
  const totalPredictions = {} as PortfolioPredictionData["totalPredictions"];

  periods.forEach((period) => {
    let totalValue = 0;
    cartItems.forEach((item) => {
      const pred = items[item.asset.id];
      if (pred) {
        totalValue += item.amount * pred.predictions[period].price;
      }
    });
    const profit = totalValue - totalCost;
    const change = totalCost > 0 ? (profit / totalCost) * 100 : 0;
    totalPredictions[period] = {
      value: Math.round(totalValue * 100) / 100,
      cost: Math.round(totalCost * 100) / 100,
      profit: Math.round(profit * 100) / 100,
      change: Math.round(change * 100) / 100,
    };
  });

  // Build total chart data
  const totalChartData = [
    { label: "Şimdi", value: Math.round(totalCurrentValue * 100) / 100 },
    { label: "1 Hafta", value: totalPredictions["1_hafta"].value },
    { label: "1 Ay", value: totalPredictions["1_ay"].value },
    { label: "3 Ay", value: totalPredictions["3_ay"].value },
    { label: "6 Ay", value: totalPredictions["6_ay"].value },
  ];

  return {
    items,
    totalChartData,
    totalPredictions,
    totalCost: Math.round(totalCost * 100) / 100,
    totalCurrentValue: Math.round(totalCurrentValue * 100) / 100,
  };
};

export const createAlert = async (data: {
  category: string;
  asset: string;
  type: string;
  targetPrice?: number;
  email: string;
}) => {
  console.log(`[API] createAlert:`, data);
  const res = await fetch(`${BASE_URL}/alerts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};
