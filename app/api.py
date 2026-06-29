from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel 

load_dotenv()

from core.pipeline import process_video
from core.agent import ask

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoRequest(BaseModel):
    url: str


class ChatMessage(BaseModel):
    text: str
    video_id: str

@app.post("/videos")
def video_pipeline(video_url: VideoRequest):
    return process_video(video_url.url)


@app.post("/chat")
def send_message(message: ChatMessage):
    return ask(message.text, message.video_id)
