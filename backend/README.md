# AI Interview Coach - Backend

This backend uses **Google's Gemini 2.5 Flash API** for intelligent interview question generation, sentiment analysis, and feedback - all in one powerful API call.

## 🚀 Key Features

- **Single API Call**: Gemini handles everything - sentiment analysis, feedback generation, and next question creation
- **Context-Aware**: Questions adapt based on candidate responses
- **Multiple Roles**: Software Engineer, Data Scientist, Product Manager, DevOps, and more
- **Flexible Tones**: Professional, friendly, casual, or strict interviewer personas
- **Cost-Effective**: Uses Gemini 1.5 Flash (free tier available)

## Setup Instructions

### 1. Get Your Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 2. Configure Environment Variables
1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and replace `your_gemini_api_key_here` with your actual API key:
   ```
   GEMINI_API_KEY=AIzaSy...your_actual_key_here
   ```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Server
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### `GET /`
Health check endpoint

### `POST /api/process_answer`
Process user's answer and generate next interview question

**Request Body:**
```json
{
  "answer": "User's response to previous question",
  "step": 0,
  "role": "Software Engineer",
  "tone": "professional"
}
```

**Response:**
```json
{
  "feedback": "Feedback on the answer",
  "next_question": "Next interview question",
  "sentiment": {
    "label": "POSITIVE",
    "score": 0.85
  }
}
```

## Features

- 🤖 **AI-Powered Questions**: Uses Gemini 2.0 Flash for natural, contextual interview questions
- 😊 **Sentiment Analysis**: Analyzes candidate responses for tone and sentiment
- 💼 **Multiple Roles**: Supports various job roles (Software Engineer, Data Scientist, etc.)
- 🎭 **Different Tones**: Professional, friendly, casual, or strict interviewer personas
- 💬 **Conversation History**: Maintains context throughout the interview session

## Model Information

- **Model**: Gemini 2.5 Flash
- **Provider**: Google AI
- **API**: REST API (direct HTTP calls)
- **Cost**: Free tier available (15 requests per minute)
- **Speed**: Very fast response times (~1-2 seconds)
- **Approach**: Single "mega-prompt" that handles sentiment analysis, feedback, and question generation simultaneously
