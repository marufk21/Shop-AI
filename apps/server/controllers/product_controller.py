import uuid

from fastapi import HTTPException, status

from db import ProductRepository
from models import Product
from schemas import (
    ProductCreate,
    ProductListResponse,
    ProductResponse,
    ProductUpdate,
)
from utils.slug import slugify


class ProductController:
    def __init__(self, repo: ProductRepository) -> None:
        self.repo = repo

    async def create_product(self, data: ProductCreate) -> Product:
        slug = await self._generate_unique_slug(data.name)
        product = Product(
            name=data.name,
            slug=slug,
            description=data.description,
            price=data.price,
            category=data.category,
            inventory=data.inventory,
            status=data.status,
            image_url=data.image_url,
        )
        return await self.repo.create(product)

    async def get_product(self, product_id: uuid.UUID) -> Product:
        product = await self.repo.get_by_id(product_id)
        if product is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found",
            )
        return product

    async def list_products(
        self,
        status_filter: str | None = None,
        search: str | None = None,
        skip: int = 0,
        limit: int = 20,
    ) -> ProductListResponse:
        items, total = await self.repo.list_all(
            status=status_filter, search=search, skip=skip, limit=limit
        )
        return ProductListResponse(
            items=[ProductResponse.model_validate(p) for p in items],
            total=total,
        )

    async def update_product(
        self, product_id: uuid.UUID, data: ProductUpdate
    ) -> Product:
        product = await self.get_product(product_id)

        update_dict = data.model_dump(exclude_unset=True)

        if update_dict.get("name") is not None:
            update_dict["slug"] = await self._generate_unique_slug(
                update_dict["name"], exclude_id=product_id
            )

        return await self.repo.update(product, update_dict)

    async def delete_product(self, product_id: uuid.UUID) -> None:
        product = await self.get_product(product_id)
        await self.repo.delete(product)

    async def get_store_products(
        self, skip: int = 0, limit: int = 20
    ) -> ProductListResponse:
        items, total = await self.repo.list_all(status="active", skip=skip, limit=limit)
        return ProductListResponse(
            items=[ProductResponse.model_validate(p) for p in items],
            total=total,
        )

    async def get_store_product_by_slug(self, slug: str) -> Product:
        product = await self.repo.get_by_slug(slug)
        if product is None or product.status != "active":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found",
            )
        return product

    async def _generate_unique_slug(
        self, name: str, exclude_id: uuid.UUID | None = None
    ) -> str:
        base_slug = slugify(name)
        slug = base_slug

        counter = 1
        while await self.repo.slug_exists(slug, exclude_id=exclude_id):
            slug = f"{base_slug}-{counter}"
            counter += 1

        return slug
