"""LangChain tool factories for the multi-agent graph.

Each factory closes over a per-request ``AsyncSession`` so that tools
share the same database transaction as the rest of the request.
"""

import json

from langchain_core.tools import BaseTool, tool
from sqlalchemy.ext.asyncio import AsyncSession

from db.product_repository import ProductRepository
from db.vector_repository import VectorRepository
from utils.embedding import generate_embedding


def get_product_tools(db: AsyncSession) -> list[BaseTool]:
    """Return product-related tools bound to the given session."""

    repo = ProductRepository(db)

    @tool
    async def search_products(  # noqa: N802
        query: str,
        category: str | None = None,
        max_price: float | None = None,
        limit: int = 5,
    ) -> str:
        """Search the product catalog by name, category, and price range.

        Use this when a customer wants to find, browse, filter, or compare
        products. Returns a JSON array of matching products.
        """

        products, _ = await repo.list_all(
            status="published",
            search=query if query else None,
            category=category,
            limit=limit * 2 if max_price else limit,
        )

        results = []
        for p in products:
            if max_price is not None and float(p.price) > max_price:
                continue
            results.append(
                {
                    "name": p.name,
                    "slug": p.slug,
                    "price": float(p.price),
                    "category": p.category,
                    "description": p.description,
                    "image_url": p.image_url,
                    "inventory": p.inventory,
                }
            )
            if len(results) >= limit:
                break

        return json.dumps(results) if results else "No products found."

    @tool
    async def recommend_products(  # noqa: N802
        category: str | None = None,
        limit: int = 5,
    ) -> str:
        """Recommend products from the catalog.

        Use this when a customer wants suggestions, recommendations, or
        browsing inspiration. Returns a JSON array of products.
        """

        products, _ = await repo.list_all(
            status="published",
            category=category,
            limit=limit,
        )

        results = [
            {
                "name": p.name,
                "slug": p.slug,
                "price": float(p.price),
                "category": p.category,
                "description": p.description,
            }
            for p in products
        ]

        return json.dumps(results) if results else "No products available."

    return [search_products, recommend_products]


def get_support_tools(db: AsyncSession) -> list[BaseTool]:
    """Return RAG document-search tools bound to the given session."""

    vector_repo = VectorRepository(db)

    @tool
    async def search_documents(query: str, top_k: int = 5) -> str:
        """Search store documents (policies, FAQs, manuals) using semantic
        search. Use this when a customer asks about shipping, returns,
        privacy, gift wrapping, order tracking, or store policies.
        """

        embedding = await generate_embedding(query)
        results = await vector_repo.search_similar(embedding, top_k)

        if not results:
            return "No relevant documents found."

        context = ""
        for chunk, doc, _score in results:
            context += f"--- {doc.name} ---\n{chunk.content}\n\n"

        return context

    return [search_documents]
