import os
import json
import requests
from dotenv import load_dotenv

# Setup
load_dotenv()  # Load environment variables

# Gemini API configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"

def load_models():
    """
    Verify Gemini API is configured.
    This function is kept for compatibility with main.py.
    """
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY environment variable is not set. Please add it to your .env file.")
    print("✅ Gemini 2.5 Flash API ready!")

MAX_QUESTIONS = 5  # Testing with 5 questions

def generate_conversational_response(user_input: str, step_count: int, role: str = "Software Engineer", tone: str = "professional", previous_qa: list = None) -> dict:
    """
    Generates interactive interview questions without feedback.
    Feedback is only given at the end after all questions.
    """
    
    # Handle the very first start (no user input yet)
    if step_count == 0:
        return {
            "next_question": f"Welcome! I'm excited to interview you for the {role} position. Let's get started! To begin, could you tell me a little about yourself and why you're interested in this {role} role?",
            "is_complete": False,
            "total_questions": MAX_QUESTIONS
        }

    # Build conversation context for more natural flow
    conversation_context = ""
    if previous_qa:
        conversation_context = "\n".join([
            f"Q{qa['question_number']}: {qa['question']}\nA{qa['question_number']}: {qa['answer']}"
            for qa in previous_qa[-2:]  # Last 2 Q&A pairs for context
        ])

    # The "Interactive Question Generator Prompt"
    prompt = f"""
    You are a {tone} interviewer for a '{role}' position. You're having a natural, engaging conversation with a candidate.
    
    This is question #{step_count} out of {MAX_QUESTIONS} questions.
    
    Previous conversation:
    {conversation_context}
    
    Candidate's last answer: "{user_input}"
    
    TASK:
    Generate the NEXT interview question that:
    1. Acknowledges their answer naturally (use transitions like "I see", "Interesting", "That's great", etc.)
    2. Flows naturally from their response or explores a new relevant area
    3. Is conversational and {tone} in tone
    4. Is specific to {role} role
    5. Encourages detailed responses
    
    OUTPUT FORMAT:
    Return ONLY a raw JSON object:
    {{
      "next_question": "your full question with natural acknowledgment"
    }}
    """

    try:
        # Call Gemini REST API
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }]
        }
        
        response = requests.post(API_URL, json=payload, timeout=30)
        response.raise_for_status()
        
        # Extract text from response
        result = response.json()
        generated_text = result['candidates'][0]['content']['parts'][0]['text']
        
        # Clean and Parse JSON
        clean_text = generated_text.replace("```json", "").replace("```", "").strip()
        data = json.loads(clean_text)
        
        # Add completion status
        data["is_complete"] = step_count >= MAX_QUESTIONS
        data["total_questions"] = MAX_QUESTIONS
        
        return data

    except Exception as e:
        print(f"Gemini API Error: {e}")
        # Fallback in case of error
        return {
            "next_question": "Could you tell me more about that?",
            "is_complete": step_count >= MAX_QUESTIONS,
            "total_questions": MAX_QUESTIONS
        }

def generate_final_feedback(role: str, all_qa_pairs: list) -> dict:
    """
    Generates comprehensive feedback after all questions are answered.
    Analyzes all answers together to provide meaningful insights.
    """
    
    # Build the complete interview transcript
    transcript = "\n\n".join([
        f"Question {qa['question_number']}: {qa['question']}\nAnswer: {qa['answer']}"
        for qa in all_qa_pairs
    ])
    
    prompt = f"""
    You are an expert interview coach. A candidate just completed a {role} interview.
    
    Complete Interview Transcript:
    {transcript}
    
    TASK:
    Provide comprehensive, actionable feedback on their interview performance.
    
    Analyze:
    1. Overall communication clarity and confidence
    2. Technical depth and accuracy (if applicable)
    3. Specific strengths demonstrated
    4. Areas for improvement with concrete suggestions
    5. Overall sentiment/impression (POSITIVE, NEUTRAL, or NEGATIVE)
    
    OUTPUT FORMAT (JSON):
    {{
      "overall_score": 0.0 to 10.0,
      "sentiment": "POSITIVE" or "NEUTRAL" or "NEGATIVE",
      "strengths": ["strength 1", "strength 2", "strength 3"],
      "improvements": ["improvement 1", "improvement 2"],
      "detailed_feedback": "2-3 paragraph detailed analysis",
      "final_verdict": "One sentence overall assessment"
    }}
    """
    
    try:
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }]
        }
        
        response = requests.post(API_URL, json=payload, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        generated_text = result['candidates'][0]['content']['parts'][0]['text']
        
        clean_text = generated_text.replace("```json", "").replace("```", "").strip()
        feedback_data = json.loads(clean_text)
        
        return feedback_data
        
    except Exception as e:
        print(f"Feedback generation error: {e}")
        return {
            "overall_score": 7.0,
            "sentiment": "POSITIVE",
            "strengths": ["Completed all questions", "Showed engagement"],
            "improvements": ["Could not generate detailed feedback"],
            "detailed_feedback": "Thank you for completing the interview. Your responses showed good engagement.",
            "final_verdict": "Overall solid performance."
        }