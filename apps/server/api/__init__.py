from importlib import import_module

ai_routes = import_module("api.admin.ai")
chat_routes = import_module("api.admin.chat")
document_routes = import_module("api.admin.documents")
product_routes = import_module("api.admin.products")
upload_routes = import_module("api.admin.upload")
store_routes = import_module("api.store.products")

__all__ = [
    "ai_routes",
    "product_routes",
    "store_routes",
    "upload_routes",
    "document_routes",
    "chat_routes",
]
