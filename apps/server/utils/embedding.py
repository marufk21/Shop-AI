from langchain_openai import OpenAIEmbeddings
from pydantic import SecretStr

from core.config import settings

_embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small",
    api_key=SecretStr(settings.openai_api_key),
)


async def generate_embeddings(texts: list[str]) -> list[list[float]]:
    return await _embeddings.aembed_documents(texts)


async def generate_embedding(text: str) -> list[float]:
    return await _embeddings.aembed_query(text)
