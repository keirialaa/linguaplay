from audio_extraction import download_audio, AudioExtractionError
from chunking import chunk_transcript
from transcription import transcribe_audio
from vector_store import get_or_create_index, upsert_chunks, search_video

VIDEO_URL = "https://www.youtube.com/watch?v=-vKycX4MiRM"

def process_video(url: str) -> dict:
    """Run the full pipeline: download, transcribe, chunk, and store a video.

    Args:
        url: YouTube video URL.

    Returns:
        A dict with video_id, language, and number of chunks stored.

    Raises:
        AudioExtractionError: If the video can't be downloaded.
    """
    # Download audio
    audio_path, info = download_audio(url)
    video_id = info["id"]

    # Transcribe
    segments, language = transcribe_audio(audio_path)
    segments_dicts = [{"start": segment.start, "end": segment.end, "text": segment.text} for segment in segments]

    # Chunk
    chunks = chunk_transcript(segments_dicts)

    # Store in vector DB
    index = get_or_create_index()
    upsert_chunks(index, chunks, video_id, language)

    return {
        "video_id": video_id,
        "language": language,
        "num_chunks": len(chunks),
    }

