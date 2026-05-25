from importlib import import_module

ai_routes = import_module("api.ai_routes")
product_routes = import_module("api.product_routes")
store_routes = import_module("api.store_routes")
upload_routes = import_module("api.upload_routes")
document_routes = import_module("api.document_routes")
chat_routes = import_module("api.chat_routes")

__all__ = [
    "ai_routes",
    "product_routes",
    "store_routes",
    "upload_routes",
    "document_routes",
    "chat_routes",
]
