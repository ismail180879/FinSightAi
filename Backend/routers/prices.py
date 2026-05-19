from fastapi import APIRouter, HTTPException
from models.schemas import PriceResponse
from services import coingecko, gold, forex, stocks

router = APIRouter()

ALLOWED_ASSETS = [
    "bitcoin", "ethereum", "binancecoin", "solana", "ripple",
    "usd", "eur", "gbp", "gold", "silver",
    "thyao", "garan", "asels", "eregl", "bimas"
]

@router.get("/price/{asset}", response_model=PriceResponse)
async def get_price(asset: str):
    if asset not in ALLOWED_ASSETS:
        raise HTTPException(status_code=400, detail="Geçersiz varlık")
        
    try:
        if asset in ["bitcoin", "ethereum", "binancecoin", "solana", "ripple"]:
            return await coingecko.get_crypto_price(asset)
        elif asset in ["gold", "silver"]:
            return await gold.get_metal_price(asset)
        elif asset in ["usd", "eur", "gbp"]:
            return await forex.get_forex_rate(asset)
        elif asset in ["thyao", "garan", "asels", "eregl", "bimas"]:
            return await stocks.get_stock_price(asset)
        else:
            raise HTTPException(status_code=400, detail="Varlık servisi bulunamadı")
    except Exception as e:
        print(f"[Prices Router Error] {e}")
        # Return a safe fallback rather than 500
        return {
            "price": 100.0,
            "change_24h": 0.0,
            "high_24h": 105.0,
            "low_24h": 95.0,
            "symbol": "UNK",
            "name": "Bilinmeyen"
        }
