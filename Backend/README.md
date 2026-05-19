# FinSight AI Backend v2

## Kurulum
pip install -r requirements.txt
cp .env.example .env
# .env dosyasını doldur

## API Keys
- Gemini: https://aistudio.google.com (ücretsiz)
- GNews: https://gnews.io (ücretsiz, opsiyonel)

## Çalıştır
uvicorn main:app --reload --port 8000

## Swagger Test
http://localhost:8000/docs

## Endpoint Listesi
GET  /api/price/{asset}
GET  /api/news/{asset}
POST /api/analyze
POST /api/predict
POST /api/alerts
GET  /api/alerts
DELETE /api/alerts/{id}
