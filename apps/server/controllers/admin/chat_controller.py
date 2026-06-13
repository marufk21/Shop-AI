import json
from collections.abc import AsyncGenerator

from fastapi.responses import StreamingResponse
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import SecretStr

from core.config import settings
from db.vector_repository import VectorRepository
from schemas.chat_schema import ChatRequest, SourceCitation
from utils.embedding import generate_embedding

SYSTEM_PROMPT = (
    "You are a helpful AI customer support assistant for ShopAI. "
    "Answer customer questions based on the provided context from "
    "store documents (policies, product manuals, FAQs). "
    "Be concise, friendly, and accurate. If the context doesn't "
    "contain the answer, say so honestly and suggest contacting "
    "support. Never make up information that isn't in the provided context."
)

RAG_SYSTEM_PROMPT = (
    "You are a helpful AI customer support assistant for ShopAI. "
    "Use the following context from store documents to answer the "
    "customer's question. Be concise, friendly, and accurate. "
    "If the context doesn't contain the answer, say so honestly "
    "and suggest contacting support. Never make up information "
    "that isn't in the provided context.\n\n"
    "Relevant context:\n{context}"
)


class ChatController:
    def __init__(self, vector_repo: VectorRepository):
        self.vector_repo = vector_repo

    async def stream_response(self, request: ChatRequest) -> StreamingResponse:
        async def event_generator() -> AsyncGenerator[str, None]:
            sources: list[SourceCitation] = []
            context = ""

            if request.use_rag:
                query_embedding = await generate_embedding(request.message)
                results = await self.vector_repo.search_similar(
                    query_embedding, request.top_k
                )

                seen = set()
                for chunk, doc, score in results:
                    context += f"--- {doc.name} ---\n{chunk.content}\n\n"
                    if doc.name not in seen:
                        sources.append(
                            SourceCitation(
                                document_name=doc.name,
                                excerpt=chunk.content[:200],
                                relevance_score=round(score, 4),
                            )
                        )
                        seen.add(doc.name)

            system_content = (
                RAG_SYSTEM_PROMPT.format(context=context) if context else SYSTEM_PROMPT
            )

            llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash",
                api_key=SecretStr(settings.gemini_api_key),
                temperature=request.temperature,
                streaming=True,
            )

            messages = [
                SystemMessage(content=system_content),
                HumanMessage(content=request.message),
            ]

            async for token_chunk in llm.astream(messages):
                token = token_chunk.content
                if isinstance(token, str) and token:
                    yield f"data: {json.dumps({'type': 'token', 'content': token})}\n\n"

            if sources:
                payload = json.dumps(
                    {
                        "type": "sources",
                        "sources": [s.model_dump() for s in sources],
                    }
                )
                yield f"data: {payload}\n\n"

            yield "data: [DONE]\n\n"

        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        )
