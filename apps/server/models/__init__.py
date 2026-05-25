from importlib import import_module

Product = import_module("models.product_model").Product

_document_model = import_module("models.document_model")
Document = _document_model.Document
DocumentChunk = _document_model.DocumentChunk

__all__ = ["Product", "Document", "DocumentChunk"]
