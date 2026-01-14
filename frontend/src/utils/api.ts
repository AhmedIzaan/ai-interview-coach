// src/utils/api.ts

const API_URL = "http://127.0.0.1:8000/api";

export interface QuestionResponse {
    next_question: string;
    is_complete: boolean;
    total_questions: number;
    session_id: string;
    current_question: number;
}

export interface FinalFeedback {
    overall_score: number;
    sentiment: string;
    strengths: string[];
    improvements: string[];
    detailed_feedback: string;
    final_verdict: string;
}

export interface FeedbackResponse {
    session_id: string;
    role: string;
    feedback: FinalFeedback;
    answers: Array<{
        question_number: number;
        question: string;
        answer: string;
    }>;
}

export async function startInterview(role: string = "Software Engineer", tone: string = "professional"): Promise<QuestionResponse> {
    try {
        const response = await fetch(`${API_URL}/start_interview`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ role, tone }),
        });

        if (!response.ok) {
            throw new Error("Failed to start interview");
        }

        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

export async function submitAnswer(
    answer: string,
    step: number,
    role: string,
    tone: string,
    sessionId: string,
    previousQuestion: string
): Promise<QuestionResponse> {
    try {
        const response = await fetch(`${API_URL}/process_answer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                answer,
                step,
                role,
                tone,
                session_id: sessionId,
                previous_question: previousQuestion,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to submit answer");
        }

        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

export async function getFinalFeedback(sessionId: string): Promise<FeedbackResponse> {
    try {
        const response = await fetch(`${API_URL}/get_feedback/${sessionId}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Failed to get feedback");
        }

        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}