from importlib import import_module

Product = import_module("models.product_model").Product

__all__ = ["Product"]
