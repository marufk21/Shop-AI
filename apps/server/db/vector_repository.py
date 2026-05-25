import uuid

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.document_model import Document, DocumentChunk


class VectorRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_chunks(self, chunks: list[DocumentChunk]) -> None:
        self.db.add_all(chunks)
        await self.db.flush()

    async def search_similar(
        self, embedding: list[float], top_k: int = 5
    ) -> list[tuple[DocumentChunk, Document, float]]:
        distance = DocumentChunk.embedding.cosine_distance(embedding)
        similarity = 1 - distance

        query = (
            select(DocumentChunk, Document, similarity.label("score"))
            .join(Document, DocumentChunk.document_id == Document.id)
            .where(Document.status == "indexed")
            .order_by(distance)
            .limit(top_k)
        )
        result = await self.db.execute(query)
        rows = result.all()
        return [(row[0], row[1], float(row[2])) for row in rows]

    async def delete_chunks_by_document(self, document_id: uuid.UUID) -> None:
        stmt = delete(DocumentChunk).where(DocumentChunk.document_id == document_id)
        await self.db.execute(stmt)
        await self.db.flush()
