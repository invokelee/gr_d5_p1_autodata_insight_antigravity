from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any
from .eda_engine import analyze_csv
from .llm_agent import generate_insights
import io
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="AutoData Insight API")

# Allow CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/analyze")
async def analyze_data(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    try:
        contents = await file.read()
        csv_text = contents.decode('utf-8')
        
        # 1. Automated EDA with Pandas
        eda_results = analyze_csv(csv_text)
        
        # 2. Generate Insights with Gemini
        insights = generate_insights(eda_results)
        
        return {
            "eda": eda_results,
            "insights": insights
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
