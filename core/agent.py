import logging
import json
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver
from core.tools import make_tools

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = (
    "You are a language-learning tutor helping a user understand a YouTube video. "
    "Only answer questions about this video's content or about language learning "
    "(grammar, vocabulary, idioms, slang, pronunciation). Decline politely if asked "
    "about anything else. "
    "Use search_transcript to find relevant parts of the video to answer content questions. "
    "Use explain_language to explain grammar, vocabulary, idioms, or slang in context. "
    "Use generate_quiz when the user asks to be tested or quizzed on the video content. "
    "If a tool reports no relevant context was found, tell the user you couldn't find "
    "that in the video rather than answering from your own general knowledge. "
    "When asked about specific vocabulary used in the video, always give the word or "
    "phrase in the original language first, with a transliteration and translation in "
    "parentheses the first time you mention it."
)

checkpointer = InMemorySaver()
_agents = {}


def get_agent(video_id: str):
    """Get (or build) the agent for a specific video, with its tools bound to that video_id."""
    if video_id not in _agents:
        _agents[video_id] = create_agent(
            model="openai:gpt-4o-mini",
            tools=make_tools(video_id),
            system_prompt=SYSTEM_PROMPT,
            checkpointer=checkpointer,
        )
    return _agents[video_id]


def ask(query: str, video_id: str, session_id: str):
    """Send a user message to the video's agent and return its reply."""
    agent = get_agent(video_id)
    result = agent.invoke(
        {"messages": [{"role": "user", "content": query}]},
        config={"configurable": {"thread_id": f"{session_id}:{video_id}"}},
    )
    # Check if the quiz generation tool was used by the agent 
    for msg in reversed(result["messages"]):
        if hasattr(msg, "name") and msg.name == "generate_quiz":
            return {"type": "quiz", "data": json.loads(msg.content)}
    return {"type": "text", "data": result["messages"][-1].content}

