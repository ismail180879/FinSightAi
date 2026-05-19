import httpx
from fastapi import HTTPException

# Add generic mapping from internal asset id to coingecko id
COINGECKO_MAP = {
    "bitcoin": "bitcoin",
    "ethereum": "ethereum",
    "binancecoin": "binancecoin",
    "solana": "solana",
    "ripple": "ripple"
}

# Add symbol mapping
SYMBOL_MAP = {
    "bitcoin": "BTC",
    "ethereum": "ETH",
    "binancecoin": "BNB",
    "solana": "SOL",
    "ripple": "XRP"
}

# Add name mapping
NAME_MAP = {
    "bitcoin": "Bitcoin",
    "ethereum": "Ethereum",
    "binancecoin": "BNB",
    "solana": "Solana",
    "ripple": "XRP"
}

async def get_crypto_price(coin_id: str) -> dict:
    cg_id = COINGECKO_MAP.get(coin_id, coin_id)
    url = "https://api.coingecko.com/api/v3/coins/markets"
    params = {
        "vs_currency": "usd",
        "ids": cg_id,
        "order": "market_cap_desc",
        "per_page": 1,
        "page": 1,
        "sparkline": "false"
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            if not data:
                raise HTTPException(status_code=404, detail="Coin bulunamadı")
            coin = data[0]
            return {
                "price": coin.get("current_price", 0),
                "change_24h": coin.get("price_change_percentage_24h", 0),
                "high_24h": coin.get("high_24h", 0),
                "low_24h": coin.get("low_24h", 0),
                "symbol": SYMBOL_MAP.get(coin_id, coin.get("symbol", "").upper()),
                "name": NAME_MAP.get(coin_id, coin.get("name", ""))
            }
    except Exception as e:
        print(f"[CoinGecko Error] get_crypto_price: {e}")
        # Fallback values
        return {
            "price": 0.0,
            "change_24h": 0.0,
            "high_24h": 0.0,
            "low_24h": 0.0,
            "symbol": SYMBOL_MAP.get(coin_id, "UNK"),
            "name": NAME_MAP.get(coin_id, "Unknown")
        }

async def get_price_history(coin_id: str, days: int = 30) -> list:
    cg_id = COINGECKO_MAP.get(coin_id, coin_id)
    url = f"https://api.coingecko.com/api/v3/coins/{cg_id}/market_chart"
    params = {
        "vs_currency": "usd",
        "days": days,
        "interval": "daily"
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            return data.get("prices", [])
    except Exception as e:
        print(f"[CoinGecko Error] get_price_history: {e}")
        return []
