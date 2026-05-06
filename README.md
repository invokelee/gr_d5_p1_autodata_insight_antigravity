# 📊 AutoData Insight (자동화된 데이터 분석 AI 에이전트)

사용자가 업로드한 CSV 데이터의 구조를 스스로 파악하고, 비즈니스 관점에서 유의미한 시각화와 AI 인사이트를 자동 생성하는 지능형 대시보드 애플리케이션입니다.

## 🚀 주요 기능 (Features)

1. **지능형 프로파일링 (Automated EDA)**
   - CSV 파일을 업로드하면 Python(Pandas) 백엔드 엔진이 데이터 타입, 결측치, 기초 통계량 및 변수 간 상관관계를 자동으로 분석합니다.
2. **동적 시각화 엔진 (Dynamic Visualization)**
   - 데이터 특성에 맞추어 `Recharts`를 활용해 자동으로 최적의 차트(히스토그램, 파이 차트, 바 차트 등)를 선택해 렌더링합니다.
3. **AI 인사이트 에이전트 (Generative AI)**
   - 최신 **Gemini 2.5 Flash** 모델을 연동하여, EDA 결과물로부터 데이터의 핵심 특징, 주목할 이상치, 데이터 기반 추천 액션 플랜을 도출합니다.

## 🛠️ 기술 스택 (Tech Stack)

### Frontend
- **Framework**: React 18+, Vite 8
- **Styling**: Tailwind CSS v4, Lucide React
- **Visualization & Utility**: Recharts, react-dropzone, Axios

### Backend
- **Framework**: FastAPI (Vercel Serverless Functions 지원)
- **Data Processing**: Pandas, NumPy
- **AI Integration**: `google-generativeai` (Gemini API)

---

## 💻 로컬 환경 실행 방법 (Local Setup)

### 1. 환경 변수 설정
프로젝트 루트(`autodata-insight`)에 `.env` 파일을 생성하고 아래와 같이 Gemini API 키를 입력합니다.
```env
GEMINI_API_KEY="본인의_API_키"
```

### 2. 패키지 설치
```bash
# Frontend 의존성 설치
npm install

# Backend 의존성 설치
pip3 install -r api/requirements.txt
```

### 3. 서버 실행
백엔드(FastAPI)와 프론트엔드(Vite)를 동시에 실행합니다. 프론트엔드 라우팅 프록시가 설정되어 있어, `/api` 요청은 자동으로 백엔드로 전달됩니다.

```bash
# 터미널 1: 백엔드 실행
python3 -m uvicorn api.index:app --port 8000 --reload

# 터미널 2: 프론트엔드 실행
npm run dev -- --port 8872
```
브라우저에서 `http://localhost:8872` 에 접속하여 사용합니다.

---

## 🌍 Vercel 배포 가이드 (Deployment)

이 프로젝트는 단일 레포지토리(Monorepo) 구조로 되어 있으며, **Vercel의 Zero-Config 빌드**와 **Serverless Functions** 기능을 활용하여 아주 쉽게 배포할 수 있습니다.

### 상세 배포 절차 (GitHub 연동 방식)

1. **GitHub 업로드**
   - 현재 작성된 전체 프로젝트 코드(`package.json`, `vercel.json`, `api/`, `src/` 등)를 본인의 GitHub 레포지토리에 푸시(Push)합니다.
   
2. **Vercel 프로젝트 생성**
   - [Vercel 대시보드](https://vercel.com/dashboard)에 로그인합니다.
   - 우측 상단의 **[Add New...] -> [Project]** 버튼을 클릭합니다.
   - 방금 코드를 올린 GitHub 레포지토리를 찾아 **[Import]** 버튼을 누릅니다.

3. **환경 변수 및 설정 확인 (중요 ⭐️)**
   - **Framework Preset**: Vercel이 알아서 `Vite`로 인식하므로 기본값을 유지합니다.
   - **Environment Variables (환경 변수)** 탭을 엽니다.
   - **Name**칸에 `GEMINI_API_KEY`를, **Value**칸에 발급받은 실제 API 키 값을 붙여넣고 **[Add]** 버튼을 클릭합니다.

4. **배포 진행**
   - 모든 설정이 완료되면 화면 맨 아래의 **[Deploy]** 버튼을 누릅니다.
   - 사전에 작성된 `vercel.json` 파일의 라우팅 설정(`rewrites`)을 통해, Vercel이 자동으로:
     - `src/` 코드는 정적 웹사이트(Vite)로 빌드합니다.
     - `api/index.py` 코드는 Python 서버리스 함수(Serverless Function)로 배포합니다.

5. **접속 및 확인**
   - 배포가 완료(Ready)되면 제공되는 URL로 접속하여 실서비스를 확인합니다!

> **참고**: `vercel.json`에 구버전 플러그인(`builds` 옵션)을 사용할 경우 빌드 에러가 발생합니다. 현재 포함된 `vercel.json`은 최신 Vercel Zero-Config 환경에 맞추어 `rewrites` 라우팅만 명시된 안전한 파일입니다.
