from dotenv import load_dotenv

load_dotenv()

from core.pipeline import process_video
from core.vector_store import search_video

VIDEO_URL = "https://www.youtube.com/watch?v=-vKycX4MiRM"

result = process_video(VIDEO_URL)
video_id = result["video_id"]
query_result = search_video("What are this person's feelings about their exam results?", video_id=video_id)
print(query_result)
