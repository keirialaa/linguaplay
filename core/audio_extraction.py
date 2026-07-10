import imageio_ffmpeg
import os
import tempfile
import yt_dlp
from yt_dlp.utils import YoutubeDLError
from typing import Any, cast

MAX_DURATION_SECONDS = 30 * 60


class AudioExtractionError(Exception):
    """Raised when audio can't be downloaded from the provided URL."""
    pass


class VideoTooLongError(Exception):
    """Raised when the video exceeds the maximum allowed duration."""
    pass


def download_audio(url: str, output_path: str = "downloads/%(id)s.%(ext)s") -> tuple[str, Any]:
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
        "ffmpeg_location": imageio_ffmpeg.get_ffmpeg_exe(),
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }],
    }

    # if YOUTUBE_COOKIES env var is set, write to a temp file and pass to yt-dlp
    cookies_content = os.environ.get("YOUTUBE_COOKIES")
    cookies_file = None
    if cookies_content:
        cookies_file = tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False)
        cookies_file.write(cookies_content)
        cookies_file.close()
        ydl_opts["cookiefile"] = cookies_file.name
    try:
        with yt_dlp.YoutubeDL(cast(Any, ydl_opts)) as ydl:
            # fetch metadata first to check duration before downloading
            info = ydl.extract_info(url, download=False)
            duration = info.get("duration")
            if duration and duration > MAX_DURATION_SECONDS:
                minutes = MAX_DURATION_SECONDS // 60
                raise VideoTooLongError(
                    f"Video is too long ({duration // 60} min). "
                    f"Maximum supported duration is {minutes} minutes."
                )
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
            audio_path = filename.rsplit(".", 1)[0] + ".mp3"
            return audio_path, info
    except (AudioExtractionError, VideoTooLongError):
        raise
    except YoutubeDLError as e:
        raise AudioExtractionError(f"Could not download audio from '{url}': {e}") from e
    finally:
        if cookies_file and os.path.exists(cookies_file.name):
            os.unlink(cookies_file.name)
