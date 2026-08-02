from fastapi import HTTPException, status

from db import ProductRepository
from models import Product
from schemas import CategoryListResponse, ProductListResponse, ProductResponse


class StoreProductController:
    def __init__(self, repo: ProductRepository) -> None:
        self.repo = repo

    async def get_store_products(
        self,
        skip: int = 0,
        limit: int = 20,
        category: str | None = None,
        slugs: str | None = None,
    ) -> ProductListResponse:
        slug_list = slugs.split(",") if slugs else None
        items, total = await self.repo.list_all(
            status="active", skip=skip, limit=limit, category=category, slugs=slug_list
        )
        return ProductListResponse(
            items=[ProductResponse.model_validate(p) for p in items],
            total=total,
        )

    async def get_categories(self) -> CategoryListResponse:
        categories = await self.repo.get_categories(status="active")
        return CategoryListResponse(categories=categories)

    async def get_store_product_by_slug(self, slug: str) -> Product:
        product = await self.repo.get_by_slug(slug)
        if product is None or product.status != "active":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found",
            )
        return product
