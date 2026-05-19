from fastapi import APIRouter, HTTPException
import asyncio
from models.schemas import PredictRequest, PredictResponse
from services import coingecko, gold, forex, stocks, gnews, gemini
from utils.technicals import analyze_technicals

router = APIRouter()

@router.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    asset = request.asset
    category = request.category
    
    try:
        # 1. Get Current Price & History
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
        close_prices = [point[1] for point in history_data] if history_data else [current_price]
        
        # 2. Get News & Technicals
        news_task = gnews.get_news_for_asset(asset)
        tech_task = asyncio.to_thread(analyze_technicals, close_prices)
        news_list, tech_data = await asyncio.gather(news_task, tech_task)
        
        # 3. Call Gemini
        pred_data = await gemini.predict_asset(
            asset_name=request.asset_name,
            category=request.category,
            current_price=current_price,
            buy_price=request.buy_price,
            amount=request.amount,
            unit=request.unit or "",
            price_history=close_prices,
            news_articles=news_list,
            technicals=tech_data
        )
        
        # 4. Build Response
        total_cost = request.amount * request.buy_price
        current_value = request.amount * current_price
        current_profit_loss = current_value - total_cost
        
        # Add is_profit to periods
        predictions = {}
        periods = ["1_hafta", "1_ay", "3_ay", "6_ay"]
        for p in periods:
            if p in pred_data:
                pd = pred_data[p]
                predictions[p] = {
                    "price": pd.get("price", current_price),
                    "change_percent": pd.get("change_percent", 0),
                    "profit_loss": pd.get("profit_loss", 0),
                    "is_profit": pd.get("profit_loss", 0) >= 0
                }
                
        # Build Chart Data
        chart_data = [
            {"label": "Şimdi", "price": current_price},
            {"label": "1 Hafta", "price": predictions.get("1_hafta", {}).get("price", current_price)},
            {"label": "1 Ay", "price": predictions.get("1_ay", {}).get("price", current_price)},
            {"label": "3 Ay", "price": predictions.get("3_ay", {}).get("price", current_price)},
            {"label": "6 Ay", "price": predictions.get("6_ay", {}).get("price", current_price)}
        ]

        return {
            "asset": request.asset,
            "asset_name": request.asset_name,
            "amount": request.amount,
            "buy_price": request.buy_price,
            "current_price": current_price,
            "total_cost": total_cost,
            "current_value": current_value,
            "current_profit_loss": current_profit_loss,
            "predictions": predictions,
            "chart_data": chart_data,
            "analysis": pred_data.get("analysis", ""),
            "key_factors": pred_data.get("key_factors", []),
            "risk_level": pred_data.get("risk_level", "ORTA"),
            "disclaimer": "Bu öneri yapay zeka tarafından oluşturulmuştur ve yatırım tavsiyesi değildir."
        }

    except Exception as e:
        print(f"[Prediction Router Error] {e}")
        raise HTTPException(status_code=500, detail="Tahmin oluşturulurken bir hata oluştu")
