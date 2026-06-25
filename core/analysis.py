from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field


class Expression(BaseModel):
    phrase: str
    explanation: str


class TranscriptAnalysis(BaseModel):
    cefr_level: str = Field(description="CEFR level, e.g. 'B1'")
    complexity: str = Field(description="'Low', 'Medium', or 'High'")
    difficulty_description: str = Field(
        description="Brief explanation of why this level was assigned, "
        "or 'No relevant information detected' if the text is too short/unclear to assess"
    )
    expressions: list[Expression] = Field(
        description="Notable idioms or expressions found, with brief explanations. "
        "Empty list if none are found — do not invent any."
    )
    culture_note: str = Field(
        description="A relevant cultural note about the content, "
        "or 'No relevant information detected' if none applies"
    )


def analyze_transcript(text: str):
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)
    structured_llm = llm.with_structured_output(TranscriptAnalysis)

    prompt = f"""Analyze the following video transcript for a language learner.

    Transcript:
    {text}

    Assess the CEFR level (A1-C2) and complexity (Low/Medium/High) of the language used.
    Identify any notable idioms or expressions, with a brief explanation for each.
    Identify any culturally relevant notes about the content.

    Only report what is actually present in the transcript. Do not invent expressions,
    cultural notes, or difficulty signals that aren't supported by the text — if nothing
    relevant is found for a field, say so explicitly rather than guessing."""

    return structured_llm.invoke(prompt)