Redesign and rebuild the existing FinSight AI React app 
completely from scratch with the following specifications.
Dark theme. Professional fintech aesthetic.

COLOR PALETTE (keep existing):
- Background: #0A0B0E
- Card background: #111318
- Border: #1E2028
- Primary accent: #6366F1 (indigo)
- Success: #10B981 (green)
- Danger: #EF4444 (red)
- Warning: #F59E0B (amber)
- Text primary: #F1F5F9
- Text secondary: #64748B
Font: Inter. Tailwind CSS.

---

FOLDER STRUCTURE:

src/
├── App.jsx
├── pages/
│   ├── AnalysisPage.jsx
│   └── PredictionPage.jsx
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   ├── analysis/
│   │   ├── PriceCard.jsx
│   │   ├── TechnicalIndicators.jsx
│   │   ├── ChartPanel.jsx
│   │   ├── AnalyzeButton.jsx
│   │   ├── AnalysisLoading.jsx
│   │   └── AnalysisResult.jsx
│   ├── prediction/
│   │   ├── PredictionFilter.jsx
│   │   ├── PredictionForm.jsx
│   │   ├── PredictionLoading.jsx
│   │   └── PredictionResult.jsx
│   └── shared/
│       ├── AlertModal.jsx
│       └── Toast.jsx
├── services/
│   └── api.js
├── hooks/
│   ├── usePrice.js
│   └── useAnalysis.js
└── data/
    └── assets.js

---

FILE: src/data/assets.js

Export this object:

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
      { id: "ripple", symbol: "XRP", name: "XRP", icon: "✕" }
    ]
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
      { id: "silver", symbol: "XAG", name: "Gümüş", icon: "🥈" }
    ]
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
      { id: "bimas", symbol: "BIMAS", name: "BİM Mağazaları", icon: "🛒" }
    ]
  }
}

---

FILE: src/services/api.js

const BASE_URL = "http://localhost:8000/api";
const MOCK = true; // backend hazır olunca false yap

Mock data and real API functions:

export const getPrice = async (assetId) => {
  if (MOCK) return {
    price: 67430, change_24h: 2.3,
    high_24h: 68200, low_24h: 65100,
    symbol: "BTC", name: "Bitcoin"
  };
  const res = await fetch(`${BASE_URL}/price/${assetId}`);
  return res.json();
};

export const analyzeAsset = async (assetId) => {
  if (MOCK) {
    await new Promise(r => setTimeout(r, 3000));
    return {
      news_sentiment: {
        score: 72, label: "POZİTİF",
        summary: "Bitcoin piyasası genel olarak olumlu seyrediyor.",
        key_points: [
          "Bitcoin ETF'e rekor giriş gerçekleşti",
          "Fed faiz kararı bu hafta açıklanacak",
          "Kurumsal alımlar son 30 günde arttı"
        ]
      },
      technical: {
        rsi: 58, rsi_label: "Normal",
        trend: "Yükselen", ma7: 66200, ma30: 63800,
        support: 64000, resistance: 69500,
        key_points: [
          "RSI aşırı alım bölgesine yakın",
          "Direnç seviyesi test ediliyor",
          "Hacim ortalamanın altında seyrediyor"
        ]
      },
      recommendation: {
        action: "BEKLE", confidence: 71,
        reason: "Haber sentimenti pozitif ancak fiyat direnç bölgesine yaklaşmış durumda. Kırılım onayı beklenmesi önerilir.",
        disclaimer: "Bu öneri yatırım tavsiyesi değildir."
      },
      news: [
        { title: "Bitcoin spot ETF'lerine günlük giriş rekor kırdı", source: "CoinDesk", published_at: "2 saat önce", sentiment: "positive", url: "#" },
        { title: "Fed toplantısı öncesi piyasalar temkinli", source: "BloombergHT", published_at: "4 saat önce", sentiment: "neutral", url: "#" },
        { title: "Kurumsal yatırımcılar BTC alımlarını artırıyor", source: "CoinTürk", published_at: "6 saat önce", sentiment: "positive", url: "#" }
      ]
    };
  }
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ asset: assetId })
  });
  return res.json();
};

