from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.interview_model import generate_conversational_response, generate_final_feedback
import database as db
import uuid

router = APIRouter()

# Define the data shape we expect from Frontend
class AnswerRequest(BaseModel):
    answer: str
    step: int
    role: str = "Software Engineer"
    tone: str = "professional"
    session_id: str = None  # Frontend will send this after first question
    previous_question: str = None  # The question being answered

class StartInterviewRequest(BaseModel):
    role: str = "Software Engineer"
    tone: str = "professional"

@router.post("/start_interview")
async def start_interview(request: StartInterviewRequest):
    """
    Start a new interview session
    """
    session_id = str(uuid.uuid4())
    db.create_session(session_id, request.role, request.tone)
    
    # Get the first question
    result = generate_conversational_response(
        user_input="",
        step_count=0,
        role=request.role,
        tone=request.tone
    )
    
    result["session_id"] = session_id
    result["current_question"] = 0
    return result

@router.post("/process_answer")
async def process_answer(request: AnswerRequest):
    """
    Process answer and generate next question (no feedback yet)
    """
    if not request.session_id:
        raise HTTPException(status_code=400, detail="session_id is required")
    
    # Save the answer to database
    if request.previous_question and request.answer:
        db.save_answer(
            session_id=request.session_id,
            question_number=request.step,
            question=request.previous_question,
            answer=request.answer
        )
    
    # Get all previous Q&A for context
    previous_qa = db.get_session_answers(request.session_id)
    
    # Generate next question
    result = generate_conversational_response(
        user_input=request.answer,
        step_count=request.step + 1,
        role=request.role,
        tone=request.tone,
        previous_qa=previous_qa
    )
    
    result["session_id"] = request.session_id
    result["current_question"] = request.step + 1
    
    return result

@router.get("/get_feedback/{session_id}")
async def get_feedback(session_id: str):
    """
    Get final comprehensive feedback after all questions are answered
    """
    session_info = db.get_session_info(session_id)
    if not session_info:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Get all Q&A pairs
    all_qa = db.get_session_answers(session_id)
    
    if len(all_qa) < 5:
        raise HTTPException(status_code=400, detail="Interview not complete yet")
    
    # Generate comprehensive feedback
    feedback = generate_final_feedback(session_info["role"], all_qa)
    
    # Mark session as complete
    db.mark_session_complete(session_id)
    
    return {
        "session_id": session_id,
        "role": session_info["role"],
        "feedback": feedback,
        "answers": all_qa
    }