from fastapi import APIRouter
from typing import List
from models.schemas import NewsItem
from services.gnews import get_news_for_asset

router = APIRouter()

@router.get("/news/{asset}", response_model=List[NewsItem])
async def get_news(asset: str):
    try:
        news = await get_news_for_asset(asset)
        return news
    except Exception as e:
        print(f"[News Router Error] {e}")
        return []
