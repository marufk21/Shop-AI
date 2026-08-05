from pydantic import BaseModel, Field


class ChatMessageInput(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    content: str = Field(min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    history: list[ChatMessageInput] = Field(default_factory=list)
    temperature: float = Field(default=0.7, ge=0, le=1)
    use_rag: bool = Field(default=True)
    top_k: int = Field(default=5, ge=1, le=20)


class SourceCitation(BaseModel):
    document_name: str
    excerpt: str
    relevance_score: float | None = None
