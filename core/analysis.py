from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field


class VocabularyItem(BaseModel):
    term: str
    translation: str
    context: str = Field(
        description="1-2 sentences showing how this term was actually used "
        "in the transcript — not an invented example sentence."
    )


class Expression(BaseModel):
    phrase: str
    explanation: str = Field(
        description="A brief, direct meaning/usage explanation, written as the "
        "definition itself — not as a sentence describing the expression. "
        "E.g. for 'day and night': 'significant difference between two situations, "
        "often used to emphasize improvement or change.' Do NOT start with phrases "
        "like 'this expression means' or 'this idiom means' — just state the meaning."
    )


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
        description="A cultural practice, norm, or convention specific to the country/"
        "culture where the video's language is spoken, anchored to a specific word, "
        "phrase, or behavior actually used in the transcript — not a summary of what "
        "the video is about. 'No relevant information detected' if none applies."
    )
    vocabulary: list[VocabularyItem] = Field(
        description="10-20 notable vocabulary terms specific to this video's content. "
        "Exclude generic/common words (e.g. 'this', 'good', 'walk') and exclude anything "
        "already covered in expressions — vocabulary should be individual words or short "
        "phrases worth learning, not idioms."
    )


def analyze_transcript(text: str):
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)
    structured_llm = llm.with_structured_output(TranscriptAnalysis)

    prompt = f"""Analyze the following video transcript for a language learner.

    Transcript:
    {text}

    Assess the CEFR level (A1-C2) and complexity (Low/Medium/High) of the language used.
    Identify any notable idioms or expressions. For each, give a brief, direct
    explanation of its meaning/usage — write it as the definition itself, not as a
    sentence describing the expression. For example, for "day and night" write
    "significant difference between two situations, often used to emphasize
    improvement or change" — NOT "this expression means there is a significant
    difference..." or "this idiom is used to describe...". Never start an explanation
    with "this expression means" or "this idiom means".

    For the culture note, do NOT summarize what the video is about or describe its
    topic/setting. Instead, find a specific word, phrase, or way someone speaks/behaves
    in the transcript that reflects a cultural norm a foreign learner wouldn't know, and
    explain that norm. For example: if a Persian speaker addresses someone as "khanum"
    or calls a stranger "auntie"/"uncle", the note should explain that in Iran it's
    common to address older people this way regardless of actual family relation — not
    that "the video shows someone interviewing people on the street." If the transcript
    doesn't contain anything like this, say so rather than describing the video's
    content instead.

    Only report what is actually present in the transcript. Do not invent expressions,
    cultural notes, or difficulty signals that aren't supported by the text — if nothing
    relevant is found for a field, say so explicitly rather than guessing."""

    return structured_llm.invoke(prompt)