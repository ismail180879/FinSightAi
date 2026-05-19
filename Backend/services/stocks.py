import time
import random

STOCK_DATA = {
    "thyao": { "name": "Türk Hava Yolları", "symbol": "THYAO", "base_price": 285.40 },
    "garan": { "name": "Garanti BBVA", "symbol": "GARAN", "base_price": 112.80 },
    "asels": { "name": "Aselsan", "symbol": "ASELS", "base_price": 68.50 },
    "eregl": { "name": "Ereğli Demir Çelik", "symbol": "EREGL", "base_price": 45.20 },
    "bimas": { "name": "BİM Mağazaları", "symbol": "BIMAS", "base_price": 498.60 }
}

async def get_stock_price(stock_id: str) -> dict:
    stock = STOCK_DATA.get(stock_id)
    if not stock:
        raise ValueError(f"Bilinmeyen hisse: {stock_id}")
        
    base = stock["base_price"]
    # Add random variation for realism
    current_price = base * (1 + random.uniform(-0.02, 0.02))
    change = random.uniform(-3.0, 3.0)
    
    return {
        "price": round(current_price, 2),
        "change_24h": round(change, 2),
        "high_24h": round(current_price * 1.02, 2),
        "low_24h": round(current_price * 0.98, 2),
        "symbol": stock["symbol"],
        "name": stock["name"]
    }

async def get_stock_history(stock_id: str, days: int = 30) -> list:
    stock = STOCK_DATA.get(stock_id)
    if not stock:
        return []
        
    base = stock["base_price"]
    history = []
    now_ms = int(time.time() * 1000)
    day_ms = 24 * 60 * 60 * 1000
    
    price = base
    # Generate backward
    for i in range(days, 0, -1):
        timestamp = now_ms - (i * day_ms)
        price = price * (1 + random.uniform(-0.02, 0.02))
        history.append([timestamp, round(price, 2)])
        
    return history
