from fastapi import FastAPI
from routes.interview import router as interview_router

app = FastAPI()

# Include the router from routes/interview.py
# We prefix it with /api
app.include_router(interview_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "AI Interview Coach API is running!"}
