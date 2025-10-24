from fastapi import APIRouter

router = APIRouter()

# This will be our /api/get_question route later
@router.get("/hello")
async def get_hello():
    return {"message": "This is the interview router!"}
