from collections.abc import AsyncGenerator

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from controllers import ProductController
from core.database import get_db
from db import ProductRepository
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
