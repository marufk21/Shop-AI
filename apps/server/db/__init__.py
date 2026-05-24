from importlib import import_module

ProductRepository = import_module("db.product_repository").ProductRepository

__all__ = ["ProductRepository"]
