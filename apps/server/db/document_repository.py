import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.document_model import Document


class DocumentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, document: Document) -> Document:
        self.db.add(document)
        await self.db.flush()
        await self.db.refresh(document)
        return document

    async def get_by_id(self, doc_id: uuid.UUID) -> Document | None:
        return await self.db.get(Document, doc_id)

    async def list_all(
        self, skip: int = 0, limit: int = 20
    ) -> tuple[list[Document], int]:
        count_query = select(func.count(Document.id))
        total = (await self.db.execute(count_query)).scalar_one()

        query = (
            select(Document)
            .order_by(Document.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all()), total

    async def update(
        self, document: Document, update_data: dict[str, object]
    ) -> Document:
        for key, value in update_data.items():
            setattr(document, key, value)
        await self.db.flush()
        await self.db.refresh(document)
        return document

    async def delete(self, document: Document) -> None:
        await self.db.delete(document)
        await self.db.flush()
