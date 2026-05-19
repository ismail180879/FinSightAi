import os
import json
import re
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

# Setup Groq safely. We'll init the client dynamically if the key is present.
def get_client():
    # Tırnaklar kapalı ve mantık düzeltildi
    api_key = "gsk_kmKrgbW46w2qXOfq605dWGdyb3FY3Sj1db3bIvs1nQHwoZtObxVpz"
    
    if not api_key:
        return None
    return Groq(api_key=api_key)
def clean_json_response(text: str) -> str:
    # Remove markdown code blocks if present
    text = re.sub(r'```json', '', text)
    text = re.sub(r'```', '', text)
    return text.strip()

# --- ANALYZE ENDPOINTS ---

async def analyze_news_sentiment(news_list: list) -> dict:
    client = get_client()
    if not client or not news_list:
        return {
            "score": 50,
            "label": "NÖTR",
            "summary": "Son haberlere göre piyasa beklentileri dengeli seyrediyor.",
            "key_points": ["Önemli bir haber akışı bulunmuyor", "Piyasa yatay seyrediyor"]
        }
        
    titles = [n["title"] for n in news_list]
    news_text = "\n".join(titles)
    
    prompt = f"""
    Aşağıdaki finansal haber başlıklarını analiz et ve JSON formatında bir duyarlılık (sentiment) analizi çıkar.
    Haberler:
    {news_text}
    
    Format:
    {{
      "score": <0-100 arası sayı, 0 çok olumsuz, 100 çok olumlu>,
      "label": <"POZİTİF" | "NEGATİF" | "NÖTR">,
      "summary": <kısa özet metin>,
      "key_points": [<önemli nokta 1>, <önemli nokta 2>]
    }}
    Sadece JSON çıktısı ver.
    """
    
    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-8b-8192", # Şimşek hızında çalışması için optimize edilmiş model
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        text = clean_json_response(response.choices[0].message.content)
        return json.loads(text)
    except Exception as e:
        print(f"[Groq Error] analyze_news_sentiment: {e}")
        return {
            "score": 50,
            "label": "NÖTR",
            "summary": "Yapay zeka analiz yapamadı, nötr olarak kabul ediliyor.",
            "key_points": ["Haberler analiz edilemedi"]
        }

async def generate_recommendation(asset: str, category: str, price: float, tech: dict, sentiment: dict) -> dict:
    client = get_client()
    if not client:
        return {
            "action": "BEKLE",
            "confidence": 50,
            "reason": "Yapay zeka modeli aktif değil.",
            "disclaimer": "Bu bir yatırım tavsiyesi değildir."
        }
        
    prompt = f"""
    {asset} ({category}) için al/sat/bekle önerisi üret.
    Fiyat: {price}
    Teknik Göstergeler: RSI={tech['rsi']} ({tech['rsi_label']}), Trend={tech['trend']}
    Destek={tech['support']}, Direnç={tech['resistance']}
    Haber Duyarlılığı: {sentiment['score']}/100 ({sentiment['label']})
    Haber Özeti: {sentiment['summary']}
    
    Format:
    {{
      "action": <"AL" | "SAT" | "BEKLE">,
      "confidence": <0-100 arası güven skoru>,
      "reason": <Neden bu öneriyi verdin? 1-2 cümle>,
      "disclaimer": "Bu öneri yapay zeka tarafından oluşturulmuştur ve yatırım tavsiyesi değildir."
    }}
    Sadece JSON çıktısı ver.
    """
    
    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-8b-8192",
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        text = clean_json_response(response.choices[0].message.content)
        return json.loads(text)
    except Exception as e:
        print(f"[Groq Error] generate_recommendation: {e}")
        return {
            "action": "BEKLE",
            "confidence": 50,
            "reason": "Yapay zeka yanıt veremedi.",
            "disclaimer": "Yatırım tavsiyesi değildir."
        }

# --- PREDICTION ENDPOINT ---

