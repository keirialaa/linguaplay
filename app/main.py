from dotenv import load_dotenv

load_dotenv()

from core.pipeline import process_video
from core.agent import ask

VIDEO_URL = "https://www.youtube.com/watch?v=-vKycX4MiRM"

result = process_video(VIDEO_URL)
video_id = result["video_id"]
print(f"Video processed: {video_id} ({result['language']}, {result['num_chunks']} chunks)")
print("Ask me anything about this video. Type 'quit' to exit.\n")

while True:
    user_input = input("You: ")
    if user_input.lower() in ("quit", "exit"):
        break
    response = ask(user_input, video_id=video_id)
    print(f"Bot: {response}\n")
