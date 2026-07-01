import os
import logging
from pinecone import Pinecone, ServerlessSpec
from langchain_openai import OpenAIEmbeddings

logger = logging.getLogger(__name__)

INDEX_NAME = "linguaplay"

_pc: Pinecone | None = None
_index = None
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")


def _get_client() -> Pinecone:
    global _pc
    if _pc is None:
        api_key = os.environ.get("PINECONE_API_KEY")
        if not api_key:
            raise RuntimeError("PINECONE_API_KEY environment variable is not set.")
        _pc = Pinecone(api_key=api_key)
    return _pc


def get_or_create_index():
    """Get the Pinecone index, creating it first if it doesn't exist yet."""
    global _index
    if _index is None:
        pc = _get_client()
        if not pc.has_index(INDEX_NAME):
            pc.create_index(
                name=INDEX_NAME,
                dimension=1536,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1"),
            )
        _index = pc.Index(INDEX_NAME)
    return _index


def upsert_chunks(index, chunks: list[dict], video_id: str, language: str) -> None:
    """Embed transcript chunks and upsert them into Pinecone."""
    vectors = []
    for i, chunk in enumerate(chunks):
        vector = embeddings.embed_query(chunk["text"])
        vectors.append({
            "id": f"{video_id}_{i}",
            "values": vector,
            "metadata": {
                "video_id": video_id,
                "language": language,
                "start": chunk["start"],
                "end": chunk["end"],
                "text": chunk["text"],
            },
        })
    index.upsert(vectors=vectors)


def search_video(query: str, video_id: str, top_k: int = 5, score_threshold: float = 0.1):
    """Search a video's transcript chunks for relevant content."""
    index = get_or_create_index()
    query_vector = embeddings.embed_query(query)
    results = index.query(
        vector=query_vector,
        filter={"video_id": {"$eq": video_id}},
        top_k=top_k,
        include_metadata=True,
    )
    return [
        match["metadata"]
        for match in results["matches"]
        if match["score"] >= score_threshold
    ]
