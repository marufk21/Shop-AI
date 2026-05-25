from importlib import import_module

ProductController = import_module("controllers.product_controller").ProductController
DocumentController = import_module("controllers.document_controller").DocumentController
ChatController = import_module("controllers.chat_controller").ChatController

__all__ = ["ProductController", "DocumentController", "ChatController"]
