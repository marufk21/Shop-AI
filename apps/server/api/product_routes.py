import uuid

from fastapi import APIRouter, Depends, Query, status

from controllers import ProductController
from core.dependencies import get_product_controller
from schemas import (
    ProductCreate,
    ProductListResponse,
    ProductResponse,
    ProductUpdate,
)

router = APIRouter(prefix="/api/v1/products", tags=["products"])


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    data: ProductCreate,
    controller: ProductController = Depends(get_product_controller),
) -> ProductResponse:
    product = await controller.create_product(data)
    return ProductResponse.model_validate(product)


@router.get("", response_model=ProductListResponse)
async def list_products(
    status_filter: str | None = Query(default=None, alias="status"),
    search: str | None = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    controller: ProductController = Depends(get_product_controller),
) -> ProductListResponse:
    return await controller.list_products(
        status_filter=status_filter, search=search, skip=skip, limit=limit
    )


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: uuid.UUID,
    controller: ProductController = Depends(get_product_controller),
) -> ProductResponse:
    product = await controller.get_product(product_id)
    return ProductResponse.model_validate(product)


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: uuid.UUID,
    data: ProductUpdate,
    controller: ProductController = Depends(get_product_controller),
) -> ProductResponse:
    product = await controller.update_product(product_id, data)
    return ProductResponse.model_validate(product)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: uuid.UUID,
    controller: ProductController = Depends(get_product_controller),
) -> None:
    await controller.delete_product(product_id)
