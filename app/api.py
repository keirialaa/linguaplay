import logging
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

from core.pipeline import process_video
from core.agent import ask
from core.audio_extraction import AudioExtractionError
from core.transcription import TranscriptionError, EmptyTranscriptError

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

app = FastAPI()

allowed_origins = os.environ.get(
    "CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


class VideoRequest(BaseModel):
    url: str


class ChatMessage(BaseModel):
    text: str
    video_id: str
    session_id: str


@app.post("/videos")
def video_pipeline(video_url: VideoRequest):
    try:
        return process_video(video_url.url)
    except AudioExtractionError:
        raise HTTPException(status_code=400, detail="Could not download the video. Please check the URL and make sure it's a public YouTube video.")
    except EmptyTranscriptError:
        raise HTTPException(status_code=422, detail="The video doesn't appear to have any spoken content to transcribe.")
    except TranscriptionError:
        raise HTTPException(status_code=502, detail="Transcription failed. Please try again.")
    except Exception:
        logger.exception("Unexpected error in /videos")
        raise HTTPException(status_code=500, detail="Something went wrong while processing the video. Please try again.")


@app.post("/chat")
def send_message(message: ChatMessage):
    try:
        return ask(message.text, message.video_id, message.session_id)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception:
        logger.exception("Unexpected error in /chat")
        raise HTTPException(status_code=500, detail="Something went wrong. Please try again.")
