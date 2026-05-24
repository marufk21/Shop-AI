from importlib import import_module

ProductController = import_module("controllers.product_controller").ProductController

__all__ = ["ProductController"]
