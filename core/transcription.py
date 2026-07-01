import os
from typing import Any
from dotenv import load_dotenv
from openai import OpenAI, OpenAIError

load_dotenv()


class TranscriptionError(Exception):
    """Raised when Whisper fails to transcribe the audio."""
    pass


class EmptyTranscriptError(Exception):
    """Raised when transcription succeeds but produces no usable text."""
    pass


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

    try:
        with open(file_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                model=model_name,
                file=audio_file,
                response_format="verbose_json",
                timestamp_granularities=["segment"],
            )
    except OpenAIError as e:
        raise TranscriptionError(f"Whisper transcription failed: {e}") from e

    if not transcription.segments or not any((s.text or "").strip() for s in transcription.segments):
        raise EmptyTranscriptError("The video appears to have no spoken content.")

    return transcription.segments, transcription.language
