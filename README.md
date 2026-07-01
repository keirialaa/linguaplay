# LinguaPlay

Turn any YouTube video into an interactive language class. Paste a link — LinguaPlay transcribes it, detects the language, and becomes your personal language tutor for that content.

## What it does

- **Transcribes** any public YouTube video using OpenAI Whisper, with segment-level timestamps
- **Analyses** the transcript for CEFR difficulty level, notable expressions and idioms, cultural notes, and key vocabulary
- **Answers questions** about the video content and language via a conversational AI agent
- **Explains** grammar, vocabulary, idioms, and slang in context — grounded in what was actually said in the video
- **Shows** the full timestamped transcript and extracted vocabulary in dedicated tabs

## Architecture

```
YouTube URL
    │
    ▼
yt-dlp          — audio extraction
    │
    ▼
OpenAI Whisper  — transcription with segment timestamps
    │
    ├──► Pinecone       — vector store (text-embedding-3-small, cosine similarity)
    │
    └──► GPT-4o-mini    — transcript analysis (CEFR, expressions, culture note, vocabulary)
                          structured output via Pydantic + with_structured_output()

User message
    │
    ▼
LangGraph agent (GPT-4o-mini)
    ├── search_transcript   — RAG over Pinecone
    └── explain_language    — context-grounded language explanation

FastAPI  ◄──►  React (Vite)
```

## Tech stack

| Layer         | Technology                                              |
| ------------- | ------------------------------------------------------- |
| Frontend      | React, Vite                                             |
| Backend       | FastAPI, Python                                         |
| AI agent      | LangChain, LangGraph (`create_agent` + `InMemorySaver`) |
| Transcription | OpenAI Whisper (`whisper-1`)                            |
| Embeddings    | OpenAI `text-embedding-3-small`                         |
| Vector store  | Pinecone (serverless, cosine similarity)                |
| LLM           | OpenAI GPT-4o-mini                                      |
| Audio         | yt-dlp + FFmpeg                                         |

## Getting started

### Prerequisites

- Python 3.11+
- Node.js 18+
- FFmpeg (`brew install ffmpeg` on Mac)
- Accounts and API keys for: [OpenAI](https://platform.openai.com), [Pinecone](https://www.pinecone.io)

### Backend

```bash
# Clone the repo
git clone https://github.com/keirialaa/language-learning-bot.git
cd language-learning-bot

# Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and fill in your API keys

# Start the API server
python3 -m uvicorn app.api:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Environment variables

| Variable               | Description                                                              |
| ---------------------- | ------------------------------------------------------------------------ |
| `OPENAI_API_KEY`       | OpenAI API key (Whisper + GPT-4o-mini)                                   |
| `PINECONE_API_KEY`     | Pinecone API key                                                         |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of allowed frontend origins (defaults to localhost) |

LangSmith tracing is optional — set `LANGCHAIN_API_KEY`, `LANGCHAIN_PROJECT`, and `LANGCHAIN_TRACING_V2=true` to enable it.

## Project structure

```
├── app/
│   └── api.py              # FastAPI routes (/videos, /chat)
├── core/
│   ├── pipeline.py         # Orchestrates the full processing pipeline
│   ├── audio_extraction.py # yt-dlp audio download
│   ├── transcription.py    # Whisper transcription
│   ├── chunking.py         # Transcript segmentation
│   ├── vector_store.py     # Pinecone upsert and search
│   ├── analysis.py         # Structured transcript analysis
│   ├── agent.py            # LangGraph agent and conversation memory
│   └── tools.py            # Agent tools (search, explain, quiz)
└── frontend/
    └── src/
        ├── App.jsx
        └── components/
            ├── EntryView.jsx
            ├── ProcessingView.jsx
            ├── ChatView.jsx
            ├── ContextPanel.jsx
            ├── TabPanel.jsx
            ├── Chat.jsx
            ├── Transcript.jsx
            └── Vocabulary.jsx
```

## Known limitations

- Session state is held in memory — restarting the server clears conversation history and requires reprocessing any video before chatting
- Designed for single-user local use; no authentication or multi-user persistence layer
- Video processing takes 30–90 seconds depending on video length (Whisper transcription is the bottleneck)

## Roadmap

- [ ] Quiz generation — backend tool implemented, frontend rendering in progress
- [ ] Voice input (speak questions instead of typing)
- [ ] Automated tests (pytest + Vitest)
- [ ] Deployment (Render + Vercel)