def get_fallback_prediction(current_price: float, amount: float, buy_price: float) -> dict:
    total_cost = amount * buy_price
    
    def mk_period(mult: float):
        p = current_price * mult
        cur_val = amount * p
        pl = cur_val - total_cost
        pct = ((p - buy_price) / buy_price) * 100 if buy_price > 0 else 0
        return {
            "price": round(p, 2),
            "change_percent": round(pct, 2),
            "profit_loss": round(pl, 2)
        }
        
    return {
        "1_hafta": mk_period(1.02),
        "1_ay": mk_period(1.05),
        "3_ay": mk_period(1.12),
        "6_ay": mk_period(1.20),
        "analysis": "Yapay zeka sunucusuna ulaşılamadı. Sabit trend bazlı tahmin gösteriliyor.",
        "key_factors": ["API anahtarı geçersiz", "Varsayılan algoritmik trend"],
        "risk_level": "ORTA"
    }

async def predict_asset(
    asset_name: str,
    category: str,
    current_price: float,
    buy_price: float,
    amount: float,
    unit: str,
    price_history: list[float],
    news_articles: list[dict],
    technicals: dict
) -> dict:
    
    client = get_client()
    if not client:
        print("[Groq] Using fallback prediction (no API key).")
        return get_fallback_prediction(current_price, amount, buy_price)
        
    total_cost = amount * buy_price
    change_pct = ((current_price - price_history[0]) / price_history[0]) * 100 if price_history and price_history[0] > 0 else 0
    news_summary = "\n".join([n["title"] for n in news_articles])
    
    prompt = f"""
Sen bir finansal tahmin analistisin.
Aşağıdaki verilere dayanarak {asset_name} için tahmin üret.

KATEGORİ: {category}
MEVCUT FİYAT: {current_price}
ALIŞ FİYATI: {buy_price}
MİKTAR: {amount} {unit}
TOPLAM MALİYET: {total_cost}

SON 30 GÜN FİYAT HAREKETİ:
Başlangıç: {price_history[0] if price_history else 0}
Bitiş: {price_history[-1] if price_history else 0}
Min: {min(price_history) if price_history else 0}
Max: {max(price_history) if price_history else 0}
Değişim: {change_pct}%

TEKNİK GÖSTERGELER:
RSI: {technicals['rsi']}
Trend: {technicals['trend']}
Destek: {technicals['support']}
Direnç: {technicals['resistance']}

SON HABERLER:
{news_summary}

SADECE şu JSON formatında yanıt ver (Tırnaklara ve virgillere dikkat et):
{{
    "1_hafta": {{
        "price": <tahmini fiyat>,
        "change_percent": <alış fiyatına göre değişim yüzdesi>,
        "profit_loss": <kar/zarar tutarı (miktara göre)>
    }},
    "1_ay": {{
        "price": <tahmini fiyat>,
        "change_percent": <alış fiyatına göre değişim yüzdesi>,
        "profit_loss": <kar/zarar tutarı (miktara göre)>
    }},
    "3_ay": {{
        "price": <tahmini fiyat>,
        "change_percent": <alış fiyatına göre değişim yüzdesi>,
        "profit_loss": <kar/zarar tutarı (miktara göre)>
    }},
    "6_ay": {{
        "price": <tahmini fiyat>,
        "change_percent": <alış fiyatına göre değişim yüzdesi>,
        "profit_loss": <kar/zarar tutarı (miktara göre)>
    }},
    "analysis": "<3-4 cümle genel analiz, Türkçe>",
    "key_factors": [
        "<etken 1>",
        "<etken 2>",
        "<etken 3>"
    ],
    "risk_level": "<DÜŞÜK, ORTA veya YÜKSEK>"
}}

Tahminler gerçekçi ve tutarlı olsun.
Değişim yüzdeleri mantıklı aralıklarda olsun (kripto için ±5-40%, döviz için ±2-15%, hisse için ±5-25%).
"""

    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-8b-8192",
            temperature=0.2,
            response_format={"type": "json_object"}
        )
        text = clean_json_response(response.choices[0].message.content)
        return json.loads(text)
    except Exception as e:
        print(f"[Groq Error] predict_asset: {e}")
        return get_fallback_prediction(current_price, amount, buy_price)