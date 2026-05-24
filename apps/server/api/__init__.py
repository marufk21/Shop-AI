from importlib import import_module

product_routes = import_module("api.product_routes")
store_routes = import_module("api.store_routes")

__all__ = ["product_routes", "store_routes"]
