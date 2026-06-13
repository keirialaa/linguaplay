import yt_dlp
from yt_dlp.utils import DownloadError
from typing import Any, cast


class AudioExtractionError(Exception):
    """Raised when audio can't be downloaded from the provided URL."""
    pass 


def download_audio(url: str, output_path: str="downloads/%(id)s.%(ext)s") -> tuple[str, Any]:
    """Download the audio track from a YouTube video as an MP3 file.

    Args:
        url: The YouTube video URL.
        output_path: Output filename template, using yt-dlp's
            templating syntax (e.g. %(id)s for video ID).

    Returns:
        A tuple of (path to the downloaded MP3 file, yt-dlp info dict
        containing video metadata).
    """
    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": output_path,
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }],
    }
    try: 
        with yt_dlp.YoutubeDL(cast(Any, ydl_opts)) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
            # adjust extension
            audio_path = filename.rsplit(".", 1)[0] + ".mp3"
            return audio_path, info
    except DownloadError as e:
        raise AudioExtractionError(f"Could not donload audio from '{url}': {e}") from e
    


