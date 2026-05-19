from pydantic import BaseModel
from typing import List, Optional, Dict

class PriceResponse(BaseModel):
    price: float
    change_24h: float
    high_24h: float
    low_24h: float
    symbol: str
    name: str

class NewsItem(BaseModel):
    title: str
    source: str
    published_at: str
    sentiment: str
    url: str

class AnalyzeRequest(BaseModel):
    asset: str
    category: str

class NewsSentiment(BaseModel):
    score: int
    label: str
    summary: str
    key_points: List[str]

class TechnicalAnalysis(BaseModel):
    rsi: float
    rsi_label: str
    trend: str
    ma7: float
    ma30: float
    support: float
    resistance: float
    key_points: List[str]

class Recommendation(BaseModel):
    action: str
    confidence: int
    reason: str
    disclaimer: str

class AnalysisResponse(BaseModel):
    news_sentiment: NewsSentiment
    technical: TechnicalAnalysis
    recommendation: Recommendation
    news: List[NewsItem]

class PredictRequest(BaseModel):
    asset: str
    asset_name: str
    category: str
    amount: float
    buy_price: float
    unit: Optional[str] = None

class PredictionPeriod(BaseModel):
    price: float
    change_percent: float
    profit_loss: float
    is_profit: bool

class PredictionChartPoint(BaseModel):
    label: str
    price: float

class PredictResponse(BaseModel):
    asset: str
    asset_name: str
    amount: float
    buy_price: float
    current_price: float
    total_cost: float
    current_value: float
    current_profit_loss: float
    predictions: Dict[str, PredictionPeriod]
    chart_data: List[PredictionChartPoint]
    analysis: str
    key_factors: List[str]
    risk_level: str
    disclaimer: str
