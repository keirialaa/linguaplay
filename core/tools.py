from langchain.tools import tool
from core.vector_store import search_video
from core.pipeline import get_chunks
from langchain_openai import ChatOpenAI
from pydantic import BaseModel

llm = ChatOpenAI(model="gpt-4o-mini")


class QuizQuestion(BaseModel):
    question: str
    correct_answer: str
    timestamp: float
    options: list[str]


class Quiz(BaseModel):
    questions: list[QuizQuestion]


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
    

    @tool
    def generate_quiz():
        """
        Generate a 20-question quiz to test the user's understanding of the video content and the language used.
        For each question, set timestamp to the start value of the transcript chunk the question is based on.
        Base every question strictly on what's in the provided chunks; do not invent content.
        """
        try:
            chunks = get_chunks(video_id)
        except KeyError:
            return "Quiz unavailable: please reprocess the video first."
        structured_llm = llm.with_structured_output(Quiz)
        prompt = f"""Generate a 20-question quiz based on the following transcript chunks:
        {chunks}. Use a mix of questions aimed at testing understanding of the content,
        and questions about the specific language used."""
        result: Quiz = structured_llm.invoke(prompt)  # type: ignore[assignment]
        return result.model_dump()

    return [search_transcript, explain_language, generate_quiz]
