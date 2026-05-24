from importlib import import_module

_product_schema = import_module("schemas.product_schema")

ProductBase = _product_schema.ProductBase
ProductCreate = _product_schema.ProductCreate
ProductListResponse = _product_schema.ProductListResponse
ProductResponse = _product_schema.ProductResponse
ProductUpdate = _product_schema.ProductUpdate

__all__ = [
    "ProductBase",
    "ProductCreate",
    "ProductListResponse",
    "ProductResponse",
    "ProductUpdate",
]
