from core.audio_extraction import download_audio, AudioExtractionError
from core.chunking import chunk_transcript
from core.transcription import transcribe_audio, TranscriptionError, EmptyTranscriptError
from core.vector_store import get_or_create_index, upsert_chunks
from core.analysis import analyze_transcript

_cached_chunks = {}


def get_chunks(video_id: str):
    if video_id not in _cached_chunks:
        raise KeyError(f"No transcript cached for video '{video_id}'. The server may have restarted — please reprocess the video.")
    return _cached_chunks[video_id]


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
    title = info["title"]
    duration = info["duration"]
    channel = info["channel"]


    # Transcribe
    segments, language = transcribe_audio(audio_path)
    segments_dicts = [{"start": segment.start, "end": segment.end, "text": segment.text} for segment in segments]
    full_text = " ".join([segment["text"] for segment in segments_dicts])

    # Chunk
    chunks = chunk_transcript(segments_dicts)

    # Store in vector DB
    index = get_or_create_index()
    upsert_chunks(index, chunks, video_id, language)
    _cached_chunks[video_id] = chunks

    # Analyze the video 
    analysis = analyze_transcript(full_text)

    return {
        "video_id": video_id,
        "language": language,
        "num_chunks": len(chunks),
        "title": title,
        "duration": duration,
        "channel": channel, 
        "analysis": analysis, 
        "chunks": chunks
    }


