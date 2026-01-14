# 🚀 Quick Start Guide - AI Interview Coach Backend

## What Changed?

Your backend now uses **Gemini 1.5 Flash API** with a simplified "mega-prompt" approach:
- ✅ **Simpler code** - One function call does everything
- ✅ **Better responses** - Gemini generates contextual feedback and questions
- ✅ **Faster** - No heavy model loading on startup  
- ✅ **Cost-effective** - Free tier with 15 requests/min

## Setup Steps

### 1. Get Your Gemini API Key
Visit: https://aistudio.google.com/app/apikey
- Sign in with Google
- Click "Create API Key"
- Copy the key (starts with `AIza...`)

### 2. Configure Environment
```bash
cd backend
cp .env.example .env
```

Edit `.env` and add your key:
```
GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

This now installs only 5 lightweight packages (no more PyTorch/CUDA!)

### 4. Start the Server
```bash
uvicorn main:app --reload
```

You should see:
```
✅ Gemini API ready!
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### 5. Test It
Visit: http://localhost:8000

You should see:
```json
{"message": "AI Interview Coach API is running with Gemini!"}
```

## What's Different?

### Before (Local Models)
- Heavy dependencies (~4GB PyTorch + models)
- Long startup time (~1-2 minutes)
- Separate sentiment analysis function
- Predefined question templates

### After (Gemini API)
- Lightweight (~10MB total)
- Instant startup (~1 second)
- Everything in one API call
- Dynamic, contextual questions

## API Usage

**Endpoint:** `POST /api/process_answer`

**Request:**
```json
{
  "answer": "I have 5 years of experience in Python...",
  "step": 1,
  "role": "Software Engineer",
  "tone": "professional"
}
```

**Response:**
```json
{
  "feedback": "Great experience! Your background shows solid expertise.",
  "sentiment": {
    "label": "POSITIVE",
    "score": 0.89
  },
  "next_question": "Can you describe a challenging technical problem you solved recently?"
}
```

## Troubleshooting

**Error: "GEMINI_API_KEY not found"**
- Make sure `.env` file exists in the `backend/` folder
- Check that `GEMINI_API_KEY` is set correctly (no quotes needed)

**Error: "Import google.generativeai could not be resolved"**
- Run: `pip install -r requirements.txt`

**API returns fallback responses**
- Check your API key is valid
- Verify you haven't exceeded free tier limits (15 req/min)

## Next Steps

1. Test with your frontend
2. Try different roles and tones
3. Monitor API usage at: https://aistudio.google.com/

Enjoy your AI Interview Coach! 🎉
