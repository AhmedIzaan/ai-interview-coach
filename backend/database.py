import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Optional

DB_PATH = "interviews.db"

def init_db():
    """Initialize the database with required tables"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create sessions table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS interview_sessions (
            session_id TEXT PRIMARY KEY,
            role TEXT NOT NULL,
            tone TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed BOOLEAN DEFAULT 0
        )
    """)
    
    # Create answers table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS interview_answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            question_number INTEGER NOT NULL,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES interview_sessions (session_id)
        )
    """)
    
    conn.commit()
    conn.close()

def create_session(session_id: str, role: str, tone: str):
    """Create a new interview session"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO interview_sessions (session_id, role, tone) VALUES (?, ?, ?)",
        (session_id, role, tone)
    )
    conn.commit()
    conn.close()

def save_answer(session_id: str, question_number: int, question: str, answer: str):
    """Save an answer to the database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO interview_answers (session_id, question_number, question, answer) VALUES (?, ?, ?, ?)",
        (session_id, question_number, question, answer)
    )
    conn.commit()
    conn.close()

def get_session_answers(session_id: str) -> List[Dict]:
    """Get all answers for a session"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT question_number, question, answer FROM interview_answers WHERE session_id = ? ORDER BY question_number",
        (session_id,)
    )
    rows = cursor.fetchall()
    conn.close()
    
    return [
        {"question_number": row[0], "question": row[1], "answer": row[2]}
        for row in rows
    ]

def mark_session_complete(session_id: str):
    """Mark a session as completed"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE interview_sessions SET completed = 1 WHERE session_id = ?",
        (session_id,)
    )
    conn.commit()
    conn.close()

def get_session_info(session_id: str) -> Optional[Dict]:
    """Get session information"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT role, tone, completed FROM interview_sessions WHERE session_id = ?",
        (session_id,)
    )
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return {"role": row[0], "tone": row[1], "completed": row[2]}
    return None

# Initialize database on import
init_db()
