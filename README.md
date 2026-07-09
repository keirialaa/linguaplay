# LinguaPlay

Turn any YouTube video into an interactive language class. Paste a link — LinguaPlay transcribes it, detects the language, and becomes your personal language tutor for that content.

<img width="1583" height="972" alt="Screenshot 2026-07-01 at 20 22 04" src="https://github.com/user-attachments/assets/d58eb270-689d-4cc4-bfd2-e994e0ca2184" />

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
git clone https://github.com/keirialaa/linguaplay.git
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
| `APP_PASSWORD`         | Optional shared password required on all API requests                   |

Frontend env vars (set in `frontend/.env.production` for deployment):

| Variable            | Description                                     |
| ------------------- | ----------------------------------------------- |
| `VITE_API_URL`      | Backend URL (defaults to `http://127.0.0.1:8000`) |
| `VITE_APP_PASSWORD` | Must match `APP_PASSWORD` set on the backend    |

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

## Observability

LangSmith tracing is integrated for monitoring agent behaviour in development. Each user message produces a trace capturing the full reasoning chain: which tool the agent chose to call, the inputs and outputs of each tool, token usage, and latency. This makes it straightforward to debug unexpected tool routing, inspect RAG retrieval quality, and evaluate answer grounding.

To enable, add to your `.env`:

```
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_key_here
LANGCHAIN_PROJECT=linguaplay
```

Planned: LangSmith dataset evaluations to systematically measure retrieval accuracy and answer quality across a curated set of test questions.

## Known limitations

- Session state is held in memory — restarting the server clears conversation history and requires reprocessing any video before chatting
- Designed for single-user local use; no authentication or multi-user persistence layer
- Video processing takes 30–90 seconds depending on video length (Whisper transcription is the bottleneck)

## Roadmap

- [ ] Quiz generation — backend tool implemented, frontend rendering in progress
- [ ] Voice input (speak questions instead of typing)
- [ ] Automated tests (pytest + Vitest)
- [ ] Deployment (Render + Vercel)
