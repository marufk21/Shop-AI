from importlib import import_module

_product_schema = import_module("schemas.product_schema")

ProductBase = _product_schema.ProductBase
ProductCreate = _product_schema.ProductCreate
ProductListResponse = _product_schema.ProductListResponse
ProductResponse = _product_schema.ProductResponse
ProductUpdate = _product_schema.ProductUpdate

_document_schema = import_module("schemas.document_schema")
DocumentResponse = _document_schema.DocumentResponse
DocumentListResponse = _document_schema.DocumentListResponse

_chat_schema = import_module("schemas.chat_schema")
ChatRequest = _chat_schema.ChatRequest
ChatResponse = _chat_schema.ChatResponse
SourceCitation = _chat_schema.SourceCitation

__all__ = [
    "ProductBase",
    "ProductCreate",
    "ProductListResponse",
    "ProductResponse",
    "ProductUpdate",
    "DocumentResponse",
    "DocumentListResponse",
    "ChatRequest",
    "ChatResponse",
    "SourceCitation",
]
