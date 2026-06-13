import os 
from pinecone import Pinecone, ServerlessSpec
from langchain_openai import OpenAIEmbeddings

INDEX_NAME = "linguaplay"

pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")


def get_or_create_index():
    """Get the Pinecone index, creating it first if it doesn't exist yet."""
    if not pc.has_index(INDEX_NAME):
        pc.create_index(
            name=INDEX_NAME,
            dimension=1536,  
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1"),
        )
    return pc.Index(INDEX_NAME)


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


def search_video(query: str, video_id: str, top_k: int = 5):
    """Search a video's transcript chunks for relevant content."""
    query_vector = embeddings.embed_query(query)
    results = index.query(
        vector=query_vector,
        filter={"video_id": {"$eq": video_id}},
        top_k=top_k,
        include_metadata=True,
    )
    return [match["metadata"] for match in results["matches"]]



index = get_or_create_index()


