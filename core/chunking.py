def chunk_transcript(
    segments: list[dict],
    chunk_duration: float = 30.0,
) -> list[dict]:
    """Group Whisper segments into time-based chunks for embedding.

    Args:
        segments: Whisper output segments, each with 'start', 'end', 'text'.
        chunk_duration: Target duration (in seconds) per chunk.

    Returns:
        List of chunks, each with 'text', 'start', 'end'.
    """
    chunks = []
    current_chunk = {"text": "", "start": None, "end": None}

    for seg in segments:
        if current_chunk["start"] is None:
            current_chunk["start"] = seg["start"]
        current_chunk["text"] += " " + seg["text"]
        current_chunk["end"] = seg["end"]

        if current_chunk["end"] - current_chunk["start"] >= chunk_duration:
            chunks.append(current_chunk)
            current_chunk = {"text": "", "start": None, "end": None}

    if current_chunk["text"]:
        chunks.append(current_chunk)

    return chunks