from fastapi import APIRouter
from pydantic import BaseModel
import uuid

router = APIRouter()

# In-memory storage for alerts
ALERTS = []

class AlertRequest(BaseModel):
    category: str
    asset: str
    type: str
    targetPrice: float = None
    email: str

@router.post("/alerts")
async def create_alert(request: AlertRequest):
    new_alert = {
        "id": str(uuid.uuid4()),
        **request.model_dump(),
        "status": "active"
    }
    ALERTS.append(new_alert)
    return {"message": "Alarm başarıyla kuruldu", "alert": new_alert}

@router.get("/alerts")
async def get_alerts():
    return ALERTS

@router.delete("/alerts/{alert_id}")
async def delete_alert(alert_id: str):
    global ALERTS
    ALERTS = [a for a in ALERTS if a["id"] != alert_id]
    return {"message": "Alarm silindi"}
