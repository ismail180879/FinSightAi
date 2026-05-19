import os
import httpx
from datetime import datetime

QUERY_MAP = {
    "bitcoin": "Bitcoin kripto para",
    "ethereum": "Ethereum kripto",
    "binancecoin": "BNB Binance kripto",
    "solana": "Solana SOL kripto",
    "ripple": "XRP Ripple kripto",
    "usd": "dolar TRY kur",
    "eur": "euro TRY kur",
    "gbp": "sterlin TRY kur",
    "gold": "altın gram fiyat",
    "silver": "gümüş fiyat",
    "thyao": "Türk Hava Yolları THYAO borsa",
    "garan": "Garanti Bankası GARAN hisse",
    "asels": "Aselsan ASELS borsa",
    "eregl": "Ereğli Demir EREGL hisse",
    "bimas": "BİM BIMAS borsa"
}

def get_mock_news(asset_id: str):
    query = QUERY_MAP.get(asset_id, asset_id)
    return [
        {
            "title": f"{query.split()[0]} piyasalarında son durum",
            "source": "Finans Haber",
            "published_at": datetime.now().isoformat() + "Z",
            "sentiment": "neutral",
            "url": "#"
        },
        {
            "title": f"{query.split()[0]} için analist yorumları",
            "source": "Borsa Uzmanı",
            "published_at": datetime.now().isoformat() + "Z",
            "sentiment": "positive",
            "url": "#"
        },
        {
            "title": f"Yatırımcıların {query.split()[0]} beklentisi artıyor",
            "source": "Ekonomi 7/24",
            "published_at": datetime.now().isoformat() + "Z",
            "sentiment": "positive",
            "url": "#"
        }
    ]

async def get_news_for_asset(asset_id: str) -> list:
    api_key = os.getenv("GNEWS_API_KEY")
    if not api_key or api_key == "your_gnews_api_key_here":
        return get_mock_news(asset_id)
        
    query = QUERY_MAP.get(asset_id, asset_id)
    url = "https://gnews.io/api/v4/search"
    params = {
        "q": query,
        "lang": "tr",
        "max": 5,
        "apikey": api_key,
        "sortby": "publishedAt"
    }
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            articles = []
            for art in data.get("articles", []):
                articles.append({
                    "title": art["title"],
                    "source": art["source"]["name"],
                    "published_at": art["publishedAt"],
                    "sentiment": "neutral",  # Will be enriched by Gemini later if needed
                    "url": art["url"]
                })
            return articles if articles else get_mock_news(asset_id)
            
    except Exception as e:
        print(f"[GNews Error] {e}")
        return get_mock_news(asset_id)
