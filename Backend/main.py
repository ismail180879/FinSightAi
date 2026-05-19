from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os

load_dotenv()

from routers import prices, news, analysis, prediction, alerts

app = FastAPI(title="FinSight AI Backend", version="2.0")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"Validation error: {exc.errors()}")
    print(f"Request body: {await request.body()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": str(await request.body())},
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173", # Vite default port for the frontend we just built
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prices.router, prefix="/api", tags=["Prices"])
app.include_router(news.router, prefix="/api", tags=["News"])
app.include_router(analysis.router, prefix="/api", tags=["Analysis"])
app.include_router(prediction.router, prefix="/api", tags=["Prediction"])
app.include_router(alerts.router, prefix="/api", tags=["Alerts"])

@app.get("/")
def root():
    return {"status": "ok", "version": "2.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
