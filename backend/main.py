from fastapi import FastAPI
from routes.interview import router as interview_router
from models.interview_model import load_models
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Verify Gemini API is configured on startup
try:
    load_models()
except Exception as e:
    print(f"⚠️ Warning: {e}")

# Allow our Frontend (localhost:3000) to talk to this Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interview_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "AI Interview Coach API is running with Gemini 2.5 Flash!"}