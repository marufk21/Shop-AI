from fastapi import APIRouter, Depends, Query

from controllers.store.product_controller import StoreProductController
from core.dependencies import get_store_product_controller
from schemas import ProductListResponse, ProductResponse

router = APIRouter(prefix="/api/v1/store", tags=["store"])


@router.get("/products", response_model=ProductListResponse)
async def list_store_products(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    controller: StoreProductController = Depends(get_store_product_controller),
) -> ProductListResponse:
    return await controller.get_store_products(skip=skip, limit=limit)


@router.get("/products/{slug}", response_model=ProductResponse)
async def get_store_product(
    slug: str,
    controller: StoreProductController = Depends(get_store_product_controller),
) -> ProductResponse:
    product = await controller.get_store_product_by_slug(slug)
    return ProductResponse.model_validate(product)
