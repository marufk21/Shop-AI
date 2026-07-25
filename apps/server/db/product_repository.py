import uuid

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from models import Product


class ProductRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(self, product: Product) -> Product:
        self.db.add(product)
        await self.db.flush()
        await self.db.refresh(product)
        return product

    async def get_by_id(self, product_id: uuid.UUID) -> Product | None:
        return await self.db.get(Product, product_id)

    async def get_by_slug(self, slug: str) -> Product | None:
        result = await self.db.execute(select(Product).where(Product.slug == slug))
        return result.scalar_one_or_none()

    async def slug_exists(self, slug: str, exclude_id: uuid.UUID | None = None) -> bool:
        query = select(Product.id).where(Product.slug == slug)
        if exclude_id is not None:
            query = query.where(Product.id != exclude_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none() is not None

    async def list_all(
        self,
        status: str | None = None,
        search: str | None = None,
        category: str | None = None,
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Product], int]:
        query = select(Product)
        count_query = select(func.count(Product.id))

        if status is not None:
            query = query.where(Product.status == status)
            count_query = count_query.where(Product.status == status)

        if category is not None:
            cat_filter = or_(
                Product.category == category,
                Product.category.ilike(f"{category} >%"),
            )
            query = query.where(cat_filter)
            count_query = count_query.where(cat_filter)

        if search is not None:
            search_filter = Product.name.ilike(f"%{search}%")
            query = query.where(search_filter)
            count_query = count_query.where(search_filter)

        count_result = await self.db.execute(count_query)
        total = count_result.scalar() or 0

        result = await self.db.execute(
            query.order_by(Product.created_at.desc()).offset(skip).limit(limit)
        )
        items = list(result.scalars().all())

        return items, total

    async def update(self, product: Product, update_data: dict[str, object]) -> Product:
        for key, value in update_data.items():
            setattr(product, key, value)
        await self.db.flush()
        await self.db.refresh(product)
        return product

    async def create_batch(self, products: list[Product]) -> list[Product]:
        self.db.add_all(products)
        await self.db.flush()
        return products

    async def slugs_exist(self, slugs: list[str]) -> set[str]:
        if not slugs:
            return set()
        result = await self.db.execute(
            select(Product.slug).where(Product.slug.in_(slugs))
        )
        return {row[0] for row in result.all()}

    async def get_categories(
        self, status: str | None = None
    ) -> list[dict[str, object]]:
        query = select(Product.category, func.count(Product.id).label("count"))
        if status is not None:
            query = query.where(Product.status == status)
        query = query.group_by(Product.category).order_by(func.count(Product.id).desc())

        result = await self.db.execute(query)
        rows = result.all()

        # Aggregate into master categories (first segment before ">")
        master_counts: dict[str, int] = {}
        for row in rows:
            cat = row[0]
            count = row[1]
            master = cat.split(">")[0].strip()
            master_counts[master] = master_counts.get(master, 0) + count

        return [
            {"name": name, "count": count}
            for name, count in sorted(
                master_counts.items(), key=lambda x: x[1], reverse=True
            )
        ]

    async def delete(self, product: Product) -> None:
        await self.db.delete(product)
        await self.db.flush()