export const predictAsset = async (payload) => {
  if (MOCK) {
    await new Promise(r => setTimeout(r, 4000));
    return {
      asset: payload.asset_name,
      amount: payload.amount,
      buy_price: payload.buy_price,
      current_price: payload.buy_price * 1.023,
      predictions: {
        "1_hafta": { price: payload.buy_price * 1.04, change: 4.0, profit: payload.amount * payload.buy_price * 0.04 },
        "1_ay": { price: payload.buy_price * 1.12, change: 12.0, profit: payload.amount * payload.buy_price * 0.12 },
        "3_ay": { price: payload.buy_price * 1.28, change: 28.0, profit: payload.amount * payload.buy_price * 0.28 },
        "6_ay": { price: payload.buy_price * 1.45, change: 45.0, profit: payload.amount * payload.buy_price * 0.45 }
      },
      chart_data: [
        { label: "Şimdi", price: payload.buy_price },
        { label: "1H", price: payload.buy_price * 1.04 },
        { label: "1A", price: payload.buy_price * 1.12 },
        { label: "3A", price: payload.buy_price * 1.28 },
        { label: "6A", price: payload.buy_price * 1.45 }
      ],
      analysis: "Teknik göstergeler ve haber sentimenti birlikte değerlendirildiğinde orta vadeli pozitif bir görünüm öne çıkmaktadır.",
      risk_level: "ORTA",
      disclaimer: "Bu tahminler yatırım tavsiyesi değildir."
    };
  }
  const res = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const getNews = async (assetId) => {
  if (MOCK) return { articles: [] };
  const res = await fetch(`${BASE_URL}/news/${assetId}`);
  return res.json();
};

export const createAlert = async (data) => {
  const res = await fetch(`${BASE_URL}/alerts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const getAlerts = async () => {
  const res = await fetch(`${BASE_URL}/alerts`);
  return res.json();
};

export const deleteAlert = async (id) => {
  const res = await fetch(`${BASE_URL}/alerts/${id}`, { method: "DELETE" });
  return res.json();
};

---

FILE: src/App.jsx

State management:
- activePage: "analysis" | "prediction"
- activeCategory: "kripto" | "doviz" | "hisse"
- selectedAsset: object from ASSET_CATEGORIES
- showAlertModal: boolean

Layout:
- Fixed Navbar at top (56px)
- Below navbar: flex row
  - Sidebar (240px fixed width)
  - Main content (flex-1, overflow-y-auto)

Pass all state and setters as props to children.

---

FILE: src/components/layout/Navbar.jsx

Height: 56px. Fixed top. Background: #0A0B0E.
Border bottom: 1px solid #1E2028.
Horizontal padding: 24px.

LEFT: "⚡ FinSight AI" logo
- "FinSight" white bold, "AI" indigo

CENTER: Two navigation tabs
- [📊 Analiz] [🔮 Tahmin Hesapla]
- Active tab: white text + indigo bottom border 2px
- Inactive: gray text
- onClick changes activePage state

RIGHT: "🔔 Alarm Kur" button
- Outlined style: border indigo, text indigo
- Hover: fill indigo, text white
- onClick opens alert modal

---

FILE: src/components/layout/Sidebar.jsx

Width: 240px. Fixed height 100vh minus navbar.
Background: #0D0E12. Border right: 1px solid #1E2028.
Padding: 16px.

TOP SECTION - Category selector:
3 buttons stacked vertically, full width each:

For each category in ASSET_CATEGORIES:
- Icon + Label (e.g. "₿ Kripto Para")
- Active: indigo background (#6366F1/20), 
  indigo left border 3px, indigo text
- Inactive: transparent background, gray text
- Hover: #1E2028 background
- Border radius: 8px. Padding: 10px 12px.

DIVIDER: thin line #1E2028

BOTTOM SECTION - Asset list for active category:
Label: "VAR LIK SEÇ" in tiny uppercase gray

For each asset in activeCategory.assets:
- Row: icon circle + name + symbol
- Icon circle: 28px, colored bg (category color /20),
  category color text
- Asset name: white small
- Symbol: gray tiny, right aligned
- Active asset: indigo background tint, 
  white text, indigo left border
- Hover: #1E2028 background
- onClick: setSelectedAsset(asset)
- Border radius: 6px. Padding: 8px 10px.

---

FILE: src/pages/AnalysisPage.jsx

State:
- analysisState: "idle" | "loading" | "done"
- analysisData: null | object
- priceData: object (loaded on asset change)

On selectedAsset change:
- Reset analysisState to "idle"
- Reset analysisData to null  
- Fetch price data via getPrice(selectedAsset.id)

Layout: 2 columns
Left (35%): PriceCard + TechnicalIndicators
Right (65%): ChartPanel + AnalyzeButton + 
             AnalysisLoading + AnalysisResult

---

FILE: src/components/analysis/PriceCard.jsx

Props: priceData, selectedAsset

Card with indigo left border accent (3px).
Padding: 20px.

TOP: Asset name gray small uppercase
PRICE: Large number "$67,430" white 36px bold
  - tabular-nums font
  - On price update: flash green if up, red if down
    (CSS transition, 1 second)

CHANGE BADGE: 
- "+2.3% ▲ bugün" green pill if positive
- "-1.2% ▼ bugün" red pill if negative

STATS ROW (2 columns):
- "24s Yüksek" label gray tiny + value green
- "24s Düşük" label gray tiny + value red

LOADING STATE: Show skeleton shimmer animation
(gray animated gradient rectangles)

---

FILE: src/components/analysis/TechnicalIndicators.jsx

Props: priceData

Card below PriceCard.
Title: "TEKNİK GÖSTERGELER" uppercase gray tiny

RSI GAUGE:
- Semicircle SVG gauge (draw with SVG arc paths)
- Background arc: #1E2028
- Fill arc: color based on value
  (< 30: green, 30-70: amber, > 70: red)
- Center: large RSI number, label below "Normal Bölge"
- Left: "Aşırı Satım" tiny gray
- Right: "Aşırı Alım" tiny gray

MA ROW:
- "MA7: $66,200" with colored value
- "MA30: $63,800" with colored value  
- If MA7 > MA30: "📈 Yükselen Trend" green badge
- If MA7 < MA30: "📉 Düşen Trend" red badge

DESTEK/DİRENÇ:
- "Destek: $64,000" green
- "Direnç: $69,500" red
- Progress bar showing current price position 
  between support and resistance
  (green left portion, red right portion, 
   white dot at current price position)

---

FILE: src/components/analysis/ChartPanel.jsx

Props: selectedAsset

Card. Title "Fiyat Grafiği" + 
asset symbol badge indigo top left.

Timeframe buttons top right:
[1S] [1G] [1H] [1A] [3A]
Active: indigo filled. Inactive: ghost.

TradingView widget integration:
useEffect that loads TradingView script 
and creates widget with these settings:
- container_id: "tv-widget-container"
- symbol mapping:
  bitcoin → "BINANCE:BTCUSDT"
  ethereum → "BINANCE:ETHUSDT"
  binancecoin → "BINANCE:BNBUSDT"
  solana → "BINANCE:SOLUSDT"
  ripple → "BINANCE:XRPUSDT"
  gold → "TVC:GOLD"
  usd → "FX_IDC:USDTRY"
  eur → "FX_IDC:EURTRY"
  thyao → "BIST:THYAO"
  garan → "BIST:GARAN"
  (default: "BINANCE:BTCUSDT")
- interval: "60"
- theme: "dark"
- style: "1"
- width: "100%"
- height: 380
- locale: "tr"
- hide_top_toolbar: false
- backgroundColor: "#111318"

When selectedAsset changes, 
remove old widget and create new one.

---

FILE: src/components/analysis/AnalyzeButton.jsx

Props: onAnalyze, isLoading

Only shown when analysisState === "idle"

Full-width button. Height: 52px.
Background: indigo gradient 
(from #6366F1 to #8B5CF6)
Text: "🧠 Yapay Zeka ile Analiz Et" white bold
Border radius: 12px.
Box shadow: 0 0 20px #6366F1/30

Hover: brighter gradient + stronger shadow
Active: slightly scaled down (scale 0.98)

Below button: tiny gray disclaimer text centered:
"Analiz yaklaşık 10-15 saniye sürebilir"

---

FILE: src/components/analysis/AnalysisLoading.jsx

Shown when analysisState === "loading"

Full card. Centered content.

Animated steps shown sequentially 
(each step appears after 2 seconds):

Step 1 (0s): 
"📰 Haberler toplanıyor..." 
+ animated dots (...)

Step 2 (2s): 
"📊 Teknik göstergeler hesaplanıyor..."

Step 3 (4s): 
"🧠 Yapay zeka analiz ediyor..."

Step 4 (6s): 
"✨ Sonuçlar hazırlanıyor..."

Visual: 
- Large pulsing circle in center (indigo glow)
- Inside circle: brain emoji 🧠 large
- Circle has rotating gradient border animation
- Progress bar below that fills over 10 seconds
- Each completed step shows green checkmark ✓
- Current step shows spinner

CSS animations needed:
- @keyframes pulse for the glow effect
- @keyframes spin for the border
- @keyframes fadeInUp for each step appearing

---

FILE: src/components/analysis/AnalysisResult.jsx

Props: data (full analysis object), assetName

Shown when analysisState === "done"
Animate in with fadeInUp when it appears.

SECTION 1 - AI ANALİZ header:
"🧠 AI Analiz" title + asset badge +
"Son güncelleme: az önce" gray +
"🔄 Yenile" small indigo button

TWO COLUMN GRID:

LEFT — "📰 Haber Analizi" card:
- Circular progress ring (SVG) 
  showing sentiment score 0-100
  ring color: green if >50, amber if 30-50, red if <30
- Large score number center of ring
- Label badge below: "POZİTİF" / "NEGATİF" / "NÖTR"
- Summary text in gray italic
- Key points list (3 items) with colored dots

RIGHT — "📈 Teknik Analiz" card:
Same ring design for technical score
(calculate as: RSI normal=65, 
trend up=+15, down=-15)
- Technical key points list (3 items)

RECOMMENDATION BOX (full width):
Gradient border card 
(border: 2px solid transparent, 
background-clip: padding-box,
use pseudo element for gradient border)

Large centered action text:
- "✅ AL" if action === "AL" → green
- "⏸ BEKLE" if action === "BEKLE" → amber  
- "🔴 SAT" if action === "SAT" → red
Font size: 32px bold

"Yapay Zeka Önerisi" gray tiny label above

Confidence bar:
"Güven Skoru" label left + 
animated progress bar (indigo fill) + 
percentage right
Bar animates from 0 to value on appear.

Reason text: gray italic centered

NEWS LIST below recommendation:
Title: "📰 Haberlerden Öne Çıkanlar"
Each news item:
- Colored sentiment dot (green/red/gray)
- Title text
- Source + time gray
- External link icon
Hoverable rows.

Disclaimer at very bottom tiny gray:
"⚠️ Bu analiz yatırım tavsiyesi değildir. 
  Yatırım kararlarınızı kendi araştırmanıza 
  dayandırınız."

---

FILE: src/pages/PredictionPage.jsx

State:
- selectedCategory: "kripto" | "doviz" | "hisse"
- selectedAsset: object
- formData: { amount, buyPrice, unit }
- predictionState: "idle" | "loading" | "done"
- predictionData: null | object

Layout: Single column, max-width 900px, centered.

Page title: 
"🔮 Tahmin Hesaplama" white large
Subtitle: "Elindeki varlıkların gelecekteki 
değerini yapay zeka ile tahmin et" gray

---

FILE: src/components/prediction/PredictionFilter.jsx

STEP 1 — Category & Asset Selection:

Category tabs (horizontal pill group):
[₿ Kripto Para] [💱 Döviz] [📈 Hisse Senedi]
Active: indigo filled pill
Inactive: dark outlined pill

Asset grid below (3 columns):
For each asset in selected category:
Card style button.
- Icon circle (colored by category)
- Asset name
- Symbol badge
- Selected: indigo border + indigo tint background
- Unselected: dark card
- Hover: slight border glow

---

FILE: src/components/prediction/PredictionForm.jsx

Props: selectedAsset, onSubmit

STEP 2 — Amount & Price Input:

Show only when asset is selected.
Animate in with fadeInUp.

Card with title: 
"Ne kadar {asset.name} var?" 

For Kripto: 
- "Miktar" input: number, placeholder "0.5"
- Unit label: asset.symbol (e.g. "BTC")
- "Alış Fiyatı" input: number, 
  placeholder "Aldığınız fiyat ($)"

For Döviz (Altın):
- "Miktar" input: number
- Unit selector toggle: [Gram] [Ons] [Adet]
- "Alış Fiyatı" input in TL

For Hisse:
- "Adet" input: number, integer only
- "Alış Fiyatı" input in TL per share

LIVE CALCULATION BOX:
As user types, show:
Dark box with:
"Toplam Maliyet: ₺XXX,XXX"
"Mevcut Değer: ₺XXX,XXX" (using current mock price)
"Anlık K/Z: +₺X,XXX (+X.X%)" green/red

PREDICT BUTTON:
Full width, 52px height.
Purple gradient: from #7C3AED to #6366F1
"🔮 Tahmin Et" white bold large
Disabled and grayed if amount or price not filled.
Enabled: glowing purple shadow

---

FILE: src/components/prediction/PredictionLoading.jsx

Similar to AnalysisLoading but different steps:

Step 1: "📊 Geçmiş veriler analiz ediliyor..."
Step 2: "🔍 Piyasa koşulları değerlendiriliyor..."
Step 3: "🤖 Yapay zeka tahmin oluşturuyor..."
Step 4: "📈 Grafik hazırlanıyor..."

Same visual style (pulsing circle, 
rotating border, progress bar)
But use purple/violet color instead of indigo.

---

FILE: src/components/prediction/PredictionResult.jsx

Props: data, assetName, amount, buyPrice

HEADER SECTION:
Asset name + badge. 
"Toplam Yatırım: $X,XXX" gray
"Alış Fiyatı: $XX,XXX" gray

PREDICTION CARDS ROW (4 cards horizontal):
One card for each timeframe:

Card: "1 Hafta"
- Predicted price large bold
- Change percentage badge 
  (green if positive, red if negative)
- Profit/loss amount 
  "+$XXX kâr" green or "-$XXX zarar" red
- Card border: green if profit, red if loss

Card: "1 Ay" (same structure)
Card: "3 Ay" (same structure)
Card: "6 Ay" (same structure)
  - Highlighted with glow if best period

PREDICTION CHART:
Use recharts LineChart.
X-axis: ["Şimdi", "1 Hafta", "1 Ay", "3 Ay", "6 Ay"]
Y-axis: price values, formatted with $ or ₺
Line: smooth curve, gradient fill below 
  (green if going up, red if going down)
Reference line: horizontal dashed line 
  at buy price labeled "Alış Fiyatınız"
Tooltip: custom dark tooltip showing 
  price, change%, profit/loss for each point

RISK BADGE:
"Risk Seviyesi: ORTA" amber badge
(DÜŞÜK=green, ORTA=amber, YÜKSEK=red)

AI ANALYSIS TEXT:
Card with "🧠 Yapay Zeka Yorumu" title
Analysis text in white/gray
Key factors list (bullet points)

RESET BUTTON:
"🔄 Yeni Tahmin Yap" outlined indigo
Resets all state back to idle.

DISCLAIMER:
Red warning box at bottom:
"⚠️ ÖNEMLİ UYARI"
"Bu tahminler yapay zeka tarafından oluşturulmuş 
olup yatırım tavsiyesi niteliği taşımamaktadır. 
Geçmiş performans gelecek sonuçları garanti etmez."

---

FILE: src/components/shared/AlertModal.jsx

Triggered from Navbar "Alarm Kur" button.
Dark overlay. Centered card 480px wide.
Close on overlay click or X button.

Form:
1. Category selector (same pill tabs)
2. Asset dropdown (filtered by category)
3. Alarm type pills:
   [📈 Fiyat Üstüne Çıkarsa] 
   [📉 Fiyat Altına Düşerse]
   [📰 Yeni Haber Gelince]
4. Target price input 
   (only for price type alarms)
5. Email input

Submit: indigo gradient full-width button
"Alarmı Kur"

On success: 
Close modal + show green toast notification
"✅ Alarm başarıyla kuruldu!"

---

GENERAL REQUIREMENTS:

1. All page transitions: 
   smooth fadeIn (opacity 0 to 1, 200ms)

2. All cards: 
   subtle hover effect (border brightens slightly)

3. Loading skeletons: 
   animated gray shimmer on all cards 
   while data loads

4. Mobile responsive:
   - Sidebar becomes bottom tab bar on mobile
   - Single column layout
   - Chart height 260px

5. No page reload anywhere — 
   everything is SPA with state

6. Recharts for prediction chart only.
   TradingView widget for price chart.

7. All amounts formatted properly:
   - Crypto: max 8 decimal places
   - Fiat: 2 decimal places, thousands separator
   - Use Intl.NumberFormat

8. Color flash on price change:
   green flash if price goes up
   red flash if price goes down
   (1 second CSS animation)

9. Every interactive element has 
   hover and active states.

10. Console.log for all API calls 
    (for debugging with backend team).