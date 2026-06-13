import os 
from typing import Any
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

def transcribe_audio(file_path: str, model_name: str = "whisper-1") -> Any:
    """Transcribe an audio track. 
    Args:
        file_path: Path to the audio file on your local machine. 
        model_name: OpenAI transcription model to use (defaults to gpt-4o-mini-transcribe)

    Returns:
        Transcribed text string.
    """
    client = OpenAI()

    # If specified file path does not exist 
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"The audio file at {file_path} was not found.")

    with open(file_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
        model=model_name,
        file=audio_file,
        response_format="verbose_json",
        timestamp_granularities=["segment"],
    )
    return transcription.segments, transcription.language 


print(transcribe_audio("downloads/kllPRPFmi1c.mp3"))