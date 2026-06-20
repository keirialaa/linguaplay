from langchain.tools import tool
from core.vector_store import search_video
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")


def make_tools(video_id: str):
    """Build the agent's tools bound to a specific video.

    video_id is fixed per chat session (see core.agent.get_agent), so the
    LLM never has to supply it itself.
    """

    @tool
    def search_transcript(query: str):
        """
        Search the video transcript for chunks relevant to answer the provided query.
        Args:
            query: Search terms to look for
        """
        chunks = search_video(query, video_id)
        if not chunks:
            return "No relevant context found in this video's transcript."
        return chunks

    @tool
    def explain_language(query: str):
        """
        Provide an explanation for a grammar concept, vocab, idiom, or slang use,
        grounded in context from the video transcript.
        Args:
            query: The word, phrase, or grammar concept to explain
        """
        context_chunks = search_video(query, video_id, top_k=2)
        if not context_chunks:
            return "No relevant context found in this video's transcript."
        context = "\n".join(c["text"] for c in context_chunks)
        prompt = (
            f"You are a language tutor. Using this transcript excerpt:\n{context}\n\n"
            f"Explain the following in context: {query}"
        )
        return llm.invoke(prompt).content

    return [search_transcript, explain_language]
