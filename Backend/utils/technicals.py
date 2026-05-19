import numpy as np

def calculate_rsi(prices, period=14):
    if len(prices) < period + 1:
        return 50.0
    
    deltas = np.diff(prices)
    seed = deltas[:period]
    up = seed[seed >= 0].sum() / period
    down = -seed[seed < 0].sum() / period
    if down == 0:
        return 100.0
    rs = up / down
    rsi = 100.0 - (100.0 / (1.0 + rs))
    
    for i in range(period, len(prices)-1):
        delta = deltas[i]
        if delta > 0:
            upval = delta
            downval = 0.
        else:
            upval = 0.
            downval = -delta
        up = (up*(period-1) + upval)/period
        down = (down*(period-1) + downval)/period
        rs = up/down
        rsi = 100.0 - (100.0/(1.0+rs))
        
    return round(rsi, 2)

def analyze_technicals(prices: list[float]) -> dict:
    if not prices or len(prices) < 2:
        return {
            "rsi": 50.0,
            "rsi_label": "Normal Bölge",
            "trend": "Nötr",
            "ma7": prices[-1] if prices else 0,
            "ma30": prices[-1] if prices else 0,
            "support": 0,
            "resistance": 0,
            "key_points": ["Yetersiz veri"]
        }
        
    current_price = prices[-1]
    
    # RSIs
    rsi = calculate_rsi(prices)
    if rsi >= 70:
        rsi_label = "Aşırı Alım"
    elif rsi <= 30:
        rsi_label = "Aşırı Satım"
    else:
        rsi_label = "Normal Bölge"
        
    # Moving Averages
    ma7 = sum(prices[-7:]) / len(prices[-7:]) if len(prices) >= 7 else sum(prices)/len(prices)
    ma30 = sum(prices[-30:]) / len(prices[-30:]) if len(prices) >= 30 else sum(prices)/len(prices)
    
    # Trend
    if current_price > ma7 and ma7 > ma30:
        trend = "Güçlü Yükseliş"
    elif current_price > ma7:
        trend = "Yükseliş"
    elif current_price < ma7 and ma7 < ma30:
        trend = "Güçlü Düşüş"
    elif current_price < ma7:
        trend = "Düşüş"
    else:
        trend = "Yatay"
        
    # Support/Resistance based on recent min/max
    support = min(prices[-14:]) if len(prices) >= 14 else min(prices)
    resistance = max(prices[-14:]) if len(prices) >= 14 else max(prices)
    
    # Key points
    key_points = []
    if current_price > resistance * 0.98:
        key_points.append("Fiyat direnç seviyesine çok yakın.")
    if current_price < support * 1.02:
        key_points.append("Fiyat destek seviyesine çok yakın.")
    if rsi >= 70:
        key_points.append("RSI aşırı alım bölgesinde, düzeltme gelebilir.")
    if rsi <= 30:
        key_points.append("RSI aşırı satım bölgesinde, tepki alımları gelebilir.")
    if not key_points:
        key_points.append("Fiyat teknik göstergeler bazında stabil seyrediyor.")
        
    return {
        "rsi": float(rsi),
        "rsi_label": rsi_label,
        "trend": trend,
        "ma7": float(ma7),
        "ma30": float(ma30),
        "support": float(support),
        "resistance": float(resistance),
        "key_points": key_points
    }
