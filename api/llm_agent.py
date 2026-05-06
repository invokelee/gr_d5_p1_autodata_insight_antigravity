import google.generativeai as genai
import os
import json

def generate_insights(eda_summary: dict) -> dict:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return {
            "features": ["GEMINI_API_KEY가 설정되지 않아 AI 인사이트를 생성할 수 없습니다.", "서버 환경 변수를 확인해 주세요."],
            "outliers": ["N/A"],
            "action_plan": ["Vercel 또는 로컬 `.env` 파일에 GEMINI_API_KEY를 추가하세요."]
        }
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    # We strip down the eda_summary to avoid huge payload size
    light_summary = {
        "dataset_info": eda_summary["dataset_info"],
        "missing_values": eda_summary["missing_values"],
        "columns": eda_summary["columns"],
        "preview": eda_summary["preview"]
    }
    
    prompt = f"""
다음은 사용자가 업로드한 데이터셋의 요약 정보(EDA 결과)입니다:
{json.dumps(light_summary, ensure_ascii=False, indent=2)}

이 데이터를 비즈니스 또는 분석적 관점에서 해석해 주세요. 결과는 반드시 아래 JSON 구조로만 반환해야 하며, 마크다운 코드블록 없이 순수 JSON 문자열만 출력하세요.

{{
  "features": [
    "데이터의 핵심 특징 1",
    "데이터의 핵심 특징 2",
    "데이터의 핵심 특징 3"
  ],
  "outliers": [
    "주목해야 할 이상치나 결측치 특징 1",
    "주목해야 할 특징 2"
  ],
  "action_plan": [
    "데이터 기반 추천 액션 플랜 1",
    "데이터 기반 추천 액션 플랜 2"
  ]
}}
"""
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Clean markdown if model returned it despite instructions
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        
        return json.loads(text)
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return {
            "features": ["AI 분석 중 오류가 발생했습니다.", str(e)],
            "outliers": ["N/A"],
            "action_plan": ["N/A"]
        }
