from importlib import import_module

AdminProductController = import_module(
    "controllers.admin.product_controller"
).AdminProductController
StoreProductController = import_module(
    "controllers.store.product_controller"
).StoreProductController
DocumentController = import_module(
    "controllers.admin.document_controller"
).DocumentController
ChatController = import_module(
    "controllers.admin.chat_controller"
).ChatController

__all__ = [
    "AdminProductController",
    "StoreProductController",
    "DocumentController",
    "ChatController",
]
