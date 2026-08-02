import hashlib

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from pydantic import SecretStr

from core.config import settings

_embeddings = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    api_key=SecretStr(settings.gemini_api_key),
)


async def generate_embeddings(texts: list[str]) -> list[list[float]]:
    return await _embeddings.aembed_documents(texts)



_embed_cache: dict[str, list[float]] = {}


async def generate_embedding(text: str) -> list[float]:
    # Fast path: return cached embedding if available
    cache_key = hashlib.sha256(text.encode()).hexdigest()
    if cache_key in _embed_cache:
        return _embed_cache[cache_key]

    embedding = await _embeddings.aembed_query(text)
    _embed_cache[cache_key] = embedding
    return embedding
