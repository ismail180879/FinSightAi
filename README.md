# 📊 FinSight AI

**FinSight AI**, modern finansal analiz yöntemleri ile yapay zekayı bir araya getiren, destekli bir **finansal analiz ve akıllı portföy tahminleme** platformudur. Kullanıcıların kripto paralar, döviz kurları, değerli metaller ve hisse senetlerinden oluşan özelleştirilmiş sepetler/portföyler oluşturmasına ve bu varlıkların gelecekteki performanslarını yapay zeka analizleriyle tahminlemesine olanak tanır.

---

## 🚀 Öne Çıkan Özellikler

- **Çoklu Varlık Desteği:** Kripto paralar (CoinGecko API), Döviz kurları (Frankfurter API), Altın/Gümüş (Metals.Live API) ve algoritmik BİST hisse senedi simülasyonları.
- **Yapay Zeka Destekli Tahminler:** Google Gemini 1.5 Flash entegrasyonu sayesinde 1 Hafta, 1 Ay, 3 Ay ve 6 Aylık vadelerde analitik yorumlar ve fiyat tahminleri.
- **Gelişmiş Teknik Göstergeler:** Fiyat grafikleri üzerinde RSI (Göreceli Güç Endeksi), Basit Hareketli Ortalamalar (SMA), Destek ve Direnç seviyelerinin matematiksel analizi.
- **Finansal Haber Entegrasyonu:** GNews API entegrasyonu ile ilgili varlığa ait en güncel haber başlıklarının toplanıp piyasa duyarlılık analizine dahil edilmesi.
- **Dinamik Portföy Sepeti:** Online alışveriş sepeti mantığıyla çalışan, anlık ekleme/çıkarma yapılabilen ve toplam kâr/zarar durumunu görselleştiren gelişmiş portföy paneli.

---

## 🛠️ Teknoloji Yığını (Tech Stack)

### **Frontend (Ön Yüz)**
- **Kütüphane:** React 19
- **Build Aracı:** Vite
- **Stil Yönetimi:** Tailwind CSS v4
- **Grafikler:** Recharts
- **Geliştirme Portu:** `http://localhost:5173`

### **Backend (Arka Yüz)**
- **Dil:** Python 3.10+
- **Web Framework:** FastAPI
- **Asenkron Sunucu:** Uvicorn
- **Yapay Zeka Entegrasyonu:** Google Generative AI (Gemini SDK)
- **HTTP İstemcisi:** HTTPX
- **Geliştirme Portu:** `http://localhost:8000`

---

## 📂 Proje Yapısı

```text
FinSight/
├── Frontend/               # React Kullanıcı Arayüzü
│   ├── src/
│   │   ├── app/            # Uygulama Bileşenleri & Sayfaları
│   │   │   ├── components/ # Yeniden kullanılabilir arayüz elemanları (UI, Grafik, Portföy)
│   │   │   ├── pages/      # Analiz ve Tahmin ana sayfaları
│   │   │   └── services/   # API İletişim Katmanı (api.ts)
│   │   └── data/           # Statik varlık listeleri
│   ├── package.json        # Paket bağımlılıkları
│   └── vite.config.ts      # Vite yapılandırması
│
└── Backend/                # FastAPI Servisi
    ├── main.py             # Uygulama giriş noktası ve CORS yapılandırması
    ├── requirements.txt    # Gerekli Python paketleri
    ├── .env                # API Anahtarları (Gizli)
    ├── routers/            # API Uç Noktaları (price, analysis, news, prediction)
    ├── services/           # API ve Yapay Zeka servis entegrasyonları
    ├── models/             # Pydantic Veri Modelleri
    └── utils/              # Teknik analiz matematiksel yardımcıları (technicals.py)
```

---

## ⚙️ Kurulum ve Başlatma

Uygulamayı yerelinizde çalıştırmak için iki ayrı terminal penceresi açmanız gerekmektedir.

### **1. Adım: Backend (Arka Yüz) Kurulumu**

1. Terminalde `Backend` klasörüne gidin:
   ```bash
   cd Backend
   ```
2. Gerekli Python kütüphanelerini yükleyin:
   ```bash
   pip install -r requirements.txt
   ```
3. `Backend` klasöründe yer alan `.env.example` dosyasını kopyalayarak `.env` adında yeni bir dosya oluşturun:
   ```env
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   GNEWS_API_KEY=YOUR_GNEWS_API_KEY_OPTIONAL
   ```
   *Not: Gemini API key'i [Google AI Studio](https://aistudio.google.com/) üzerinden ücretsiz alabilirsiniz.*
4. Backend sunucusunu başlatın:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```
   *Servis başladıktan sonra API dökümantasyonuna ve test arayüzüne `http://localhost:8000/docs` adresinden erişebilirsiniz.*

### **2. Adım: Frontend (Ön Yüz) Kurulumu**

1. Yeni bir terminal açıp `Frontend` klasörüne gidin:
   ```bash
   cd Frontend
   ```
2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. Uygulamayı başlatın:
   ```bash
   npm run dev
   ```
4. Tarayıcınızda `http://localhost:5173` adresine giderek uygulamayı kullanmaya başlayabilirsiniz.

---

## 💡 Önemli İpucu: Canlı Veri Modu

Varsayılan olarak Frontend, verileri yerel API istekleri yerine mock (taslak) verilerden çekebilir. Uygulamayı kendi başlattığınız yerel FastAPI sunucusu ile entegre çalıştırmak istiyorsanız:

1. [Frontend/src/app/services/api.ts](file:///c:/Users/asus/Downloads/FinSight/Frontend/src/app/services/api.ts) dosyasını açın.
2. Dosyanın en üstündeki `const MOCK = true;` satırını şu şekilde güncelleyin:
   ```typescript
   const MOCK = false;
   ```

---

## 🛠️ Hata Giderme

- **Port Çakışması (Port 5173 is already in use):** Aynı anda birden fazla React sunucusu çalışıyor olabilir. Terminalden `taskkill /F /IM node.exe` çalıştırarak Node işlemlerini sonlandırabilirsiniz.
- **Yapay Zeka API Hatası / Tahminlerin Sabit Kalması:** Eğer Gemini API anahtarınız hatalıysa veya limit aşımı yaşandıysa, uygulama çökmek yerine algoritmik yedek mekanizmayı (Fallback) devreye sokarak teknik analiz bazlı standart tahminleri göstermeye devam eder.
