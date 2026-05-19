from fastapi import APIRouter, HTTPException
import asyncio
from models.schemas import AnalyzeRequest, AnalysisResponse
from services import coingecko, gold, forex, stocks, gnews, gemini
from utils.technicals import analyze_technicals

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_asset(request: AnalyzeRequest):
    asset = request.asset
    category = request.category
    
    try:
        # 1. Get Price
        if category == "kripto":
            price_data = await coingecko.get_crypto_price(asset)
            history_data = await coingecko.get_price_history(asset)
        elif category == "doviz":
            if asset in ["gold", "silver"]:
                price_data = await gold.get_metal_price(asset)
                history_data = await gold.get_gold_history()
            else:
                price_data = await forex.get_forex_rate(asset)
                history_data = await forex.get_forex_history(asset)
        elif category == "hisse":
            price_data = await stocks.get_stock_price(asset)
            history_data = await stocks.get_stock_history(asset)
        else:
            raise HTTPException(status_code=400, detail="Geçersiz kategori")

        current_price = price_data.get("price", 0)
        
        # 2. Process History
        close_prices = [point[1] for point in history_data] if history_data else [current_price]
        
        # 3. Get News & Technicals concurrently
        news_task = gnews.get_news_for_asset(asset)
        tech_task = asyncio.to_thread(analyze_technicals, close_prices)
        
        news_list, tech_data = await asyncio.gather(news_task, tech_task)
        
        # 4. Get Gemini Sentiment & Recommendations concurrently
        sentiment_task = gemini.analyze_news_sentiment(news_list)
        sentiment_data = await sentiment_task
        
        recommendation_data = await gemini.generate_recommendation(
            asset=asset,
            category=category,
            price=current_price,
            tech=tech_data,
            sentiment=sentiment_data
        )
        
        return {
            "news_sentiment": sentiment_data,
            "technical": tech_data,
            "recommendation": recommendation_data,
            "news": news_list
        }
        
    except Exception as e:
        print(f"[Analysis Router Error] {e}")
        # Safe fallback
        return {
            "news_sentiment": {
                "score": 50, "label": "NÖTR", "summary": "Hata oluştu", "key_points": []
            },
            "technical": {
                "rsi": 50, "rsi_label": "Normal", "trend": "Yatay", "ma7": 0, "ma30": 0, "support": 0, "resistance": 0, "key_points": []
            },
            "recommendation": {
                "action": "BEKLE", "confidence": 0, "reason": "Servis hatası", "disclaimer": ""
            },
            "news": []
        }
