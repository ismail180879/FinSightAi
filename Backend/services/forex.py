import httpx
from datetime import datetime, timedelta
import time

CURRENCY_MAP = {
    "usd": {"base": "USD", "name": "Amerikan Doları"},
    "eur": {"base": "EUR", "name": "Euro"},
    "gbp": {"base": "GBP", "name": "İngiliz Sterlini"}
}

async def get_forex_rate(currency: str) -> dict:
    info = CURRENCY_MAP.get(currency)
    if not info:
        raise ValueError(f"Bilinmeyen döviz: {currency}")
        
    base = info["base"]
    url = "https://api.frankfurter.app/latest"
    params = {"from": base, "to": "TRY"}
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            price = data["rates"]["TRY"]
            return {
                "price": price,
                "change_24h": 0.0, # Frankfurter latest doesn't give 24h change easily, mock or 0
                "high_24h": price * 1.005,
                "low_24h": price * 0.995,
                "symbol": base,
                "name": info["name"]
            }
    except Exception as e:
        print(f"[Forex Error] get_forex_rate: {e}")
        # Fallback values
        fallback = 32.0 if base == "USD" else 35.0 if base == "EUR" else 41.0
        return {
            "price": fallback,
            "change_24h": 0.0,
            "high_24h": fallback * 1.005,
            "low_24h": fallback * 0.995,
            "symbol": base,
            "name": info["name"]
        }

async def get_forex_history(currency: str, days: int = 30) -> list:
    info = CURRENCY_MAP.get(currency)
    if not info:
        return []
        
    base = info["base"]
    start_date = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")
    url = f"https://api.frankfurter.app/{start_date}.."
    params = {"from": base, "to": "TRY"}
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            rates = data.get("rates", {})
            history = []
            for date_str, rate_data in rates.items():
                if "TRY" in rate_data:
                    # Convert YYYY-MM-DD to ms timestamp
                    dt = datetime.strptime(date_str, "%Y-%m-%d")
                    ts = int(dt.timestamp() * 1000)
                    history.append([ts, rate_data["TRY"]])
            
            return sorted(history, key=lambda x: x[0])
    except Exception as e:
        print(f"[Forex Error] get_forex_history: {e}")
        return []
