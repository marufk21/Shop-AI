from collections.abc import AsyncGenerator

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from controllers import ChatController, DocumentController, ProductController
from core.database import get_db
from db import DocumentRepository, ProductRepository, VectorRepository
from utils.cloudinary import CloudinaryUploader


def get_cloudinary_uploader() -> CloudinaryUploader:
    return CloudinaryUploader()


async def get_product_repository(
    db: AsyncSession = Depends(get_db),
) -> AsyncGenerator[ProductRepository, None]:
    yield ProductRepository(db)


async def get_product_controller(
    repo: ProductRepository = Depends(get_product_repository),
    uploader: CloudinaryUploader = Depends(get_cloudinary_uploader),
) -> AsyncGenerator[ProductController, None]:
    yield ProductController(repo, uploader)


async def get_document_repository(
    db: AsyncSession = Depends(get_db),
) -> AsyncGenerator[DocumentRepository, None]:
    yield DocumentRepository(db)


async def get_vector_repository(
    db: AsyncSession = Depends(get_db),
) -> AsyncGenerator[VectorRepository, None]:
    yield VectorRepository(db)


async def get_document_controller(
    doc_repo: DocumentRepository = Depends(get_document_repository),
    vector_repo: VectorRepository = Depends(get_vector_repository),
) -> AsyncGenerator[DocumentController, None]:
    yield DocumentController(doc_repo, vector_repo)


async def get_chat_controller(
    vector_repo: VectorRepository = Depends(get_vector_repository),
) -> AsyncGenerator[ChatController, None]:
    yield ChatController(vector_repo)
