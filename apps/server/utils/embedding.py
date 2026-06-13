from langchain_google_genai import GoogleGenerativeAIEmbeddings
from pydantic import SecretStr

from core.config import settings

_embeddings = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    api_key=SecretStr(settings.gemini_api_key),
)


async def generate_embeddings(texts: list[str]) -> list[list[float]]:
    return await _embeddings.aembed_documents(texts)


async def generate_embedding(text: str) -> list[float]:
    return await _embeddings.aembed_query(text)
