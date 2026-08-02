import hashlib
from functools import lru_cache

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from pydantic import SecretStr

from core.config import settings

_embeddings = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    api_key=SecretStr(settings.gemini_api_key),
)


async def generate_embeddings(texts: list[str]) -> list[list[float]]:
    return await _embeddings.aembed_documents(texts)


@lru_cache(maxsize=256)
def _cached_embed_query(text: str) -> str:
    """Cache wrapper: returns a hash -> embedding mapping is done in the async layer.
    We use a two-level cache: the salt is the text itself (deterministic model output)."""
    return text  # lru_cache on text keeps the cache key; actual embedding lookup below


_embed_cache: dict[str, list[float]] = {}


async def generate_embedding(text: str) -> list[float]:
    # Fast path: return cached embedding if available
    cache_key = hashlib.sha256(text.encode()).hexdigest()
    if cache_key in _embed_cache:
        return _embed_cache[cache_key]

    embedding = await _embeddings.aembed_query(text)
    _embed_cache[cache_key] = embedding
    return embedding
